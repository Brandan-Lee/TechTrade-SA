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
        throw new Exception("Please specify which item you want to update.");
    }

    $name = trim($data['name'] ?? 'Untitled Build');
    $cpu_id = !empty($data['cpu_id']) ? intval($data['cpu_id']) : null;
    $gpu_id = !empty($data['gpu_id']) ? intval($data['gpu_id']) : null;
    $psu_id = !empty($data['psu_id']) ? intval($data['psu_id']) : null;

    if (!$cpu_id && !$gpu_id && !$psu_id) {
        throw new Exception("Your setup must contain at least one component.");
    }

    $result_json = json_encode([
        'cpu_specs' => $data['cpu_specs'] ?? [],
        'gpu_specs' => $data['gpu_specs'] ?? [],
        'psu_specs' => $data['psu_specs'] ?? [],
        'updated_at' => date('Y-m-d H:i:s')
    ]);

    $stmt = $db->prepare("UPDATE user_builds SET 
        name = ?, cpu_id = ?, gpu_id = ?, psu_id = ?, 
        cpu_display_name = ?, gpu_display_name = ?, psu_display_name = ?, 
        result_json = ? 
        WHERE id = ? AND user_id = ? AND is_deleted = 0");

    $stmt->execute([
        $name,
        $cpu_id,
        $gpu_id,
        $psu_id,
        $data['cpu_display_name'] ?? null,
        $data['gpu_display_name'] ?? null,
        $data['psu_display_name'] ?? null,
        $result_json,
        $build_id,
        $_SESSION['user_id']
    ]);

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "An unexpected error occurred on the server."]);
}
