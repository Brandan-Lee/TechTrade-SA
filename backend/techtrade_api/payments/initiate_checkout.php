<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

function generateSignature($data, $passPhrase = null)
{
    $pfOutput = '';
    foreach ($data as $key => $val) {
        if ($val !== '') {
            $pfOutput .= $key . '=' . urlencode(trim($val)) . '&';
        }
    }
    $getString = substr($pfOutput, 0, -1);
    if ($passPhrase !== null) {
        $getString .= '&passphrase=' . urlencode(trim($passPhrase));
    }
    return md5($getString);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception("This action is not supported.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Your session has expired. Please log in again to pay.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $transactionId = isset($input['transaction_id']) ? intval($input['transaction_id']) : null;

    if (!$transactionId) {
        http_response_code(400);
        throw new Exception("Please specify a valid transaction.");
    }

    $stmt = $db->prepare("
        SELECT t.*, l.title, u.email, u.first_name, u.last_name
        FROM transactions t 
        INNER JOIN listings l ON t.listing_id = l.id 
        INNER JOIN users u ON t.buyer_id = u.id 
        WHERE t.id = ? LIMIT 1
    ");
    $stmt->execute([$transactionId]);
    $tx = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tx) {
        http_response_code(404);
        throw new Exception("The requested transaction could not be found.");
    }

    if (intval($tx['buyer_id']) !== intval($activeUserId)) {
        http_response_code(403);
        throw new Exception("Access Denied. You do not have permission to pay for this item.");
    }

    $firstName = $tx['first_name'] ?? 'TechTrade';
    $lastName = $tx['last_name'] ?? 'Buyer';

    if (class_exists('EncryptionEngine') && defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
        $firstName = !empty($firstName) ? ($crypto->decrypt($firstName) ?? $firstName) : 'TechTrade';
        $lastName = !empty($lastName) ? ($crypto->decrypt($lastName) ?? $lastName) : 'Buyer';
    }

    $payfastData = [
        'merchant_id'    => PAYFAST_MERCHANT_ID,
        'merchant_key'   => PAYFAST_MERCHANT_KEY,
        'return_url'     => "http://localhost:5173/payments/success?transaction_id=" . $tx['id'],
        'cancel_url'     => "http://localhost:5173/payments/cancel?transaction_id=" . $tx['id'],
        'notify_url'     => "https://yourdomain.com/api/v1/payments/payfast-webhook.php",
        'name_first'     => trim($firstName),
        'name_last'      => trim($lastName),
        'email_address'  => $tx['email'],
        'm_payment_id'   => strval($tx['id']),
        'amount'         => number_format(($tx['agreed_price_cents'] / 100), 2, '.', ''),
        'item_name'      => $tx['public_id'] . " - " . $tx['title'],
        'payment_method' => 'cc'
    ];

    $signature = generateSignature($payfastData, PAYFAST_PASSPHRASE);
    $payfastData['signature'] = $signature;

    $checkStmt = $db->prepare("SELECT id, status FROM payments WHERE transaction_id = ? LIMIT 1");
    $checkStmt->execute([$tx['id']]);
    $existingPayment = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$existingPayment) {
        $sqlInsertPayment = "
            INSERT INTO payments (
                transaction_id, 
                payer_id, 
                provider, 
                m_payment_id, 
                amount_cents, 
                currency, 
                status, 
                merchant_id, 
                notify_url, 
                return_url, 
                cancel_url
            ) VALUES (?, ?, 'payfast', ?, ?, 'ZAR', 'initiated', ?, ?, ?, ?)
        ";

        $insertStmt = $db->prepare($sqlInsertPayment);
        $insertStmt->execute([
            $tx['id'],
            intval($activeUserId),
            strval($tx['id']),
            $tx['agreed_price_cents'],
            PAYFAST_MERCHANT_ID,
            $payfastData['notify_url'],
            $payfastData['return_url'],
            $payfastData['cancel_url']
        ]);
    } else {
        if (in_array($existingPayment['status'], ['initiated', 'failed', 'cancelled'])) {
            $updateStmt = $db->prepare("
                UPDATE payments 
                SET status = 'initiated', updated_at = NOW() 
                WHERE transaction_id = ?
            ");
            $updateStmt->execute([$tx['id']]);
        }
    }

    $pfHost = PAYFAST_SANDBOX_MODE ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "redirect_url" => "https://" . $pfHost . "/eng/process",
        "checkout_details" => $payfastData
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(500);
    }
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
}
