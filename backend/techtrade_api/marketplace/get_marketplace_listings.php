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
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    if ($limit <= 0)
        $limit = 10;
    if ($limit > 25)
        $limit = 25; 

    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    if ($page <= 0)
        $page = 1;
    $offset = ($page - 1) * $limit;

    $category = isset($_GET['category']) ? trim((string) $_GET['category']) : '';
    $condition = isset($_GET['condition']) ? trim((string) $_GET['condition']) : '';
    $priceMin = isset($_GET['priceMin']) ? intval($_GET['priceMin']) : 0; 
    $priceMax = isset($_GET['priceMax']) ? intval($_GET['priceMax']) : 0; 
    $q = isset($_GET['q']) ? trim((string) $_GET['q']) : '';

    $where = [];
    $params = [];

    $where[] = "l.is_deleted = 0";
    $where[] = "u.is_deleted = 0";
    $where[] = "l.status IN ('AVAILABLE', 'OFFERED')";

    if ($category !== '') {
        $where[] = "(c.name = :category OR c.slug = :categorySlug)";
        $params[':category'] = $category;
        $params[':categorySlug'] = strtolower($category);
    }

    if ($condition !== '') {
        $where[] = "l.condition_grade = :condition";
        $params[':condition'] = $condition;
    }

    if ($priceMin > 0) {
        $where[] = "l.price_cents >= :minCents";
        $params[':minCents'] = $priceMin * 100;
    }
    if ($priceMax > 0) {
        $where[] = "l.price_cents <= :maxCents";
        $params[':maxCents'] = $priceMax * 100;
    }

    if ($q !== '') {
        $where[] = "l.title LIKE :q";
        $params[':q'] = '%' . $q . '%';
    }

    $whereSql = count($where) ? ("WHERE " . implode(" AND ", $where)) : "";

    $sqlCount = "
        SELECT COUNT(*) AS total
        FROM listings l
        INNER JOIN users u ON l.seller_id = u.id
        INNER JOIN categories c ON l.category_id = c.id
        $whereSql
    ";

    $stmtCount = $db->prepare($sqlCount);
    $stmtCount->execute($params);
    $totalCount = (int) ($stmtCount->fetchColumn() ?: 0);

    $totalPages = $totalCount > 0 ? (int) ceil($totalCount / $limit) : 1;
    if ($page > $totalPages) {
        $page = $totalPages;
        $offset = ($page - 1) * $limit;
    }

    $sql = "
        SELECT
            l.id,
            l.title,
            l.price_cents,
            l.condition_grade AS `condition`,
            l.location_province AS `location`,
            l.status,
            u.id AS seller_id,
            u.first_name AS seller_first,
            u.last_name AS seller_last,
            c.name AS category_name,
            (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.is_primary DESC, li.id ASC LIMIT 1) AS primary_image
        FROM listings l
        INNER JOIN users u ON l.seller_id = u.id
        INNER JOIN categories c ON l.category_id = c.id
        $whereSql
        ORDER BY l.published_at DESC, l.id DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $db->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rawListings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $isEncrypted = function (?string $str): bool {
        if (empty($str))
            return false;
        return (bool) preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $str);
    };

    $items = array_map(function ($item) use ($crypto, $isEncrypted) {
        if ($crypto && $isEncrypted($item['seller_first'])) {
            $decryptedFirst = $crypto->decrypt($item['seller_first']) ?? $item['seller_first'];
            $decryptedLast = $crypto->decrypt($item['seller_last']) ?? $item['seller_last'];
            $sellerName = trim($decryptedFirst . ' ' . $decryptedLast);
        } else {
            $sellerName = trim(($item['seller_first'] ?? '') . ' ' . ($item['seller_last'] ?? ''));
        }

        $zar = ((int) $item['price_cents']) / 100;
        $formattedPrice = "R" . number_format($zar, 0, '.', ',');

        $statusLabel = "Available Now";
        if (($item['status'] ?? '') === 'OFFERED')
            $statusLabel = "Offer Received";

        return [
            "id" => (int) $item['id'],
            "title" => $item['title'],
            "price" => $formattedPrice,
            "seller" => $sellerName,
            "sellerId" => (int) $item['seller_id'],
            "location" => !empty($item['location']) ? $item['location'] : 'Unknown',
            "status" => $statusLabel,
            "condition" => $item['condition'],
            "category" => $item['category_name'],
            "image" => !empty($item['primary_image']) ? getPublicMediaUrl($item['primary_image']) : null,
        ];
    }, $rawListings);

    echo json_encode([
        "page" => $page,
        "limit" => $limit,
        "totalCount" => $totalCount,
        "totalPages" => $totalPages,
        "items" => $items,
    ]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "error" => "An unexpected error occurred while loading the marketplace items.",
        "debug" => $t->getMessage(),
    ]);
}
