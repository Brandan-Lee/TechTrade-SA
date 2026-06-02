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

function generatePublicTxId(): string
{
    return 'TX-' . str_pad((string)random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT);
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
    $buyerId = SessionManager::getActiveUserId();

    if (!$buyerId) {
        http_response_code(412);
        throw new Exception("Your session has expired. Please log in again to send an offer.");
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("We couldn't read your request. Please check your submission and try again.");
    }

    $listingId = isset($data['listing_id']) ? intval($data['listing_id']) : 0;
    $offerAmountFloat = isset($data['amount']) ? floatval($data['amount']) : 0.0;
    $messageText = isset($data['message']) ? trim($data['message']) : '';

    if ($listingId <= 0) {
        throw new Exception("Please specify a valid item to make an offer on.");
    }
    if ($offerAmountFloat <= 0) {
        throw new Exception("Your offer amount must be greater than R0.00.");
    }

    $priceCents = (int) round($offerAmountFloat * 100);

    $db->beginTransaction();

    $sqlCheck = "SELECT seller_id, title, status, is_deleted FROM listings WHERE id = ? FOR UPDATE";
    $stmtCheck = $db->prepare($sqlCheck);
    $stmtCheck->execute([$listingId]);
    $listing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if (!$listing || (int) $listing['is_deleted'] === 1) {
        http_response_code(404);
        throw new Exception("This item listing is no longer available.");
    }

    $sellerId = isset($listing['seller_id']) ? intval($listing['seller_id']) : 0;

    if ($sellerId === 0) {
        throw new Exception("We couldn't find the seller for this item.");
    }

    if ($sellerId === (int) $buyerId) {
        throw new Exception("You cannot make an offer on your own item listing.");
    }

    if ($listing['status'] !== 'AVAILABLE' && $listing['status'] !== 'OFFERED') {
        throw new Exception("This item is currently locked in a pending or completed deal.");
    }

    $sqlDuplicateCheck = "SELECT id FROM offers WHERE listing_id = ? AND buyer_id = ? AND status = 'pending' LIMIT 1";
    $stmtDup = $db->prepare($sqlDuplicateCheck);
    $stmtDup->execute([$listingId, $buyerId]);

    if ($stmtDup->fetch()) {
        http_response_code(409);
        throw new Exception("You already have a pending offer out on this item.");
    }

    $expirationDuration = defined('OFFER_LIFETIME_SECONDS') ? OFFER_LIFETIME_SECONDS : 172800;
    $expiresAt = date('Y-m-d H:i:s', time() + $expirationDuration);

    $sqlInsertOffer = "
        INSERT INTO offers (listing_id, buyer_id, amount_cents, message, status, parent_offer_id, expires_at, created_at)
        VALUES (?, ?, ?, ?, 'pending', NULL, ?, NOW())
    ";
    $stmtInsertOffer = $db->prepare($sqlInsertOffer);
    $stmtInsertOffer->execute([
        $listingId,
        $buyerId,
        $priceCents,
        !empty($messageText) ? $messageText : null,
        $expiresAt
    ]);
    $offerId = $db->lastInsertId();

    $publicTxId = generatePublicTxId();
    $sqlInsertTx = "
        INSERT INTO transactions (
            public_id, listing_id, offer_id, buyer_id, seller_id, agreed_price_cents, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
    ";
    $stmtInsertTx = $db->prepare($sqlInsertTx);
    $stmtInsertTx->execute([
        $publicTxId,
        $listingId,
        $offerId,
        $buyerId,
        $sellerId,
        $priceCents
    ]);
    $transactionId = $db->lastInsertId();

    $notifTitle = "New Trade Offer Received";
    $notifBody = "A buyer has submitted a trade bid of R" . number_format($offerAmountFloat, 2) . " for your listing: '" . $listing['title'] . "'.";

    $sqlNotif = "
        INSERT INTO notifications (user_id, type, title, body, status, offer_id, transaction_id, listing_id, is_read, created_at)
        VALUES (?, 'offer', ?, ?, 'pending', ?, ?, ?, 0, NOW())
    ";
    $stmtNotif = $db->prepare($sqlNotif);
    $stmtNotif->execute([
        $sellerId,
        $notifTitle,
        $notifBody,
        $offerId,
        $transactionId,
        $listingId
    ]);

    $sqlUpdateListing = "UPDATE listings SET status = 'OFFERED', updated_at = NOW() WHERE id = ? AND status IN ('AVAILABLE', 'OFFERED')";
    $stmtUpdateListing = $db->prepare($sqlUpdateListing);
    $stmtUpdateListing->execute([$listingId]);

    $db->commit();

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Your trade offer has been sent successfully and the seller has been notified."
    ]);
} catch (PDOException $pdoEx) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "error" => "An unexpected error occurred while saving your offer to the database.",
        "debug" => $pdoEx->getMessage()
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
        "error" => "An unexpected error occurred on the server.",
        "debug" => $t->getMessage()
    ]);
}
