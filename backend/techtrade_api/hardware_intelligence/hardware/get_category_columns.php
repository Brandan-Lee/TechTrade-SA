<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

try {
    require_once __DIR__ . '/../../config/config.php';
    require_once __DIR__ . '/../../models/validation/database.php';
    require_once __DIR__ . '/../../models/helpers/session_manager.php';
    require_once __DIR__ . '/../../models/authentication/user.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);
    if (!isset($_SESSION['user_id'])) {
        http_response_code(419);
        echo json_encode(["error" => "Your session has expired. Please log in again."]);
        exit();
    }

    $user = User::findById($db, $_SESSION['user_id']);
    if (!$user) {
        http_response_code(403);
        echo json_encode(["error" => "Access denied."]);
        exit();
    }

    if (!isset($_GET['category']) || empty(trim($_GET['category']))) {
        http_response_code(400);
        throw new Exception("The required category name is missing.");
    }

    $categorySlug = trim($_GET['category']);

    $categoryQuery = $db->prepare("SELECT spec_table FROM categories WHERE slug = ? LIMIT 1");
    $categoryQuery->execute([$categorySlug]);
    $categoryData = $categoryQuery->fetch(PDO::FETCH_ASSOC);

    if (!$categoryData) {
        http_response_code(404);
        throw new Exception("The requested category details could not be found.");
    }

    $specificTableName = $categoryData['spec_table'];
    $filteredColumns = [];

    if (!empty($specificTableName) && preg_match('/^[a-zA-Z0-9_]+$/', $specificTableName)) {

        $layoutQuery = $db->prepare("DESCRIBE {$specificTableName}");
        $layoutQuery->execute();
        $rawColumns = $layoutQuery->fetchAll(PDO::FETCH_COLUMN);

        $columnsToHide = [
            'id',
            'hardware_id',
            'category_id',
            'created_at',
            'updated_at',
            'brand',
            'model',
            'full_name',
            'slug',
            'msrp_cents',
            'is_active'
        ];

        foreach ($rawColumns as $columnName) {
            if (!in_array($columnName, $columnsToHide)) {
                $filteredColumns[] = $columnName;
            }
        }
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "columns" => $filteredColumns
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "An unexpected system error occurred while loading form fields. Please try again."]);
}
