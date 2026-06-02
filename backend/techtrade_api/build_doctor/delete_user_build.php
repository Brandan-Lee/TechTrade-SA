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
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    SessionManager::init($db);

    if (!isset($_SESSION['user_id'])) {
        http_response_code(419);
        echo json_encode(["error" => "Your session has expired. Please log in again."]);
        exit();
    }

    $jsonInput = file_get_contents('php://input');
    $data = json_decode($jsonInput, true);

    $build_id = !empty($data['build_id']) ? intval($data['build_id']) : null;

    if (!$build_id) {
        throw new Exception("Please specify which item you want to delete.");
    }

    $stmt = $db->prepare("UPDATE user_builds 
        SET is_deleted = 1, deleted_at = ? 
        WHERE id = ? AND user_id = ?");

    $stmt->execute([
        date('Y-m-d H:i:s'),
        $build_id,
        $_SESSION['user_id']
    ]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("This item could not be found or you do not have permission to delete it.");
    }

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "An unexpected error occurred on the server.", "debug" => $t->getMessage()]);
}
