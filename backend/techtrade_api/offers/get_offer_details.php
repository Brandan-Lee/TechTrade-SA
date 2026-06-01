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
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        throw new Exception("Method Not Allowed.");
    }

    if (!isset($_GET['offer_id']) || empty($_GET['offer_id'])) {
        http_response_code(400);
        throw new Exception("Missing required identification token (offer_id).");
    }
    $offerId = intval($_GET['offer_id']);

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';
    require_once __DIR__ . '/../helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not establish a clean connection to the database.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Unauthorized Access.");
    }
    $userIdValue = intval($activeUserId);

    // Updated Query: Added LEFT JOIN transactions t on o.id = t.offer_id
    $sqlFetch = "
        SELECT 
            o.id AS offer_id,
            o.amount_cents AS offer_amount_cents,
            o.message AS buyer_message,
            o.created_at AS offer_created_at,
            l.id AS listing_id,
            l.title AS item_title,
            l.price_cents AS listing_price_cents,
            l.seller_id AS listing_seller_id,
            b.first_name AS buyer_fn,
            b.last_name AS buyer_ln,
            b.avatar_url AS buyer_avatar,
            b.province AS buyer_province,
            b.member_since AS buyer_joined,
            b.trust_score AS buyer_trust_score,
            img.url AS primary_image_url,
            t.id AS transaction_id,
            (SELECT COUNT(*) FROM reviews r WHERE r.reviewee_id = o.buyer_id AND r.is_deleted = 0) AS total_buyer_reviews
        FROM offers o
        INNER JOIN listings l ON o.listing_id = l.id
        INNER JOIN users b ON o.buyer_id = b.id
        LEFT JOIN listing_images img ON l.id = img.listing_id AND img.is_primary = 1
        LEFT JOIN transactions t ON o.id = t.offer_id
        WHERE o.id = ? AND l.is_deleted = 0
        LIMIT 1
    ";

    $stmt = $db->prepare($sqlFetch);
    $stmt->execute([$offerId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        throw new Exception("The requested offer could not be found or the listing has been removed.");
    }

    if (intval($row['listing_seller_id']) !== $userIdValue) {
        http_response_code(403);
        throw new Exception("Access Denied. You do not own the parent listing asset.");
    }

    $firstName = $row['buyer_fn'];
    $lastName = $row['buyer_ln'];

    if ($crypto) {
        if (!empty($firstName)) $firstName = $crypto->decrypt($firstName) ?? $firstName;
        if (!empty($lastName))  $lastName = $crypto->decrypt($lastName) ?? $lastName;
    }

    $fullName = trim($firstName . ' ' . $lastName);
    if (empty($fullName)) {
        $fullName = "Anonymous Buyer";
    }

    $formattedPayload = [
        "offer_id" => intval($row['offer_id']),
        "transaction_id" => $row['transaction_id'] ? intval($row['transaction_id']) : null, // Added transaction_id
        "itemTitle" => $row['item_title'],
        "originalPrice" => intval($row['listing_price_cents']),
        "offerPrice" => intval($row['offer_amount_cents']),
        "timeReceived" => $row['offer_created_at'],
        "listingImage" => $row['primary_image_url'] ? $row['primary_image_url'] : null,
        "listingId" => intval($row['listing_id']),
        "buyer" => [
            "name" => $fullName,
            "avatar" => $row['buyer_avatar'] ? $row['buyer_avatar'] : null,
            "rating" => number_format(floatval($row['buyer_trust_score']), 1) . "/5",
            "reviews" => (string)$row['total_buyer_reviews'],
            "location" => $row['buyer_province'] ?? "Not Specified",
            "memberSince" => date("M Y", strtotime($row['buyer_joined'])),
            "note" => $row['buyer_message'] ?? "No message provided by the buyer."
        ]
    ];

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => $formattedPayload
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "error" => "An internal database error occurred while parsing data parameters.",
        "debug" => $t->getMessage()
    ]);
}
