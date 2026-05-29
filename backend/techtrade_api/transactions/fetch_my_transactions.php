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
            t.created_at,
            l.title AS listing_title,
            img.url AS primary_image_url,
            u.first_name AS buyer_fn,
            u.last_name AS buyer_ln
        FROM transactions t
        INNER JOIN listings l ON t.listing_id = l.id
        INNER JOIN users u ON t.buyer_id = u.id
        LEFT JOIN listing_images img ON l.id = img.listing_id AND img.is_primary = 1
        WHERE t.buyer_id = ? OR t.seller_id = ?
        ORDER BY t.created_at DESC
    ";

    $stmt = $db->prepare($sqlFetch);
    $stmt->execute([$userIdValue, $userIdValue]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $compiledTransactions = [];
    foreach ($rows as $row) {
        $firstName = $row['buyer_fn'];
        $lastName = $row['buyer_ln'];

        if ($crypto) {
            if (!empty($firstName)) {
                $firstName = $crypto->decrypt($firstName) ?? $firstName;
            }
            if (!empty($lastName)) {
                $lastName = $crypto->decrypt($lastName) ?? $lastName;
            }
        }

        $fullName = trim($firstName . ' ' . $lastName);
        if (empty($fullName)) {
            $fullName = "Anonymous Operator";
        }

        $imgUrl = $row['primary_image_url'];
        if (!empty($imgUrl) && function_exists('publicMediaUrl')) {
            $imgUrl = publicMediaUrl($imgUrl);
        }

        $compiledTransactions[] = [
            "id" => intval($row['id']),
            "public_id" => $row['public_id'],
            "listing_id" => intval($row['listing_id']),
            "offer_id" => $row['offer_id'] ? intval($row['offer_id']) : null,
            "buyer_id" => intval($row['buyer_id']),
            "seller_id" => intval($row['seller_id']),
            "agreed_price_cents" => intval($row['agreed_price_cents']),
            "status" => $row['status'],
            "escrow_step" => intval($row['escrow_step']),
            "escrow_released" => intval($row['escrow_released']),
            "created_at" => $row['created_at'],
            "listing_title" => $row['listing_title'],
            "primary_image_url" => $imgUrl ? $imgUrl : null,
            "buyer_name" => $fullName
        ];
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "transactions" => $compiledTransactions
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "error" => "Internal transactional ledger processing processing error.",
        "debug" => $t->getMessage()
    ]);
}
