<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../models/validation/database.php';

$inputData = json_decode(file_get_contents("php://input"), true);
$query = isset($inputData['q']) ? trim((string)$inputData['q']) : '';

if ($query === '' || mb_strlen($query) < 2) {
    echo json_encode(["results" => []]);
    exit;
}

try {
    $db = Database::getConnection();
    $stmt = $db->prepare("
        SELECT
            l.id,
            l.title AS full_name,
            c.name AS category
        FROM listings l
        INNER JOIN categories c ON c.id = l.category_id
        WHERE l.is_deleted = 0
          AND l.status IN ('AVAILABLE', 'OFFERED')
          AND l.title LIKE ?
        ORDER BY
            CASE WHEN l.title LIKE ? THEN 0 ELSE 1 END,
            l.published_at DESC,
            l.id DESC
        LIMIT 5
    ");
    $likeContains = '%' . $query . '%';
    $likePrefix = $query . '%';
    $stmt->execute([$likeContains, $likePrefix]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    echo json_encode(["results" => $results]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "Suggestion query failed.", "debug" => $t->getMessage()]);
}

?>

