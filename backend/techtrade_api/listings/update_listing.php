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

function cleanImageLinkPath(string $value): string
{
    $value = trim(str_replace('\\', '/', $value));
    if (preg_match('#(uploads/listings/[^?\\s]+)#i', $value, $matches)) {
        return $matches[1];
    }
    return ltrim($value, '/');
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';
    require_once __DIR__ . '/../models/authentication/user.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);

    if (!isset($_SESSION['user_id'])) {
        http_response_code(419);
        echo json_encode(["error" => "Your session has expired. Please log in again."]);
        exit();
    }

    $user = User::findById($db, $_SESSION['user_id']);
    if (!$user || $user->isBanned()) {
        http_response_code(403);
        echo json_encode(["error" => "Access denied: Your account is disabled or could not be found."]);
        exit();
    }

    $currentUserId = (int) $user->getId();

    $listingId = intval($_POST['listing_id'] ?? 0);
    if ($listingId <= 0) {
        throw new Exception("Please specify a valid item to update.");
    }

    $stmtOwner = $db->prepare("
        SELECT id, seller_id, is_deleted
        FROM listings
        WHERE id = ?
        LIMIT 1
    ");
    $stmtOwner->execute([$listingId]);
    $existing = $stmtOwner->fetch(PDO::FETCH_ASSOC);

    if (!$existing || (int) $existing['is_deleted'] === 1) {
        throw new Exception("This listing could not be found.");
    }

    if ((int) $existing['seller_id'] !== $currentUserId) {
        http_response_code(403);
        echo json_encode(["error" => "You do not have permission to update this listing."]);
        exit();
    }

    $description = trim($_POST['description'] ?? '');
    $conditionGrade = trim($_POST['condition_grade'] ?? '');
    $priceCents = intval($_POST['price_cents'] ?? 0);

    if (empty($description) || empty($conditionGrade) || $priceCents <= 0) {
        throw new Exception("Please fill in the price, condition, and description.");
    }

    $allowedConditions = ['New', 'Like New', 'Good', 'Fair'];
    if (!in_array($conditionGrade, $allowedConditions)) {
        throw new Exception("Please select a valid item condition.");
    }

    $keptImagePaths = [];
    if (!empty($_POST['existing_images']) && is_array($_POST['existing_images'])) {
        foreach ($_POST['existing_images'] as $rawPath) {
            $normalized = cleanImageLinkPath((string) $rawPath);
            if ($normalized !== '') {
                $keptImagePaths[] = $normalized;
            }
        }
    }

    $hasNewUploads = !empty($_FILES['images']);
    if (empty($keptImagePaths) && !$hasNewUploads) {
        throw new Exception("Please upload at least one image for your listing.");
    }

    $db->beginTransaction();

    $stmtUpdate = $db->prepare("
        UPDATE listings SET
            description = ?,
            condition_grade = ?,
            price_cents = ?,
            updated_at = NOW()
        WHERE id = ? AND seller_id = ?
    ");
    $stmtUpdate->execute([
        $description,
        $conditionGrade,
        $priceCents,
        $listingId,
        $currentUserId,
    ]);

    if (!empty($keptImagePaths)) {
        $placeholders = implode(',', array_fill(0, count($keptImagePaths), '?'));
        $deleteSql = "DELETE FROM listing_images WHERE listing_id = ? AND url NOT IN ($placeholders)";
        $deleteParams = array_merge([$listingId], $keptImagePaths);
        $db->prepare($deleteSql)->execute($deleteParams);
    } else {
        $db->prepare("DELETE FROM listing_images WHERE listing_id = ?")->execute([$listingId]);
    }

    $uploadDir = getUploadFolderPath('listings');
    $sortOrder = count($keptImagePaths);

    if ($hasNewUploads) {
        $files = $_FILES['images'];
        $fileCount = is_array($files['name']) ? count($files['name']) : 0;

        $sqlImages = "INSERT INTO listing_images (listing_id, url, sort_order, is_primary) VALUES (?, ?, ?, ?)";
        $stmtImg = $db->prepare($sqlImages);

        for ($i = 0; $i < $fileCount; $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                if ($files['error'][$i] !== UPLOAD_ERR_NO_FILE) {
                    throw new Exception("An error occurred while transferring your images.");
                }
                continue;
            }

            $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

            if (!in_array($ext, $allowedExtensions)) {
                throw new Exception("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
            }

            $uniqueFilename = "listing_" . $listingId . "_" . bin2hex(random_bytes(8)) . "." . $ext;
            $destinationPath = $uploadDir . $uniqueFilename;

            if (!move_uploaded_file($files['tmp_name'][$i], $destinationPath)) {
                throw new Exception("We couldn't save your uploaded images. Please try again.");
            }

            $isPrimary = empty($keptImagePaths) && $i === 0 ? 1 : 0;
            $publicUrl = 'uploads/listings/' . $uniqueFilename;
            $stmtImg->execute([$listingId, $publicUrl, $sortOrder, $isPrimary]);
            $sortOrder++;
        }
    }

    $db->prepare("UPDATE listing_images SET is_primary = 0 WHERE listing_id = ?")->execute([$listingId]);

    if (!empty($keptImagePaths)) {
        $db->prepare("UPDATE listing_images SET is_primary = 1 WHERE listing_id = ? AND url = ?")
            ->execute([$listingId, $keptImagePaths[0]]);
    } else {
        $firstImg = $db->prepare("SELECT id FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC, id ASC LIMIT 1");
        $firstImg->execute([$listingId]);
        $firstRow = $firstImg->fetch(PDO::FETCH_ASSOC);
        if ($firstRow) {
            $db->prepare("UPDATE listing_images SET is_primary = 1 WHERE id = ?")
                ->execute([$firstRow['id']]);
        }
    }

    $countStmt = $db->prepare("SELECT COUNT(*) FROM listing_images WHERE listing_id = ?");
    $countStmt->execute([$listingId]);
    if ((int) $countStmt->fetchColumn() === 0) {
        throw new Exception("Please upload at least one image for your listing.");
    }

    $db->commit();

    http_response_code(200);
    echo json_encode(["success" => true, "listing_id" => $listingId]);
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
    echo json_encode(["error" => "An unexpected error occurred on the server.", "debug" => $t->getMessage()]);
}
