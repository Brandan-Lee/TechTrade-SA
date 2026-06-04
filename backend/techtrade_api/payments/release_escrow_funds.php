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

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Method not allowed.");
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Your session has expired. Please log in again.");
    }

    $staffCheck = $db->prepare("SELECT role_id FROM users WHERE id = ? AND is_deleted = 0 LIMIT 1");
    $staffCheck->execute([$activeUserId]);
    $staffRow = $staffCheck->fetch(PDO::FETCH_ASSOC);

    if (!$staffRow || !in_array((int)$staffRow['role_id'], [3, 4], true)) {
        http_response_code(403);
        throw new Exception("Access Denied. You do not have permission to release funds.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $transactionId = isset($input['transaction_id']) ? intval($input['transaction_id']) : 0;

    if ($transactionId <= 0) {
        throw new Exception("Invalid or missing transaction identifier.");
    }

    $txStmt = $db->prepare("
        SELECT t.*, l.title AS item_title 
        FROM transactions t
        INNER JOIN listings l ON t.listing_id = l.id
        WHERE t.id = ? LIMIT 1
    ");
    $txStmt->execute([$transactionId]);
    $tx = $txStmt->fetch(PDO::FETCH_ASSOC);

    if (!$tx) {
        throw new Exception("The specified order record could not be found.");
    }

    if ((int)$tx['escrow_released'] === 1) {
        throw new Exception("Funds for this order have already been released.");
    }

    if ($tx['status'] !== 'completed') {
        throw new Exception("Funds can only be released for orders that are currently marked as completed.");
    }

    $payoutAmount = number_format(($tx['agreed_price_cents'] / 100), 2, '.', '');
    $itemTitle = $tx['item_title'];
    $orderPublicId = $tx['public_id'];

    $db->beginTransaction();

    $updateTx = $db->prepare("
        UPDATE transactions 
        SET 
            status = 'completed', 
            escrow_step = 5, 
            escrow_released = 1, 
            completed_at = NOW(),
            updated_at = NOW()
        WHERE id = ?
    ");
    $updateTx->execute([$transactionId]);

    $updatePayment = $db->prepare("
        UPDATE payments 
        SET 
            status = 'complete', -- Keeps or forces completion status integrity on payout
            updated_at = NOW()
        WHERE transaction_id = ?
    ");
    $updatePayment->execute([$transactionId]);

    $insertNotification = $db->prepare("
        INSERT INTO notifications (
            user_id, type, title, body, status, transaction_id, listing_id, is_read
        ) VALUES (?, 'system', ?, ?, 'pending', ?, ?, 0)
    ");

    $buyerTitle = "Funds Released for Order {$orderPublicId}";
    $buyerBody = "The escrow payout of R {$payoutAmount} for your purchase of \"{$itemTitle}\" has been finalized and sent to the seller.";
    $insertNotification->execute([
        $tx['buyer_id'],
        $buyerTitle,
        $buyerBody,
        $transactionId,
        $tx['listing_id']
    ]);

    $sellerTitle = "Payout Disbursed for Order {$orderPublicId}";
    $sellerBody = "Great news! Escrow holdings of R {$payoutAmount} for your item \"{$itemTitle}\" have been released and sent to your profile accounting balance.";
    $insertNotification->execute([
        $tx['seller_id'],
        $sellerTitle,
        $sellerBody,
        $transactionId,
        $tx['listing_id']
    ]);

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Payout successful. Funds released to the seller and alerts sent."
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "An internal balance updating error occurred."]);
}
