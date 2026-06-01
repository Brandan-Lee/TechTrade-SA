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
        throw new Exception("Could not connect to the database.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Unauthorized Access. Please log in.");
    }
    $userIdValue = intval($activeUserId);

    // -------------------------------------------------------------------------
    // Clean, Simplified SQL Execution Block (Basic Joins Only)
    // -------------------------------------------------------------------------
    $sql = "
        SELECT 
            n.id, n.type, n.title, n.body, n.status, n.offer_id, n.transaction_id, n.listing_id, 
            n.is_read, n.created_at,
            l.title AS direct_listing_title, l.seller_id AS listing_seller_id,
            o.amount_cents AS offer_amount, o.buyer_id AS offer_buyer_id,
            tx.agreed_price_cents AS tx_amount, tx.buyer_id AS tx_buyer_id, tx.seller_id AS tx_seller_id,
            b.first_name AS buyer_fn, b.last_name AS buyer_ln,
            s.first_name AS seller_fn, s.last_name AS seller_ln
        FROM notifications n
        LEFT JOIN listings l ON n.listing_id = l.id
        LEFT JOIN offers o ON n.offer_id = o.id
        LEFT JOIN transactions tx ON n.transaction_id = tx.id
        LEFT JOIN users b ON (o.buyer_id = b.id OR tx.buyer_id = b.id)
        LEFT JOIN users s ON (l.seller_id = s.id OR tx.seller_id = s.id)
        WHERE n.user_id = ? 
          AND n.is_deleted = 0
        ORDER BY n.created_at DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$userIdValue]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $notifications = [];

    foreach ($rows as $row) {
        $buyerFn = $row['buyer_fn'] ?? '';
        $buyerLn = $row['buyer_ln'] ?? '';
        $sellerFn = $row['seller_fn'] ?? '';
        $sellerLn = $row['seller_ln'] ?? '';

        // Decrypt profile data if available
        if ($crypto) {
            if (!empty($buyerFn))  $buyerFn  = $crypto->decrypt($buyerFn) ?? $buyerFn;
            if (!empty($buyerLn))  $buyerLn  = $crypto->decrypt($buyerLn) ?? $buyerLn;
            if (!empty($sellerFn)) $sellerFn = $crypto->decrypt($sellerFn) ?? $sellerFn;
            if (!empty($sellerLn)) $sellerLn = $crypto->decrypt($sellerLn) ?? $sellerLn;
        }

        $buyerName = trim($buyerFn . ' ' . $buyerLn);
        $sellerName = trim($sellerFn . ' ' . $sellerLn);

        // Handle offer amount formatting cleanly in native PHP arrays
        $rawCents = $row['offer_amount'] ?? $row['tx_amount'] ?? null;
        $formattedAmount = ($rawCents !== null) ? number_format(intval($rawCents) / 100, 2) : null;

        // Verify context user role identity
        $sellerIdContext = $row['listing_seller_id'] ?? $row['tx_seller_id'] ?? null;
        $isSeller = ($sellerIdContext !== null && intval($sellerIdContext) === $userIdValue) ? 1 : 0;

        $notifications[] = [
            "id" => intval($row['id']),
            "type" => $row['type'],
            "title" => $row['title'],
            "body" => $row['body'],
            "status" => $row['status'],
            "offer_id" => $row['offer_id'] ? intval($row['offer_id']) : null,
            "transaction_id" => $row['transaction_id'] ? intval($row['transaction_id']) : null,
            "listing_id" => $row['listing_id'] ? intval($row['listing_id']) : null,
            "is_read" => (intval($row['is_read']) === 1) ? 1 : 0,
            "created_at" => $row['created_at'],
            "listingName" => $row['direct_listing_title'] ?? "Item",
            "offerAmount" => $formattedAmount,
            "buyerName" => !empty($buyerName) ? $buyerName : "User",
            "sellerName" => !empty($sellerName) ? $sellerName : "Seller",
            "isSeller" => $isSeller
        ];
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "notifications" => $notifications
    ]);
} catch (Exception $e) {
    http_response_code(http_response_code() === 200 ? 400 : http_response_code());
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["status" => "error", "error" => "An internal system error occurred.", "debug" => $t->getMessage()]);
}
