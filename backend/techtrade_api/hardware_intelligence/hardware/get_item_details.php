<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

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

    $slug = isset($_GET['category']) ? trim($_GET['category']) : '';
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if (empty($slug) || $id <= 0) {
        throw new Exception("Required identification numbers or category paths are missing.");
    }

    $categoryStmt = $db->prepare("SELECT spec_table FROM categories WHERE slug = ? LIMIT 1");
    $categoryStmt->execute([$slug]);
    $category = $categoryStmt->fetch(PDO::FETCH_ASSOC);

    if (!$category) {
        http_response_code(404);
        throw new Exception("The requested category details could not be found.");
    }

    $specTable = $category['spec_table'];

    if (!empty($specTable) && preg_match('/^[a-zA-Z0-9_]+$/', $specTable)) {
        $query = "SELECT h.*, s.* FROM hardware h 
                  INNER JOIN {$specTable} s ON h.id = s.hardware_id 
                  WHERE h.id = :id LIMIT 1";
    } else {
        $query = "SELECT h.* FROM hardware h WHERE h.id = :id LIMIT 1";
    }

    $stmt = $db->prepare($query);
    $stmt->execute([':id' => $id]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        http_response_code(404);
        throw new Exception("The requested item information could not be found.");
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "An unexpected system error occurred while loading the item details. Please try again."]);
}
