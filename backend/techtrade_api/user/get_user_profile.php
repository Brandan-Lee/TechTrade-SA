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

    if (!function_exists('getPublicMediaUrl')) {
        function getPublicMediaUrl($path)
        {
            return $path;
        }
    }

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("We're having trouble loading the profile. Please try again shortly.");
    }

    $userId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($userId <= 0) {
        throw new Exception("Please provide a valid user account.");
    }

    $crypto = defined('ENCRYPTION_KEY') ? new EncryptionEngine(ENCRYPTION_KEY) : null;

    $sqlUser = "
        SELECT
            u.id, u.first_name, u.last_name, u.province, u.avatar_url,
            u.trust_score, u.trade_count, u.reg_type, u.created_at,
            (SELECT COUNT(*) FROM reviews r WHERE r.reviewee_id = u.id AND r.is_deleted = 0) AS review_count
        FROM users u
        WHERE u.id = ? AND u.is_deleted = 0
        LIMIT 1
    ";

    $stmtUser = $db->prepare($sqlUser);
    $stmtUser->execute([$userId]);
    $row = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(["error" => "This profile could not be found."]);
        exit();
    }

    if ($crypto) {
        $first = $crypto->decrypt($row['first_name']) ?? '';
        $last = $crypto->decrypt($row['last_name']) ?? '';
        $fullName = trim($first . ' ' . $last) ?: 'Community Member';
    } else {
        $fullName = trim($row['first_name'] . ' ' . $row['last_name']) ?: 'Community Member';
    }

    $memberSince = $row['created_at'] ? date('M Y', strtotime($row['created_at'])) : 'Unknown';

    $sqlListings = "
        SELECT
            l.id, l.title, l.price_cents, l.condition_grade, l.view_count, l.published_at,
            (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.is_primary DESC, li.id ASC LIMIT 1) AS primary_image
        FROM listings l
        WHERE l.seller_id = ? AND l.is_deleted = 0 AND l.status IN ('AVAILABLE', 'OFFERED')
        ORDER BY l.published_at DESC, l.id DESC
        LIMIT 12
    ";
    $stmtListings = $db->prepare($sqlListings);
    $stmtListings->execute([$userId]);
    $listingRows = $stmtListings->fetchAll(PDO::FETCH_ASSOC);

    $listings = array_map(function ($item) {
        $price = $item['price_cents'] / 100;
        return [
            "id" => (int) $item['id'],
            "title" => $item['title'],
            "price" => "R" . number_format($price, 0, '.', ','),
            "condition" => $item['condition_grade'],
            "views" => (string) $item['view_count'],
            "time" => $item['published_at'] ? date('M j, Y', strtotime($item['published_at'])) : '',
            "image" => !empty($item['primary_image']) ? getPublicMediaUrl($item['primary_image']) : null,
        ];
    }, $listingRows);

    $sqlReviews = "
        SELECT
            r.id, r.reviewer_id, r.rating, r.comment, r.created_at,
            u.id as reviewer_user_id, u.first_name, u.last_name, u.avatar_url
        FROM reviews r
        INNER JOIN users u ON r.reviewer_id = u.id
        WHERE r.reviewee_id = ? AND r.is_deleted = 0
        ORDER BY r.created_at DESC
        LIMIT 50
    ";
    $stmtReviews = $db->prepare($sqlReviews);
    $stmtReviews->execute([$userId]);
    $reviewRows = $stmtReviews->fetchAll(PDO::FETCH_ASSOC);

    $reviews = array_map(function ($item) use ($crypto) {
        $reviewerFirstName = $crypto ? ($crypto->decrypt($item['first_name']) ?? '') : $item['first_name'];
        $reviewerLastName = $crypto ? ($crypto->decrypt($item['last_name']) ?? '') : $item['last_name'];
        $reviewerFullName = trim($reviewerFirstName . ' ' . $reviewerLastName) ?: 'Community Peer';

        return [
            "id" => (int) $item['id'],
            "reviewer" => [
                "id" => (int) $item['reviewer_user_id'],
                "name" => $reviewerFullName,
                "avatar" => !empty($item['avatar_url']) ? getPublicMediaUrl($item['avatar_url']) : null,
            ],
            "rating" => (int) $item['rating'],
            "comment" => $item['comment'],
            "date" => $item['created_at'] ? date('M j, Y', strtotime($item['created_at'])) : 'Unknown',
        ];
    }, $reviewRows);

    http_response_code(200);
    echo json_encode([
        "user" => [
            "id" => (int) $row['id'],
            "reg_type" => $row['reg_type'],
            "fullName" => $fullName,
            "province" => $row['province'] ?? 'Unknown',
            "avatar" => !empty($row['avatar_url']) ? getPublicMediaUrl($row['avatar_url']) : null,
            "trust_score" => number_format((float) $row['trust_score'], 1, '.', ''),
            "trade_count" => (int) $row['trade_count'],
            "review_count" => (int) $row['review_count'],
            "member_since" => $memberSince,
        ],
        "listings" => $listings,
        "reviews" => $reviews,
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred while loading this profile."]);
}
