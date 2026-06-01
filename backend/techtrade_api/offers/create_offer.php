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

function generatePublicTxId(): string {
    return 'TX-' . str_pad((string)random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception("Method Not Allowed: This endpoint exclusively processes POST requests.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database connection channel could not be established.");
    }

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    SessionManager::init($db);
    $buyerId = SessionManager::getActiveUserId();

    if (!$buyerId) {
        http_response_code(412);
        throw new Exception("Authentication Required: You must be logged in to create a marketplace offer.");
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("Malformed Payload: Unable to parse incoming marketplace offer data.");
    }

    $listingId = isset($data['listing_id']) ? intval($data['listing_id']) : 0;
    $offerAmountFloat = isset($data['amount']) ? floatval($data['amount']) : 0.0;
    $messageText = isset($data['message']) ? trim($data['message']) : '';

    if ($listingId <= 0) {
        throw new Exception("Validation Error: Missing or invalid target listing reference.");
    }
    if ($offerAmountFloat <= 0) {
        throw new Exception("Validation Error: Proposed trade bid must be greater than R0.00.");
    }

    $priceCents = (int) round($offerAmountFloat * 100);

    $db->beginTransaction();

    $sqlCheck = "SELECT seller_id, title, status, is_deleted FROM listings WHERE id = ? FOR UPDATE";
    $stmtCheck = $db->prepare($sqlCheck);
    $stmtCheck->execute([$listingId]);
    $listing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if (!$listing || (int) $listing['is_deleted'] === 1) {
        http_response_code(404);
        throw new Exception("Marketplace Error: Target hardware listing is missing or offline.");
    }

    $sellerId = isset($listing['seller_id']) ? intval($listing['seller_id']) : 0;

    if ($sellerId === 0) {
        throw new Exception("Marketplace Error: Unable to determine valid listing owner properties.");
    }

    if ($sellerId === (int) $buyerId) {
        throw new Exception("Forbidden Action: You cannot make an offer on your own hardware listing.");
    }

    if ($listing['status'] !== 'AVAILABLE' && $listing['status'] !== 'OFFERED') {
        throw new Exception("Marketplace Error: This asset is currently locked inside a completed or pending transaction.");
    }

    $sqlDuplicateCheck = "SELECT id FROM offers WHERE listing_id = ? AND buyer_id = ? AND status = 'pending' LIMIT 1";
    $stmtDup = $db->prepare($sqlDuplicateCheck);
    $stmtDup->execute([$listingId, $buyerId]);
    
    if ($stmtDup->fetch()) {
        http_response_code(409);
        throw new Exception("Action Blocked: You already have an active pending offer submitted for this hardware item.");
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
        "message" => "Your trade offer has been successfully processed, a pending transaction initialized, and the seller notified."
    ]);

} catch (PDOException $pdoEx) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "error" => "Database level syntax or integrity constraint failure occurred.",
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
        "error" => "A critical internal runtime engine error occurred.",
        "debug" => $t->getMessage()
    ]);
}