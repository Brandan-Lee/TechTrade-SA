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
    require_once __DIR__ . '/../helpers/session_manager.php';
    require_once __DIR__ . '/../models/authentication/user.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database connection channel could not be established.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    SessionManager::init($db);

    $listingId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($listingId <= 0) {
        throw new Exception("Validation Error: Missing or invalid listing ID.");
    }

    $db->beginTransaction();
    try {
        $sqlExpireOffers = "
            UPDATE offers 
            SET status = 'expired', responded_at = NOW() 
            WHERE listing_id = ? AND status = 'pending' AND expires_at < NOW()
        ";
        $stmtExpire = $db->prepare($sqlExpireOffers);
        $stmtExpire->execute([$listingId]);

        $sqlRestoreStatus = "
            UPDATE listings l
            SET l.status = 'AVAILABLE'
            WHERE l.id = ? 
              AND l.status = 'OFFERED'
              AND NOT EXISTS (
                  SELECT 1 FROM offers o 
                  WHERE o.listing_id = l.id AND o.status = 'pending'
              )
        ";
        $stmtRestore = $db->prepare($sqlRestoreStatus);
        $stmtRestore->execute([$listingId]);

        $db->commit();
    } catch (Exception $sweepError) {
        $db->rollBack();
    }

    $sqlListing = "
        SELECT 
            l.id, l.seller_id, l.title, l.description, l.condition_grade, l.price_cents,
            l.location_province, l.view_count, l.published_at, l.category_id, l.hardware_id, l.status,
            c.name AS category_name, c.slug AS category_slug,
            u.first_name, u.last_name, u.province AS user_province, u.avatar_url, u.trust_score, u.trade_count
        FROM listings l
        INNER JOIN users u ON l.seller_id = u.id
        INNER JOIN categories c ON l.category_id = c.id
        WHERE l.id = ? AND l.is_deleted = 0 AND l.status IN ('AVAILABLE', 'OFFERED')
        LIMIT 1
    ";

    $stmtListing = $db->prepare($sqlListing);
    $stmtListing->execute([$listingId]);
    $listingRow = $stmtListing->fetch(PDO::FETCH_ASSOC);

    if (!$listingRow) {
        http_response_code(404);
        echo json_encode(["error" => "The requested listing could not be found or is unavailable."]);
        exit();
    }

    $currentUserId = SessionManager::getActiveUserId();
    $viewIncremented = false;

    if ($currentUserId && (int) $currentUserId !== (int) $listingRow['seller_id']) {
        $db->beginTransaction();
        try {
            $insertView = $db->prepare("INSERT IGNORE INTO listing_views (listing_id, user_id) VALUES (?, ?)");
            $insertView->execute([$listingId, $currentUserId]);

            if ($insertView->rowCount() > 0) {
                $updateViews = $db->prepare("UPDATE listings SET view_count = view_count + 1 WHERE id = ?");
                $updateViews->execute([$listingId]);
                $viewIncremented = true;
            }
            $db->commit();
        } catch (Exception $viewError) {
            $db->rollBack();
        }
    }

    if ($viewIncremented) {
        $listingRow['view_count'] += 1;
    }

    if ($crypto) {
        $decryptedFirst = $crypto->decrypt($listingRow['first_name']) ?? 'Decryption Error';
        $decryptedLast = $crypto->decrypt($listingRow['last_name']) ?? 'Decryption Error';
        $sellerFullName = $decryptedFirst . ' ' . $decryptedLast;
    } else {
        $sellerFullName = $listingRow['first_name'] . ' ' . $listingRow['last_name'];
    }

    $sqlImages = "SELECT url, is_primary FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC, id ASC";
    $stmtImages = $db->prepare($sqlImages);
    $stmtImages->execute([$listingId]);
    $imageRows = $stmtImages->fetchAll(PDO::FETCH_ASSOC);

    $imagesArray = [];
    $imagePaths = [];
    foreach ($imageRows as $img) {
        $imagePaths[] = $img['url'];
        $imagesArray[] = publicMediaUrl($img['url']);
    }

    $sqlSpecs = "SELECT spec_key AS label, spec_value AS value FROM listing_specs WHERE listing_id = ? ORDER BY sort_order ASC, id ASC";
    $stmtSpecs = $db->prepare($sqlSpecs);
    $stmtSpecs->execute([$listingId]);
    $specsArray = $stmtSpecs->fetchAll(PDO::FETCH_ASSOC);

    $sqlRelated = "
        SELECT id, title, price_cents, condition_grade, published_at, view_count
        FROM listings
        WHERE category_id = ? AND id != ? AND status = 'AVAILABLE' AND is_deleted = 0
        ORDER BY created_at DESC
        LIMIT 2
    ";
    $stmtRelated = $db->prepare($sqlRelated);
    $stmtRelated->execute([$listingRow['category_id'], $listingId]);
    $relatedRows = $stmtRelated->fetchAll(PDO::FETCH_ASSOC);

    $sqlImgFallback = "SELECT url FROM listing_images WHERE listing_id = ? ORDER BY is_primary DESC, sort_order ASC LIMIT 1";
    $stmtImgFallback = $db->prepare($sqlImgFallback);

    foreach ($relatedRows as &$item) {
        $stmtImgFallback->execute([$item['id']]);
        $thumb = $stmtImgFallback->fetch(PDO::FETCH_ASSOC);
        $item['image'] = $thumb
            ? publicMediaUrl($thumb['url'])
            : null;
        $item['condition_grade'] = ucfirst(strtolower($item['condition_grade']));
    }

    $payload = [
        "listing" => [
            "id" => (int) $listingRow['id'],
            "seller_id" => (int) $listingRow['seller_id'],
            "title" => $listingRow['title'],
            "description" => $listingRow['description'],
            "condition_grade" => $listingRow['condition_grade'],
            "price_cents" => (int) $listingRow['price_cents'],
            "status" => $listingRow['status'],
            "category_id" => (int) $listingRow['category_id'],
            "category_name" => $listingRow['category_name'],
            "category_slug" => $listingRow['category_slug'],
            "hardware_id" => $listingRow['hardware_id'] ? (int) $listingRow['hardware_id'] : null,
            "location_province" => !empty($listingRow['location_province']) ? $listingRow['location_province'] : $listingRow['user_province'],
            "view_count" => (int) $listingRow['view_count'],
            "published_at" => $listingRow['published_at'],
            "images" => $imagesArray,
            "image_paths" => $imagePaths,
            "specs" => $specsArray
        ],
        "seller" => [
            "name" => $sellerFullName,
            "avatar" => !empty($listingRow['avatar_url']) ? publicMediaUrl($listingRow['avatar_url']) : null,
            "trust_score" => number_format((float) $listingRow['trust_score'], 1, '.', ''),
            "trade_count" => (int) $listingRow['trade_count']
        ],
        "matching_assets" => $relatedRows
    ];

    http_response_code(200);
    echo json_encode($payload);

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "An internal processing error occurred while fetching the listing.", "debug" => $t->getMessage()]);
}