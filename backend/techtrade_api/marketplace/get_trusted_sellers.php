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

    $query = "SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.trust_score AS rating,
                u.trade_count AS sales,
                u.avatar_url,
                u.province,
                COUNT(r.id) AS review_count
              FROM users u
              LEFT JOIN reviews r ON u.id = r.reviewee_id AND r.is_deleted = 0
              WHERE u.role_id IN (2, 5) 
                AND u.trust_score >= 4.00
                AND u.is_suspended = 0 
                AND u.is_banned = 0 
                AND u.is_deleted = 0
              GROUP BY 
                u.id, 
                u.first_name, 
                u.last_name, 
                u.trust_score, 
                u.trade_count, 
                u.avatar_url, 
                u.province
              ORDER BY u.trust_score DESC, u.trade_count DESC 
              LIMIT 10";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedSellers = array_map(function ($seller) use ($crypto) {
        if ($crypto) {
            $decryptedFirst = $crypto->decrypt($seller['first_name']) ?? 'User';
            $decryptedLast = $crypto->decrypt($seller['last_name']) ?? 'Profile';
            $fullName = $decryptedFirst . ' ' . $decryptedLast;
        } else {
            $fullName = $seller['first_name'] . ' ' . $seller['last_name'];
        }

        $ratingFloat = (float) $seller['rating'];
        if ($ratingFloat > 4.5) {
            $badge = "Highly Recommended";
        } else {
            $badge = "Top Rated";
        }

        return [
            "id" => (int) $seller['id'],
            "name" => $fullName,
            "rating" => number_format($ratingFloat, 1, '.', ''),
            "reviews" => (int) $seller['review_count'],
            "sales" => (int) $seller['sales'],
            "badge" => $badge,
            "image" => !empty($seller['avatar_url']) ? getPublicMediaUrl($seller['avatar_url']) : null
        ];
    }, $sellers);

    echo json_encode($formattedSellers);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "error" => "An unexpected error occurred while loading the top sellers.",
        "debug" => $t->getMessage()
    ]);
}
