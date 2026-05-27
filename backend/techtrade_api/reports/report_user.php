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
        throw new Exception("You must be logged in to report a user.");
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("Invalid form data submission.");
    }

    $reportedUserId = isset($data['reported_user_id']) ? intval($data['reported_user_id']) : 0;
    $reasonCode = isset($data['reason']) ? trim($data['reason']) : '';
    $details = isset($data['details']) ? trim($data['details']) : '';
    $transactionId = isset($data['transaction_id']) ? intval($data['transaction_id']) : null;

    if ($reportedUserId <= 0) {
        throw new Exception("The reported user ID is missing or invalid.");
    }
    if (empty($reasonCode)) {
        throw new Exception("Please select a reason for reporting.");
    }
    if (empty($details)) {
        throw new Exception("Please provide more details about the issue.");
    }
    if (strlen($details) < 10) {
        throw new Exception("Please provide a more descriptive explanation (minimum 10 characters).");
    }

    if ($reportedUserId === intval($reporterId)) {
        http_response_code(422);
        throw new Exception("You cannot submit an incident report against your own account.");
    }

    $allowedReasons = ['payment', 'communication', 'item_issue', 'no_show', 'other'];
    if (!in_array($reasonCode, $allowedReasons)) {
        http_response_code(400);
        throw new Exception("Invalid classification category code selected.");
    }

    $sqlCheck = "SELECT id FROM users WHERE id = ? LIMIT 1";
    $stmtCheck = $db->prepare($sqlCheck);
    $stmtCheck->execute([$reportedUserId]);

    if (!$stmtCheck->fetch()) {
        http_response_code(404);
        throw new Exception("The user you are trying to report does not exist.");
    }

    $sqlDuplicateCheck = "
        SELECT id FROM user_reports 
        WHERE reporter_id = ? AND reported_user_id = ? AND status IN ('pending', 'reviewing') 
        LIMIT 1
    ";
    $stmtDup = $db->prepare($sqlDuplicateCheck);
    $stmtDup->execute([$reporterId, $reportedUserId]);

    if ($stmtDup->fetch()) {
        http_response_code(409);
        throw new Exception("You have already submitted an active report for this user. Our team is currently reviewing it.");
    }

    $sqlInsert = "
        INSERT INTO user_reports (reporter_id, reported_user_id, transaction_id, reason_code, details, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    ";
    $stmtInsert = $db->prepare($sqlInsert);
    $stmtInsert->execute([
        $reporterId,
        $reportedUserId,
        $transactionId > 0 ? $transactionId : null,
        $reasonCode,
        $details
    ]);

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "The report has been successfully recorded and sent to the administration team."
    ]);

} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "error" => "A server error occurred while processing your report.",
        "debug" => $t->getMessage()
    ]);
}
?>