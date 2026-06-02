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
    $incomingId = isset($inputData['offer_id']) ? intval($inputData['offer_id']) : 0;

    if ($incomingId <= 0) {
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

    $sqlFindMap = "
        SELECT id, offer_id 
        FROM notifications 
        WHERE (id = ? OR offer_id = ?) 
          AND user_id = ? 
          AND type = 'counter' 
          AND is_deleted = 0
        LIMIT 1
    ";
    $stmtMap = $db->prepare($sqlFindMap);
    $stmtMap->execute([$incomingId, $incomingId, $userIdValue]);
    $resolvedNotification = $stmtMap->fetch(PDO::FETCH_ASSOC);

    if (!$resolvedNotification || intval($resolvedNotification['offer_id']) <= 0) {
        http_response_code(404);
        throw new Exception("Could not find an active counter-offer notification.");
    }

    $notificationIdToClear = intval($resolvedNotification['id']);
    $offerId = intval($resolvedNotification['offer_id']);

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
        throw new Exception("The requested counter-offer could not be found.");
    }

    if (intval($currentOffer['buyer_id']) !== $userIdValue) {
        http_response_code(403);
        throw new Exception("Access Denied. You do not have permission to decline this offer.");
    }

    if ($currentOffer['status'] !== 'countered') {
        http_response_code(400);
        throw new Exception("This offer has already been processed.");
    }

    $listingId = intval($currentOffer['listing_id']);
    $sellerId = intval($currentOffer['seller_id']);
    $listingTitle = $currentOffer['listing_title'];

    $db->beginTransaction();

    $sqlMarkRead = "UPDATE notifications SET is_read = 1, status = 'declined', read_at = NOW() WHERE id = ?";
    $db->prepare($sqlMarkRead)->execute([$notificationIdToClear]);

    $sqlUpdateTargetOffer = "UPDATE offers SET status = 'declined', responded_at = NOW() WHERE id = ?";
    $db->prepare($sqlUpdateTargetOffer)->execute([$offerId]);

    $sqlUpdateTx = "UPDATE transactions SET status = 'declined' WHERE offer_id = ? AND status = 'pending'";
    $db->prepare($sqlUpdateTx)->execute([$offerId]);

    $sqlCheckOffers = "SELECT COUNT(*) FROM offers WHERE listing_id = ? AND status = 'pending'";
    $stmtCheck = $db->prepare($sqlCheckOffers);
    $stmtCheck->execute([$listingId]);
    $remainingOffersCount = intval($stmtCheck->fetchColumn());

    if ($remainingOffersCount === 0) {
        $sqlUpdateListing = "UPDATE listings SET status = 'AVAILABLE' WHERE id = ?";
        $db->prepare($sqlUpdateListing)->execute([$listingId]);
    }

    $sqlNotifySeller = "
        INSERT INTO notifications (user_id, type, title, body, status, offer_id, listing_id)
        VALUES (?, 'counter', 'Counter Offer Declined', ?, 'declined', ?, ?)
    ";
    $bodySeller = "The buyer has declined your counter offer for [{$listingTitle}].";
    $db->prepare($sqlNotifySeller)->execute([$sellerId, $bodySeller, $offerId, $listingId]);

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Counter offer declined successfully.",
        "listing_restored" => ($remainingOffersCount === 0)
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
        "error" => "An unexpected error occurred while processing your request.",
        "debug" => $t->getMessage()
    ]);
}
