<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';

    $db = Database::getConnection();
    if (!$db) throw new Exception("Database connection failed.");

    $userId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($userId <= 0) throw new Exception("Invalid user ID.");

    // Initialize encryption engine
    $crypto = defined('ENCRYPTION_KEY') ? new EncryptionEngine(ENCRYPTION_KEY) : null;

    $sql = "
        SELECT 
            t.id, t.public_id, t.agreed_price_cents, t.status, t.created_at,
            t.seller_id, t.buyer_id, -- ADD THESE COLUMNS
            u_seller.first_name AS seller_name,
            u_buyer.first_name AS buyer_name,
            l.title
        FROM transactions t
        LEFT JOIN users u_seller ON t.seller_id = u_seller.id
        LEFT JOIN users u_buyer ON t.buyer_id = u_buyer.id
        LEFT JOIN listings l ON t.listing_id = l.id
        WHERE (t.seller_id = ? OR t.buyer_id = ?)
        AND t.status IN ('committed', 'completed')
        ORDER BY t.created_at DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$userId, $userId]);
    $trades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedTrades = array_map(function ($t) use ($crypto, $userId) {
        $decrypt = function ($val) use ($crypto) {
            return $crypto ? ($crypto->decrypt($val) ?? $val) : $val;
        };

        $isUserSeller = ((int)$t['seller_id'] === (int)$userId);
        $otherPartyName = $isUserSeller
            ? $decrypt($t['buyer_name'])
            : $decrypt($t['seller_name']);

        return [
            "id" => (int) $t['id'],
            "title" => $t['title'],
            "price" => "R" . number_format($t['agreed_price_cents'] / 100, 0, '.', ','),
            "status" => strtoupper($t['status']),
            "date" => date('M j, Y', strtotime($t['created_at'])),
            "buyer" => $otherPartyName
        ];
    }, $trades);

    echo json_encode(["trades" => $formattedTrades]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "An internal error occurred."]);
}
