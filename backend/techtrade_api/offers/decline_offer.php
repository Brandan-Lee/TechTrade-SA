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
        throw new Exception("Method Not Allowed.");
    }

    $inputData = json_decode(file_get_contents("php://input"), true);
    $offerId = isset($inputData['offer_id']) ? intval($inputData['offer_id']) : 0;

    if ($offerId <= 0) {
        http_response_code(400);
        throw new Exception("Invalid or missing offer ID reference.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database engine.");
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Unauthorized Access. Please sign in.");
    }
    $userIdValue = intval($activeUserId);

    // 1. Fetch offer details and listing status parameters using your structural columns
    $sqlVerify = "
        SELECT o.id, o.listing_id, o.buyer_id, o.status, l.seller_id, l.title AS listing_title
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
        throw new Exception("The requested offer or active parent listing could not be found.");
    }

    // Safety check: Make sure the person declining is the actual seller
    if (intval($currentOffer['seller_id']) !== $userIdValue) {
        http_response_code(403);
        throw new Exception("Access Denied. Only the listing owner can decline this offer.");
    }

    if ($currentOffer['status'] !== 'pending') {
        http_response_code(400);
        throw new Exception("This offer cannot be declined because its status is: " . $currentOffer['status']);
    }

    $listingId = intval($currentOffer['listing_id']);
    $buyerId = intval($currentOffer['buyer_id']);
    $listingTitle = $currentOffer['listing_title'];

    $db->beginTransaction();

    $sqlUpdateTargetOffer = "UPDATE offers SET status = 'declined', responded_at = NOW() WHERE id = ?";
    $db->prepare($sqlUpdateTargetOffer)->execute([$offerId]);

    $sqlCheckTx = "SELECT id FROM transactions WHERE offer_id = ? LIMIT 1";
    $stmtTx = $db->prepare($sqlCheckTx);
    $stmtTx->execute([$offerId]);
    $transactionRecord = $stmtTx->fetch(PDO::FETCH_ASSOC);

    if ($transactionRecord) {
        $sqlCancelTx = "
            UPDATE transactions 
            SET status = 'cancelled', 
                cancelled_at = NOW(), 
                cancel_reason = 'Offer declined by seller.' 
            WHERE id = ?
        ";
        $db->prepare($sqlCancelTx)->execute([intval($transactionRecord['id'])]);
    }

    $sqlCountPending = "SELECT COUNT(*) FROM offers WHERE listing_id = ? AND status = 'pending'";
    $stmtCount = $db->prepare($sqlCountPending);
    $stmtCount->execute([$listingId]);
    $pendingOffersCount = intval($stmtCount->fetchColumn());

    if ($pendingOffersCount === 0) {
        $sqlUpdateListing = "UPDATE listings SET status = 'AVAILABLE' WHERE id = ?";
        $db->prepare($sqlUpdateListing)->execute([$listingId]);
    }

    $sqlNotifyBuyer = "
        INSERT INTO notifications (user_id, type, title, body, status, offer_id, listing_id)
        VALUES (?, 'offer', 'Offer Update: Declined', ?, 'declined', ?, ?)
    ";
    $bodyMessage = "Your offer for item [{$listingTitle}] has been declined by the seller.";
    $db->prepare($sqlNotifyBuyer)->execute([$buyerId, $bodyMessage, $offerId, $listingId]);

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Offer declined successfully. Notification sent and listing verified.",
        "remaining_pending_offers" => $pendingOffersCount
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error" => "Critical system runtime database exception caught on decline step processing.",
        "debug" => $t->getMessage()
    ]);
}
