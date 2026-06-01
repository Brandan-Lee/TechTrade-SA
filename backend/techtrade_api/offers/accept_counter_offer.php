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
    $incomingId = isset($inputData['offer_id']) ? intval($inputData['offer_id']) : 0;

    if ($incomingId <= 0) {
        http_response_code(400);
        throw new Exception("Invalid or missing entity identification reference.");
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
        throw new Exception("Could not resolve an active counter offer notification for this user.");
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
        throw new Exception("The underlying counter offer context record was not found.");
    }

    if (intval($currentOffer['buyer_id']) !== $userIdValue) {
        http_response_code(403);
        throw new Exception("Access Denied. Identity validation mismatch.");
    }

    if ($currentOffer['status'] !== 'countered') {
        http_response_code(400);
        throw new Exception("This offer is already processed. Current status: " . $currentOffer['status']);
    }

    $listingId = intval($currentOffer['listing_id']);
    $sellerId = intval($currentOffer['seller_id']);
    $agreedPriceCents = intval($currentOffer['amount_cents']);
    $listingTitle = $currentOffer['listing_title'];

    $db->beginTransaction();

    $sqlMarkRead = "UPDATE notifications SET is_read = 1, status = 'accepted', read_at = NOW() WHERE id = ?";
    $db->prepare($sqlMarkRead)->execute([$notificationIdToClear]);

    $sqlUpdateTargetOffer = "UPDATE offers SET status = 'accepted', responded_at = NOW() WHERE id = ?";
    $db->prepare($sqlUpdateTargetOffer)->execute([$offerId]);

    $sqlUpdateOtherOffers = "
        UPDATE offers 
        SET status = 'declined', responded_at = NOW() 
        WHERE listing_id = ? AND id != ? AND status = 'pending'
    ";
    $db->prepare($sqlUpdateOtherOffers)->execute([$listingId, $offerId]);

    $sqlUpdateListing = "UPDATE listings SET status = 'COMMITED' WHERE id = ?";
    $db->prepare($sqlUpdateListing)->execute([$listingId]);

    $publicTxId = "TX-" . strval(rand(1000000, 9999999));

    $sqlCreateTx = "
        INSERT INTO transactions (
            public_id, listing_id, offer_id, buyer_id, seller_id, agreed_price_cents, status, escrow_step
        ) VALUES (?, ?, ?, ?, ?, ?, 'committed', 3)
    ";
    $db->prepare($sqlCreateTx)->execute([$publicTxId, $listingId, $offerId, $userIdValue, $sellerId, $agreedPriceCents]);
    $newTransactionId = $db->lastInsertId();

    $sqlNotifySeller = "
        INSERT INTO notifications (user_id, type, title, body, status, offer_id, transaction_id, listing_id)
        VALUES (?, 'counter', 'Counter Offer Accepted!', ?, 'accepted', ?, ?, ?)
    ";
    $bodySeller = "Great news! The buyer accepted your counter offer for [{$listingTitle}].";
    $db->prepare($sqlNotifySeller)->execute([$sellerId, $bodySeller, $offerId, $newTransactionId, $listingId]);

    $sqlFindDeclinedBuyers = "
        SELECT id, buyer_id FROM offers WHERE listing_id = ? AND id != ? AND status = 'declined' AND responded_at >= NOW() - INTERVAL 2 SECOND
    ";
    $stmtFind = $db->prepare($sqlFindDeclinedBuyers);
    $stmtFind->execute([$listingId, $offerId]);
    $declinedOffers = $stmtFind->fetchAll(PDO::FETCH_ASSOC);

    if (count($declinedOffers) > 0) {
        $sqlNotifyLosers = "
            INSERT INTO notifications (user_id, type, title, body, status, offer_id, listing_id)
            VALUES (?, 'offer', 'Offer Update: Declined', ?, 'declined', ?, ?)
        ";
        $stmtNotifyLosers = $db->prepare($sqlNotifyLosers);
        foreach ($declinedOffers as $declinedRow) {
            $bodyLoser = "The listing for [{$listingTitle}] has been committed to another user. Your offer has been declined.";
            $stmtNotifyLosers->execute([intval($declinedRow['buyer_id']), $bodyLoser, intval($declinedRow['id']), $listingId]);
        }
    }

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Counter offer accepted successfully, processing state matching updated.",
        "transaction_id" => $newTransactionId
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
    echo json_encode(["status" => "error", "error" => "Runtime database engine transaction error.", "debug" => $t->getMessage()]);
}
