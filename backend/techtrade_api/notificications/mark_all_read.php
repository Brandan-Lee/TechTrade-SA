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
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Your session has expired. Please log in again.");
    }
    $userIdValue = intval($activeUserId);

    $sql = "UPDATE notifications 
            SET is_read = 1, read_at = NOW() 
            WHERE user_id = ? AND is_read = 0 AND is_deleted = 0";

    $stmt = $db->prepare($sql);
    $stmt->execute([$userIdValue]);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "All notifications marked as read."
    ]);
} catch (Exception $e) {
    http_response_code(http_response_code() === 200 ? 400 : http_response_code());
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error" => "An unexpected error occurred on the server."
    ]);
}
