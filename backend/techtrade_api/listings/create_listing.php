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
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../helpers/session_manager.php';
    require_once __DIR__ . '/../models/authentication/user.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database connection channel could not be established.");
    }

    SessionManager::init($db);

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Security Access Denied: Session unauthorized or expired."]);
        exit();
    }

    $user = User::findById($db, $_SESSION['user_id']);
    if (!$user || $user->isBanned()) {
        http_response_code(403);
        echo json_encode(["error" => "Security Access Denied: User context is suspended or missing."]);
        exit();
    }

    $currentUserId = (int) $user->getId();
    $userProvince = method_exists($user, 'getProvince') ? $user->getProvince() : null;

    $categorySlug = trim($_POST['category_slug'] ?? '');
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $conditionGrade = trim($_POST['condition_grade'] ?? '');
    $priceCents = intval($_POST['price_cents'] ?? 0);
    $hardwareId = !empty($_POST['hardware_id']) ? intval($_POST['hardware_id']) : null;
    $acceptsOffers = isset($_POST['accepts_offers']) ? intval($_POST['accepts_offers']) : 1;
    $locationProvince = !empty($_POST['location_province']) ? trim($_POST['location_province']) : $userProvince;

    if (empty($categorySlug) || empty($title) || empty($description) || empty($conditionGrade) || $priceCents <= 0) {
        throw new Exception("Validation Error: Missing mandatory marketplace listing components.");
    }

    $allowedConditions = ['New', 'Like New', 'Good', 'Fair'];
    if (!in_array($conditionGrade, $allowedConditions)) {
        throw new Exception("Validation Error: Invalid condition grade format structural signature provided.");
    }

    $catStmt = $db->prepare("SELECT id FROM categories WHERE slug = ? OR name = ? LIMIT 1");
    $catStmt->execute([strtolower($categorySlug), $categorySlug]);
    $categoryRow = $catStmt->fetch(PDO::FETCH_ASSOC);

    if (!$categoryRow) {
        throw new Exception("Data Integrity Error: Category identifier tracking profile could not be matched.");
    }
    $categoryId = $categoryRow['id'];

    $db->beginTransaction();

    $sqlInsertListing = "INSERT INTO listings (
        seller_id, category_id, hardware_id, title, description, 
        condition_grade, price_cents, location_province, status, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE', NOW())";

    $stmtListing = $db->prepare($sqlInsertListing);
    $stmtListing->execute([
        $currentUserId,
        $categoryId,
        $hardwareId,
        $title,
        $description,
        $conditionGrade,
        $priceCents,
        $locationProvince
    ]);

    $newListingId = $db->lastInsertId();

    if (!empty($_POST['verified_specs'])) {
        $specsArray = json_decode($_POST['verified_specs'], true);
        if (is_array($specsArray)) {
            $sqlSpecs = "INSERT INTO listing_specs (listing_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)";
            $stmtSpecs = $db->prepare($sqlSpecs);

            foreach ($specsArray as $order => $specLine) {
                if (strpos($specLine, ':') !== false) {
                    list($key, $val) = explode(':', $specLine, 2);
                    $key = trim($key);
                    $val = trim($val);
                } else {
                    $key = "FEATURE";
                    $val = trim($specLine);
                }

                $stmtSpecs->execute([$newListingId, $key, $val, $order]);
            }
        }
    }

    if (!empty($_FILES['images'])) {
        $files = $_FILES['images'];
        $fileCount = count($files['name']);

        $uploadDir = uploadsDiskPath('listings');

        $sqlImages = "INSERT INTO listing_images (listing_id, url, sort_order, is_primary) VALUES (?, ?, ?, ?)";
        $stmtImg = $db->prepare($sqlImages);

        for ($i = 0; $i < $fileCount; $i++) {
            if ($files['error'][$i] === UPLOAD_ERR_OK) {

                $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

                if (!in_array($ext, $allowedExtensions)) {
                    throw new Exception("Security Error: Unsupported media asset file extension format [." . $ext . "] detected.");
                }

                $uniqueFilename = "listing_" . $newListingId . "_" . bin2hex(random_bytes(8)) . "." . $ext;
                $destinationPath = $uploadDir . $uniqueFilename;

                if (move_uploaded_file($files['tmp_name'][$i], $destinationPath)) {
                    $isPrimary = intval($_POST["image_meta_{$i}_is_primary"] ?? ($i === 0 ? 1 : 0));
                    $sortOrder = intval($_POST["image_meta_{$i}_sort_order"] ?? $i);
                    $publicUrl = 'uploads/listings/' . $uniqueFilename;

                    $stmtImg->execute([$newListingId, $publicUrl, $sortOrder, $isPrimary]);
                } else {
                    throw new Exception("Server Error: Local server storage pipeline relocation tracking failed.");
                }
            } elseif ($files['error'][$i] !== UPLOAD_ERR_NO_FILE) {
                throw new Exception("Upload Matrix Failure: System intercepted exceptions via execution code " . $files['error'][$i]);
            }
        }
    } else {
        throw new Exception("Validation Error: Market submission catalog files require at least one primary reference context snapshot.");
    }

    $db->commit();

    http_response_code(200);
    echo json_encode(["success" => true, "listing_id" => $newListingId]);
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
    echo json_encode(["error" => "Critical Server System Bootstrap Handshake Exception Encountered.", "debug" => $t->getMessage()]);
}
