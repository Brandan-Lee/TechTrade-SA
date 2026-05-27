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
    require_once __DIR__ . '/../helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);
    $reporterId = SessionManager::getActiveUserId();

    if (!$reporterId) {
        http_response_code(412);
        throw new Exception("You must be logged in to file an incident report.");
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("Invalid data payload submission.");
    }

    $reviewId = isset($data['review_id']) ? intval($data['review_id']) : 0;
    $reason = isset($data['reason']) ? trim($data['reason']) : '';

    if ($reviewId <= 0) {
        throw new Exception("The targeted review record link parameter is missing or invalid.");
    }
    if (empty($reason)) {
        throw new Exception("Please provide an incident reason description for moderation tracking.");
    }

    $db->beginTransaction();

    $sqlReviewCheck = "SELECT id, reviewer_id FROM reviews WHERE id = ? AND is_deleted = 0 LIMIT 1";
    $stmtReview = $db->prepare($sqlReviewCheck);
    $stmtReview->execute([$reviewId]);
    $reviewRow = $stmtReview->fetch();

    if (!$reviewRow) {
        $db->rollBack();
        http_response_code(404);
        throw new Exception("The review targeted for moderation does not exist or has already been removed.");
    }

    if (intval($reviewRow['reviewer_id']) === intval($reporterId)) {
        $db->rollBack();
        http_response_code(422);
        throw new Exception("Security Violation: You cannot report or flag a review log submitted by your own account.");
    }

    $sqlDupCheck = "SELECT id FROM review_reports WHERE review_id = ? AND reporter_id = ? LIMIT 1";
    $stmtDup = $db->prepare($sqlDupCheck);
    $stmtDup->execute([$reviewId, $reporterId]);

    if ($stmtDup->fetch()) {
        $db->rollBack();
        http_response_code(409);
        throw new Exception("You have already logged an investigation ticket for this specific review.");
    }

    $sqlInsertReport = "INSERT INTO review_reports (review_id, reporter_id, reason_code, details, created_at, updated_at)
                        VALUES (?, ?, 'USER_FLAGGED', ?, NOW(), NOW())";
    $stmtInsertReport = $db->prepare($sqlInsertReport);
    $stmtInsertReport->execute([
        $reviewId,
        $reporterId,
        htmlspecialchars($reason, ENT_QUOTES, 'UTF-8')
    ]);

    $db->commit();

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Incident ticket authorized. System moderators have queued this block for review."
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
        "error" => "A serious database fault occurred while processing the incident logging sequence.",
        "debug" => $t->getMessage()
    ]);
}
?>