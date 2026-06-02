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
    $reporterId = SessionManager::getActiveUserId();

    if (!$reporterId) {
        http_response_code(412);
        throw new Exception("Your session has expired. Please log in again to report this listing.");
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("We couldn't read your request. Please check your submission and try again.");
    }

    $listingId = isset($data['listing_id']) ? intval($data['listing_id']) : 0;
    $reason = isset($data['reason']) ? trim($data['reason']) : '';
    $details = isset($data['details']) ? trim($data['details']) : '';

    if ($listingId <= 0) {
        throw new Exception("Please specify a valid item listing to flag.");
    }
    if (empty($reason)) {
        throw new Exception("Please select a reason for reporting.");
    }
    if (empty($details)) {
        throw new Exception("Please provide more details about the issue.");
    }

    $sqlCheck = "SELECT id FROM listings WHERE id = ? AND is_deleted = 0";
    $stmtCheck = $db->prepare($sqlCheck);
    $stmtCheck->execute([$listingId]);

    if (!$stmtCheck->fetch()) {
        http_response_code(404);
        throw new Exception("The listing you are trying to report could not be found.");
    }

    $sqlDuplicateCheck = "
        SELECT id FROM listing_reports 
        WHERE reporter_id = ? AND listing_id = ? AND status IN ('pending', 'reviewing') 
        LIMIT 1
    ";
    $stmtDup = $db->prepare($sqlDuplicateCheck);
    $stmtDup->execute([$reporterId, $listingId]);

    if ($stmtDup->fetch()) {
        http_response_code(409);
        throw new Exception("You have already reported this listing. Our team is currently reviewing it.");
    }

    $sqlInsert = "
        INSERT INTO listing_reports (reporter_id, listing_id, reason, details, status, created_at)
        VALUES (?, ?, ?, ?, 'pending', NOW())
    ";
    $stmtInsert = $db->prepare($sqlInsert);
    $stmtInsert->execute([
        $reporterId,
        $listingId,
        $reason,
        $details
    ]);

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Listing reported successfully. Our team will look into it."
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error" => "An unexpected error occurred while processing your request.",
        "debug" => $t->getMessage()
    ]);
}
