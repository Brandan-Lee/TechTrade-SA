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
    // 1. Capture the numeric ID
    $idParam = $_GET['public_id'] ?? null;

    if (!$idParam || !is_numeric($idParam)) {
        http_response_code(400);
        throw new Exception("Invalid or missing numeric transaction ID.");
    }

    $transactionId = (int)$idParam;

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';
    require_once __DIR__ . '/../helpers/session_manager.php';

    $db = Database::getConnection();
    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Unauthorized.");
    }

    // 2. Query using the BIGINT primary key 'id'
    $sqlFetch = "
        SELECT 
            t.public_id, t.buyer_id, t.seller_id,
            l.title AS item_title,
            b.first_name AS buyer_fn, b.last_name AS buyer_ln, b.mobile AS buyer_mob,
            s.first_name AS seller_fn, s.last_name AS seller_ln, s.mobile AS seller_mob
        FROM transactions t
        INNER JOIN listings l ON t.listing_id = l.id
        INNER JOIN users b ON t.buyer_id = b.id
        INNER JOIN users s ON t.seller_id = s.id
        WHERE t.id = ? AND l.is_deleted = 0
        LIMIT 1
    ";

    $stmt = $db->prepare($sqlFetch);
    $stmt->execute([$transactionId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        throw new Exception("Transaction #{$transactionId} not found.");
    }

    // 3. Permission Check
    if ((int)$row['buyer_id'] !== (int)$activeUserId && (int)$row['seller_id'] !== (int)$activeUserId) {
        http_response_code(403);
        throw new Exception("Access denied.");
    }

    $crypto = defined('ENCRYPTION_KEY') ? new EncryptionEngine(ENCRYPTION_KEY) : null;
    $decrypt = fn($val) => ($crypto && !empty($val)) ? ($crypto->decrypt($val) ?? $val) : $val;

    echo json_encode([
        "status" => "success",
        "data" => [
            "publicId" => $row['public_id'],
            "itemTitle" => $row['item_title'],
            "buyer" => [
                "name" => trim($decrypt($row['buyer_fn']) . ' ' . $decrypt($row['buyer_ln'])),
                "phone" => $decrypt($row['buyer_mob'])
            ],
            "seller" => [
                "name" => trim($decrypt($row['seller_fn']) . ' ' . $decrypt($row['seller_ln'])),
                "phone" => $decrypt($row['seller_mob'])
            ]
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
}
