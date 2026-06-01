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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception("Method Not Allowed: This endpoint requires a POST request.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("Invalid data submission payload.");
    }

    $incomingOfferId = isset($data['offer_id']) ? intval($data['offer_id']) : 0;
    $counterAmount = isset($data['amount']) ? floatval($data['amount']) : 0.0;

    if ($incomingOfferId <= 0 || $counterAmount <= 0) {
        http_response_code(400);
        throw new Exception("Invalid offer data or price amount provided.");
    }

    $counterAmountCents = intval($counterAmount * 100);

    $sqlFetch = "
        SELECT o.buyer_id, o.listing_id, l.title AS item_title, l.seller_id AS listing_seller_id
        FROM offers o
        JOIN listings l ON o.listing_id = l.id
        WHERE o.id = ? AND o.status = 'pending'
        LIMIT 1
    ";
    $stmtFetch = $db->prepare($sqlFetch);
    $stmtFetch->execute([$incomingOfferId]);
    $originalOffer = $stmtFetch->fetch(PDO::FETCH_ASSOC);

    if (!$originalOffer) {
        http_response_code(422);
        throw new Exception("This offer is no longer open or could not be found.");
    }

    $buyerId = $originalOffer['buyer_id'];
    $listingId = $originalOffer['listing_id'];
    $itemTitle = $originalOffer['item_title'];
    $sellerId = $originalOffer['listing_seller_id'];

    $db->beginTransaction();

    $sqlUpdate = "UPDATE offers SET status = 'countered', responded_at = NOW() WHERE id = ?";
    $stmtUpdate = $db->prepare($sqlUpdate);
    $stmtUpdate->execute([$incomingOfferId]);

    $sqlInsertOffer = "
        INSERT INTO offers (listing_id, buyer_id, amount_cents, status, parent_offer_id, expires_at, created_at, updated_at)
        VALUES (?, ?, ?, 'countered', ?, DATE_ADD(NOW(), INTERVAL 3 DAY), NOW(), NOW())
    ";
    $stmtInsertOffer = $db->prepare($sqlInsertOffer);
    $stmtInsertOffer->execute([
        $listingId,
        $buyerId,
        $counterAmountCents,
        $incomingOfferId
    ]);

    $newOfferId = $db->lastInsertId();

    $sqlFindTx = "
        SELECT id FROM transactions 
        WHERE listing_id = ? AND buyer_id = ? AND seller_id = ? AND status = 'pending'
        LIMIT 1
    ";
    $stmtFindTx = $db->prepare($sqlFindTx);
    $stmtFindTx->execute([$listingId, $buyerId, $sellerId]);
    $existingTx = $stmtFindTx->fetch(PDO::FETCH_ASSOC);

    if ($existingTx) {
        $sqlUpdateTx = "
            UPDATE transactions 
            SET offer_id = ?, agreed_price_cents = ?, updated_at = NOW()
            WHERE id = ?
        ";

        $stmtUpdateTx = $db->prepare($sqlUpdateTx);
        $stmtUpdateTx->execute([$newOfferId, $counterAmountCents, $existingTx['id']]);
        $transactionId = $existingTx['id'];
    } else {
        $publicTxId = 'TX-' . str_pad((string)random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT);
        $sqlInsertTx = "
            INSERT INTO transactions (public_id, listing_id, offer_id, buyer_id, seller_id, agreed_price_cents, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
        ";
        $stmtInsertTx = $db->prepare($sqlInsertTx);
        $stmtInsertTx->execute([
            $publicTxId,
            $listingId,
            $newOfferId,
            $buyerId,
            $sellerId,
            $counterAmountCents
        ]);
        $transactionId = $db->lastInsertId();
    }

    $notificationTitle = "New Counter Offer Received";
    $notificationBody = "The seller responded with a counter offer of R" . number_format($counterAmount, 2) . " for " . $itemTitle . ".";

    $sqlNotify = "
        INSERT INTO notifications (user_id, type, title, body, status, offer_id, transaction_id, listing_id, is_read, created_at)
        VALUES (?, 'counter', ?, ?, 'pending', ?, ?, ?, 0, NOW())
    ";
    $stmtNotify = $db->prepare($sqlNotify);
    $stmtNotify->execute([
        $buyerId,
        $notificationTitle,
        $notificationBody,
        $newOfferId,
        $transactionId,
        $listingId
    ]);

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Counter offer sent and notification delivered successfully."
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "error" => "An internal system fault occurred while trying to process your counter offer.",
        "debug" => $t->getMessage()
    ]);
}
