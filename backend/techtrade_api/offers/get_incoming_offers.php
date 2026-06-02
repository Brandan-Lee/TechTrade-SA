<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        throw new Exception("This action is not supported.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Your session has expired. Please log in again.");
    }

    $userIdValue = intval($activeUserId);

    $listingIdParam = isset($_GET['listing_id']) && !empty($_GET['listing_id']) ? intval($_GET['listing_id']) : null;

    $sqlFetch = "
    SELECT 
        o.id,
        o.listing_id,
        o.buyer_id,
        o.amount_cents,
        o.message,
        o.status,
        o.parent_offer_id,
        o.created_at,
        l.title AS listing_title,
        l.price_cents AS listing_price_cents,
        img.url AS primary_image_url, 
        u.first_name AS buyer_fn,
        u.last_name AS buyer_ln,
        u.avatar_url AS buyer_avatar
    FROM offers o
    INNER JOIN listings l ON o.listing_id = l.id
    INNER JOIN users u ON o.buyer_id = u.id
    LEFT JOIN listing_images img ON l.id = img.listing_id AND img.is_primary = 1
    WHERE l.seller_id = ? 
      AND l.is_deleted = 0
      AND o.status = 'pending'
";

    if ($listingIdParam !== null) {
        $sqlFetch .= " AND l.id = ? ";
    }

    $sqlFetch .= " ORDER BY o.created_at DESC";

    $stmt = $db->prepare($sqlFetch);

    if ($listingIdParam !== null) {
        $stmt->execute([$userIdValue, $listingIdParam]);
    } else {
        $stmt->execute([$userIdValue]);
    }

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $compiledOffers = [];
    foreach ($rows as $row) {
        $firstName = $row['buyer_fn'];
        $lastName = $row['buyer_ln'];

        if ($crypto) {
            if (!empty($firstName))
                $firstName = $crypto->decrypt($firstName) ?? $firstName;
            if (!empty($lastName))
                $lastName = $crypto->decrypt($lastName) ?? $lastName;
        }

        $fullName = trim($firstName . ' ' . $lastName);
        if (empty($fullName)) {
            $fullName = "Marketplace User";
        }

        $compiledOffers[] = [
            "id" => intval($row['id']),
            "listing_id" => intval($row['listing_id']),
            "buyer_id" => intval($row['buyer_id']),
            "amount_cents" => intval($row['amount_cents']),
            "message" => $row['message'],
            "status" => $row['status'],
            "created_at" => $row['created_at'],
            "listing_title" => $row['listing_title'],
            "listing_price_cents" => intval($row['listing_price_cents']),
            "listing_image" => $row['primary_image_url'] ? $row['primary_image_url'] : null,
            "buyer_name" => $fullName,
            "buyer_avatar" => $row['buyer_avatar'] ? $row['buyer_avatar'] : null,
            "parent_offer_id" => $row['parent_offer_id'] ? intval($row['parent_offer_id']) : null
        ];
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "offers" => $compiledOffers
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error" => "An unexpected error occurred on the server.",
        "debug" => $t->getMessage()
    ]);
}
