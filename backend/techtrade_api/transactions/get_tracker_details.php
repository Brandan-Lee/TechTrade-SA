<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        throw new Exception("Method Not Allowed.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';
    require_once __DIR__ . '/../helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not establish a clean connection to the database.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Unauthorized Access.");
    }

    $userIdValue = intval($activeUserId);
    $transactionId = isset($_GET['transaction_id']) ? intval($_GET['transaction_id']) : 0;

    if ($transactionId <= 0) {
        http_response_code(400);
        throw new Exception("Required parameter 'transaction_id' is missing or malformed.");
    }

    // 1. Fetch main transaction details
    $sqlFetch = "
        SELECT 
            t.id,
            t.public_id,
            t.listing_id,
            t.offer_id,
            t.buyer_id,
            t.seller_id,
            t.agreed_price_cents,
            t.status,
            t.escrow_step,
            t.escrow_released,
            l.title AS listing_title,
            b.first_name AS buyer_fn, b.last_name AS buyer_ln,
            s.first_name AS seller_fn, s.last_name AS seller_ln
        FROM transactions t
        INNER JOIN listings l ON t.listing_id = l.id
        INNER JOIN users b ON t.buyer_id = b.id
        INNER JOIN users s ON t.seller_id = s.id
        WHERE t.id = ? LIMIT 1
    ";

    $stmt = $db->prepare($sqlFetch);
    $stmt->execute([$transactionId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        throw new Exception("Transaction records matching that specific ID could not be found.");
    }

    // 2. Fetch transaction events for the history log
    $sqlEvents = "
        SELECT event_type, created_at 
        FROM transaction_events 
        WHERE transaction_id = ? 
        ORDER BY created_at ASC
    ";
    $stmtEvents = $db->prepare($sqlEvents);
    $stmtEvents->execute([$transactionId]);
    $events = $stmtEvents->fetchAll(PDO::FETCH_ASSOC);

    // Role verification
    $assignedRole = "";
    $buyerId = intval($row['buyer_id']);
    $sellerId = intval($row['seller_id']);

    if ($userIdValue === $buyerId) {
        $assignedRole = "buyer";
    } elseif ($userIdValue === $sellerId) {
        $assignedRole = "seller";
    } else {
        http_response_code(403);
        throw new Exception("Access Denied: You are not an authorized participant in this agreement.");
    }

    // Decryption logic
    $buyerFN = $row['buyer_fn'];
    $buyerLN = $row['buyer_ln'];
    $sellerFN = $row['seller_fn'];
    $sellerLN = $row['seller_ln'];

    if ($crypto) {
        $buyerFN = !empty($buyerFN) ? ($crypto->decrypt($buyerFN) ?? $buyerFN) : '';
        $buyerLN = !empty($buyerLN) ? ($crypto->decrypt($buyerLN) ?? $buyerLN) : '';
        $sellerFN = !empty($sellerFN) ? ($crypto->decrypt($sellerFN) ?? $sellerFN) : '';
        $sellerLN = !empty($sellerLN) ? ($crypto->decrypt($sellerLN) ?? $sellerLN) : '';
    }

    $buyerName = trim($buyerFN . ' ' . $buyerLN);
    $sellerName = trim($sellerFN . ' ' . $sellerLN);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => [
            "id" => intval($row['id']),
            "public_id" => $row['public_id'],
            "title" => $row['listing_title'],
            "agreed_price_cents" => intval($row['agreed_price_cents']),
            "escrow_step" => intval($row['escrow_step']),
            "status" => $row['status'],
            "assigned_role" => $assignedRole,
            "buyer_id" => $buyerId,   
            "seller_id" => $sellerId,
            "buyer_name" => !empty($buyerName) ? $buyerName : "Anonymous Buyer",
            "seller_name" => !empty($sellerName) ? $sellerName : "Anonymous Seller",
            "events" => $events
        ]
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal transactional ledger processing error.",
        "debug" => $t->getMessage()
    ]);
}
