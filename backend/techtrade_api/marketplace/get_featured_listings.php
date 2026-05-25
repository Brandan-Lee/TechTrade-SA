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

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    $provinceInput = isset($_GET['province']) ? trim($_GET['province']) : '';

    if (empty($provinceInput)) {
        throw new Exception("Targeted terminal geo-coordinates missing.");
    }

    // NATIVE MATCHING: Direct string assignment now that data formats align precisely
    $targetProvince = $provinceInput;

    $query = "SELECT 
                l.id,
                l.title,
                l.price_cents,
                l.condition_grade AS `condition`,
                l.location_province AS `location`,
                l.status,
                u.id AS seller_id,
                u.first_name AS seller_first,
                u.last_name AS seller_last,
                (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.is_primary DESC, li.id ASC LIMIT 1) AS primary_image
              FROM listings l
              INNER JOIN users u ON l.seller_id = u.id
              WHERE l.status = 'AVAILABLE'
                AND l.is_deleted = 0
                AND l.location_province = :province
                AND u.is_deleted = 0
              ORDER BY l.created_at DESC, l.id DESC
              LIMIT 12";

    $stmt = $db->prepare($query);
    $stmt->execute([':province' => $targetProvince]);
    $rawListings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedListings = array_map(function ($item) use ($crypto) {
        $isEncrypted = function (?string $str) {
            if (empty($str)) return false;
            return (bool) preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $str);
        };

        if ($crypto && $isEncrypted($item['seller_first'])) {
            $decryptedFirst = $crypto->decrypt($item['seller_first']) ?? $item['seller_first'];
            $decryptedLast = $crypto->decrypt($item['seller_last']) ?? $item['seller_last'];
            $sellerName = $decryptedFirst . ' ' . $decryptedLast;
        } else {
            $sellerName = $item['seller_first'] . ' ' . $item['seller_last'];
        }

        $randValue = $item['price_cents'] / 100;
        $formattedPrice = "R" . number_format($randValue, 0, '.', ',');
        
        $statusLabel = "Available Now";
        if ($item['status'] === 'OFFERED') $statusLabel = "Offer Received";
        if ($item['status'] === 'PENDING') $statusLabel = "Payment Pending";

        return [
            "id" => (int) $item['id'],
            "title" => $item['title'],
            "price" => $formattedPrice,
            "seller" => $sellerName,
            "sellerId" => (int) $item['seller_id'],
            "location" => !empty($item['location']) ? $item['location'] : 'Unknown', // Returns native text string directly
            "status" => $statusLabel,
            "condition" => $item['condition'],
            "image" => !empty($item['primary_image']) ? publicMediaUrl($item['primary_image']) : null
        ];
    }, $rawListings);

    echo json_encode($formattedListings);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "Featured hardware stream extraction matrix dropped.", "debug" => $t->getMessage()]);
}
?>