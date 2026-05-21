<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../models/validation/database.php';
require_once '../models/hardware_intelligence/search_controller.php';

$inputData = json_decode(file_get_contents("php://input"), true);

$query = $inputData['q'] ?? '';
$category = $inputData['category'] ?? '';
    
if (empty($query) || empty($category)) {
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

try {
    $db = Database::getConnection();
    $controller = new SearchController($db);
    echo json_encode($controller->search($query, $category));
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>