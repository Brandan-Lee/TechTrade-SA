<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';

    $db = Database::getConnection();
    $userId = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($userId <= 0)
        throw new Exception("Invalid user ID.");

    $sql = "
        SELECT 
            t.id, t.title, t.price_cents, t.status, t.created_at,
            u_seller.first_name AS seller_name,
            u_buyer.first_name AS buyer_name
        FROM trades t
        LEFT JOIN users u_seller ON t.seller_id = u_seller.id
        LEFT JOIN users u_buyer ON t.buyer_id = u_buyer.id
        WHERE (t.seller_id = ? OR t.buyer_id = ?)
        AND t.status IN ('COMMITTED', 'COMPLETED')
        ORDER BY t.created_at DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$userId, $userId]);
    $trades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedTrades = array_map(function ($t) {
        return [
            "id" => (int) $t['id'],
            "title" => $t['title'],
            "price" => "R" . number_format($t['price_cents'] / 100, 0, '.', ','),
            "status" => $t['status'],
            "date" => date('M j, Y', strtotime($t['created_at'])),
            "other_party" => ($t['seller_name'] ? "Seller: " . $t['seller_name'] : "Buyer: " . $t['buyer_name'])
        ];
    }, $trades);

    echo json_encode(["trades" => $formattedTrades]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}
?>