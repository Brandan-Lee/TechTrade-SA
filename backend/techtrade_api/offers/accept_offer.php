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
        throw new Exception("This action is not supported.");
    }

    $inputData = json_decode(file_get_contents("php://input"), true);
    $offerId = isset($inputData['offer_id']) ? intval($inputData['offer_id']) : 0;

    if ($offerId <= 0) {
        http_response_code(400);
        throw new Exception("Please specify a valid offer.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Your session has expired. Please log in again.");
    }
    $userIdValue = intval($activeUserId);

    $sqlVerify = "
        SELECT o.id, o.listing_id, o.buyer_id, o.amount_cents, o.status, l.seller_id, l.title AS listing_title
        FROM offers o
        INNER JOIN listings l ON o.listing_id = l.id
        WHERE o.id = ? AND l.is_deleted = 0
        LIMIT 1
    ";
    $stmt = $db->prepare($sqlVerify);
    $stmt->execute([$offerId]);
    $currentOffer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$currentOffer) {
        http_response_code(404);
        throw new Exception("The requested offer or item listing could not be found.");
    }

    if (intval($currentOffer['seller_id']) !== $userIdValue) {
        http_response_code(403);
        throw new Exception("Access Denied. Only the seller can accept this offer.");
    }

    if ($currentOffer['status'] !== 'pending') {
        http_response_code(400);
        throw new Exception("This offer has already been processed.");
    }

    $listingId = intval($currentOffer['listing_id']);
    $buyerId = intval($currentOffer['buyer_id']);
    $listingTitle = $currentOffer['listing_title'];

    $db->beginTransaction();

    $sqlUpdateTargetOffer = "UPDATE offers SET status = 'accepted', responded_at = NOW() WHERE id = ?";
    $db->prepare($sqlUpdateTargetOffer)->execute([$offerId]);

    $sqlUpdateOtherOffers = "
        UPDATE offers 
        SET status = 'declined', responded_at = NOW() 
        WHERE listing_id = ? AND id != ? AND status = 'pending'
    ";
    $stmtOtherOffers = $db->prepare($sqlUpdateOtherOffers);
    $stmtOtherOffers->execute([$listingId, $offerId]);

    $sqlUpdateListing = "UPDATE listings SET status = 'COMMITED' WHERE id = ?";
    $db->prepare($sqlUpdateListing)->execute([$listingId]);

    $sqlFetchTx = "SELECT id FROM transactions WHERE offer_id = ? AND status = 'pending' LIMIT 1";
    $stmtFetchTx = $db->prepare($sqlFetchTx);
    $stmtFetchTx->execute([$offerId]);
    $existingTx = $stmtFetchTx->fetch(PDO::FETCH_ASSOC);

    if (!$existingTx) {
        throw new Exception("No pending order was found for this offer.");
    }

    $transactionId = intval($existingTx['id']);

    $sqlUpdateTx = "
        UPDATE transactions 
        SET status = 'committed', 
            updated_at = NOW() 
        WHERE id = ?
    ";
    $db->prepare($sqlUpdateTx)->execute([$transactionId]);

    $sqlNotifyWinner = "
        INSERT INTO notifications (user_id, type, title, body, status, offer_id, transaction_id, listing_id)
        VALUES (?, 'offer', 'Offer Accepted!', ?, 'accepted', ?, ?, ?)
    ";
    $bodyWinner = "Great news! Your offer for [{$listingTitle}] was accepted.";
    $db->prepare($sqlNotifyWinner)->execute([$buyerId, $bodyWinner, $offerId, $transactionId, $listingId]);

    $sqlFindDeclinedBuyers = "
        SELECT id, buyer_id FROM offers WHERE listing_id = ? AND id != ? AND status = 'declined' AND responded_at >= NOW() - INTERVAL 2 SECOND
    ";
    $stmtFind = $db->prepare($sqlFindDeclinedBuyers);
    $stmtFind->execute([$listingId, $offerId]);
    $declinedOffers = $stmtFind->fetchAll(PDO::FETCH_ASSOC);

    $sqlNotifyLosers = "
        INSERT INTO notifications (user_id, type, title, body, status, offer_id, listing_id)
        VALUES (?, 'offer', 'Offer Update: Declined', ?, 'declined', ?, ?)
    ";
    $stmtNotifyLosers = $db->prepare($sqlNotifyLosers);

    foreach ($declinedOffers as $declinedRow) {
        $bodyLoser = "The listing for [{$listingTitle}] has been sold to another user. Your offer has been declined.";
        $stmtNotifyLosers->execute([
            intval($declinedRow['buyer_id']),
            $bodyLoser,
            intval($declinedRow['id']),
            $listingId
        ]);
    }

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Offer accepted successfully.",
        "transaction_id" => $transactionId
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(http_response_code() === 200 ? 400 : http_response_code());
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error" => "An unexpected error occurred while processing your transaction.",
        "debug" => $t->getMessage()
    ]);
}
