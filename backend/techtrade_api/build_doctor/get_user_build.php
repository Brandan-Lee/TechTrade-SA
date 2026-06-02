<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
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

    $stmt = $db->prepare("SELECT 
        id, name, cpu_id, gpu_id, psu_id, 
        cpu_display_name, gpu_display_name, psu_display_name, result_json
        FROM user_builds 
        WHERE user_id = ? AND is_deleted = 0 
        ORDER BY id DESC LIMIT 1");

    $stmt->execute([$_SESSION['user_id']]);
    $build = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($build) {
        $specs = [];
        if (!empty($build['result_json'])) {
            $specs = json_decode($build['result_json'], true);
        }

        echo json_encode([
            "id" => $build['id'],
            "name" => $build['name'],
            "cpu_id" => $build['cpu_id'],
            "gpu_id" => $build['gpu_id'],
            "psu_id" => $build['psu_id'],
            "cpu_display_name" => $build['cpu_display_name'],
            "gpu_display_name" => $build['gpu_display_name'],
            "psu_display_name" => $build['psu_display_name'],
            "cpu_specs" => $specs['cpu_specs'] ?? [],
            "gpu_specs" => $specs['gpu_specs'] ?? [],
            "psu_specs" => $specs['psu_specs'] ?? []
        ]);
    } else {
        echo json_encode(null);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "An unexpected error occurred on the server."]);
}
