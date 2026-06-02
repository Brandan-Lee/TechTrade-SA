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
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);
    $reviewerId = SessionManager::getActiveUserId();

    if (!$reviewerId) {
        http_response_code(412);
        throw new Exception("Your session has expired. Please log in again to leave a review.");
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("We couldn't read your request. Please check your submission and try again.");
    }

    $revieweeId = isset($data['reviewed_user_id']) ? intval($data['reviewed_user_id']) : 0;
    $rating = isset($data['rating']) ? intval($data['rating']) : 0;
    $comment = isset($data['text']) ? trim($data['text']) : '';
    $transactionId = isset($data['transaction_id']) ? intval($data['transaction_id']) : 0;

    if ($revieweeId <= 0) {
        throw new Exception("Please specify a valid user to review.");
    }
    if ($rating < 1 || $rating > 5) {
        throw new Exception("Rating must be between 1 and 5 stars.");
    }
    if (empty($comment)) {
        throw new Exception("Please share a comment about your experience.");
    }

    if ($revieweeId === intval($reviewerId)) {
        http_response_code(422);
        throw new Exception("Access Denied. You cannot review your own account.");
    }

    if ($transactionId <= 0) {
        $sqlFindTx = "SELECT id FROM transactions 
                      WHERE ((buyer_id = ? AND seller_id = ?) OR (buyer_id = ? AND seller_id = ?))
                      ORDER BY id DESC LIMIT 1";
        $stmtFindTx = $db->prepare($sqlFindTx);
        $stmtFindTx->execute([$reviewerId, $revieweeId, $revieweeId, $reviewerId]);
        $txRow = $stmtFindTx->fetch();

        if (!$txRow) {
            http_response_code(403);
            throw new Exception("You can only review someone you have completed a transaction with.");
        }
        $transactionId = intval($txRow['id']);
    }

    $scoreBonus = $rating * 0.10;

    $db->beginTransaction();

    $sqlDupCheck = "SELECT id FROM reviews WHERE transaction_id = ? AND reviewer_id = ? LIMIT 1";
    $stmtDup = $db->prepare($sqlDupCheck);
    $stmtDup->execute([$transactionId, $reviewerId]);

    if ($stmtDup->fetch()) {
        $db->rollBack();
        http_response_code(409);
        throw new Exception("You have already submitted a review for this transaction.");
    }

    $sqlUserLock = "SELECT trust_score, is_deleted FROM users WHERE id = ? FOR UPDATE";
    $stmtUserLock = $db->prepare($sqlUserLock);
    $stmtUserLock->execute([$revieweeId]);
    $userRow = $stmtUserLock->fetch();

    if (!$userRow || intval($userRow['is_deleted']) === 1) {
        $db->rollBack();
        http_response_code(404);
        throw new Exception("The user you are trying to review could not be found.");
    }

    $currentTrustScore = floatval($userRow['trust_score']);

    $sqlInsertReview = "INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, comment, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
    $stmtInsertReview = $db->prepare($sqlInsertReview);
    $stmtInsertReview->execute([
        $transactionId,
        $reviewerId,
        $revieweeId,
        $rating,
        htmlspecialchars($comment, ENT_QUOTES, 'UTF-8')
    ]);

    if ($currentTrustScore >= 5.00) {
        $newTrustScore = 5.00;
        $sqlUpdateUser = "UPDATE users SET trade_count = trade_count + 1 WHERE id = ?";
        $stmtUpdateUser = $db->prepare($sqlUpdateUser);
        $stmtUpdateUser->execute([$revieweeId]);
    } else {
        $newTrustScore = $currentTrustScore + $scoreBonus;
        if ($newTrustScore > 5.00) {
            $newTrustScore = 5.00;
        }

        $sqlUpdateUser = "UPDATE users SET trust_score = ?, trade_count = trade_count + 1 WHERE id = ?";
        $stmtUpdateUser = $db->prepare($sqlUpdateUser);
        $stmtUpdateUser->execute([$newTrustScore, $revieweeId]);
    }

    $notificationTitle = "New Account Review Received";
    $notificationBody = "A user has submitted a " . $rating . "-star review for your recent transaction. Your trust score is now " . number_format($newTrustScore, 2) . ".";

    $sqlNotify = "INSERT INTO notifications (user_id, type, title, body, transaction_id, is_read, created_at) 
                  VALUES (?, 'system', ?, ?, ?, 0, NOW())";
    $stmtNotify = $db->prepare($sqlNotify);
    $stmtNotify->execute([
        $revieweeId,
        $notificationTitle,
        $notificationBody,
        $transactionId
    ]);

    $db->commit();

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Your review has been successfully posted."
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
        "error" => "An unexpected error occurred while processing your request.",
        "debug" => $t->getMessage()
    ]);
}
