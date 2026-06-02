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

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) throw new Exception("We are having trouble connecting. Please try again.");

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();
    if (!$activeUserId) throw new Exception("Please log in to continue.");

    $userIdValue = intval($activeUserId);
    $input = json_decode(file_get_contents('php://input'), true);
    $transactionId = isset($input['transaction_id']) ? intval($input['transaction_id']) : null;
    $action = $input['action'] ?? null;

    if (!$transactionId || !$action) throw new Exception("Invalid request details.");

    $db->beginTransaction();

    // Securely lock the order to prevent conflicts
    $stmtLock = $db->prepare("SELECT t.*, l.title FROM transactions t INNER JOIN listings l ON t.listing_id = l.id WHERE t.id = ? FOR UPDATE");
    $stmtLock->execute([$transactionId]);
    $tx = $stmtLock->fetch(PDO::FETCH_ASSOC);
    if (!$tx) throw new Exception("Order not found.");

    $fromStep = intval($tx['escrow_step']);
    $metadata = [];
    $isBuyer = (intval($tx['buyer_id']) === $userIdValue);
    $isSeller = (intval($tx['seller_id']) === $userIdValue);
    $targetUserId = $isBuyer ? $tx['seller_id'] : $tx['buyer_id'];

    $stmtCheck = $db->prepare("SELECT COUNT(*) FROM transaction_events WHERE transaction_id = ? AND event_type = 'choose_handover'");
    $stmtCheck->execute([$transactionId]);
    $isHandover = $stmtCheck->fetchColumn() > 0;

    switch ($action) {
        case 'cancel':
            if ($tx['status'] === 'completed') throw new Exception("Cannot cancel a completed order.");
            $reason = $input['reason'] ?? 'No reason provided.';

            $db->prepare("UPDATE transactions SET status = 'cancelled', cancel_reason = ?, cancelled_at = NOW(), updated_at = NOW() WHERE id = ?")
                ->execute([$reason, $transactionId]);

            $db->prepare("UPDATE listings SET status = 'AVAILABLE', updated_at = NOW() WHERE id = ?")
                ->execute([$tx['listing_id']]);

            $metadata = ['reason' => $reason, 'cancelled_by' => ($isBuyer ? 'buyer' : 'seller')];
            $notifyTitle = "Order Cancelled";
            $notifyBody = "The order for '{$tx['title']}' was cancelled: {$reason}";
            $toStep = 0;
            break;

        case 'choose_handover':
            if (!$isBuyer) throw new Exception("Only the buyer can select this.");
            $toStep = 3;
            $metadata = ['route_type' => 'in_person_handover', 'notes' => 'Handover selected.'];
            $notifyTitle = "Handover Selected";
            $notifyBody = "The buyer chose in-person handover for '{$tx['title']}'.";
            break;

        case 'payment_escrow':
            if (!$isBuyer) throw new Exception("Only the buyer can select this.");
            $toStep = 2;
            $metadata = ['route_type' => 'secure_payment'];
            $notifyTitle = "Payment Secured";
            $notifyBody = "Funds have been deposited for '{$tx['title']}'.";
            break;

        case 'mark_shipped':
            if (!$isSeller) throw new Exception("Only the seller can select this.");
            $toStep = 3;
            $metadata = ['notes' => 'Item dispatched.'];
            $notifyTitle = "Item Dispatched";
            $notifyBody = "The seller has shipped '{$tx['title']}'.";
            break;

        case 'confirm_delivery':
            if (!$isBuyer) throw new Exception("Only the buyer can select this.");
            $toStep = 4;
            $metadata = ['notes' => 'Arrival confirmed.'];
            $notifyTitle = "Delivery Confirmed";
            $notifyBody = "The buyer confirmed delivery for '{$tx['title']}'.";
            break;

        case 'release_funds':
            if (!$isBuyer) throw new Exception("Only the buyer can select this.");
            $toStep = 5;
            $metadata = ['notes' => 'Funds release triggered.'];
            if ($isHandover) {
                $db->prepare("UPDATE listings SET status = 'SOLD', updated_at = NOW() WHERE id = ?")->execute([$tx['listing_id']]);
                $db->prepare("UPDATE users SET trade_count = trade_count + 1 WHERE id = ?")->execute([$tx['seller_id']]);
                $notifyTitle = "Handover Finalized";
                $notifyBody = "Handover confirmed. Order completed.";
            } else {
                $notifyTitle = "Payout Pending";
                $notifyBody = "Funds released. Our team will review the payout shortly.";
            }
            break;

        default:
            throw new Exception("Unknown action.");
    }

    $statusUpdate = ($toStep >= 5) ? 'completed' : (($toStep === 0) ? 'cancelled' : 'committed');
    $params = [$toStep, $statusUpdate];
    $additionalFields = ($toStep === 5) ? ", completed_at = NOW()" : "";

    if ($toStep > 0 && $toStep < 5) {
        $additionalFields .= ", step_expires_at = DATE_ADD(NOW(), INTERVAL ? DAY)";
        $params[] = ($toStep === 3) ? 7 : 2;
    }
    $params[] = $transactionId;

    $updateSql = "UPDATE transactions SET escrow_step = ?, status = ?, updated_at = NOW() {$additionalFields} WHERE id = ?";
    $db->prepare($updateSql)->execute($params);

    $db->prepare("INSERT INTO transaction_events (transaction_id, actor_id, event_type, from_step, to_step, metadata_json) VALUES (?, ?, ?, ?, ?, ?)")
        ->execute([$transactionId, $userIdValue, $action, $fromStep, $toStep, json_encode($metadata)]);

    $db->prepare("
        INSERT INTO notifications (user_id, type, title, body, transaction_id, status, offer_id, listing_id, created_at) 
        VALUES (?, 'system', ?, ?, ?, ?, ?, ?, NOW())
    ")->execute([$targetUserId, $notifyTitle, $notifyBody, $transactionId, $statusUpdate, $tx['offer_id'], $tx['listing_id']]);

    $db->commit();
    echo json_encode(["status" => "success", "message" => "Updated successfully."]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
