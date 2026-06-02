<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
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

    $listingId = isset($_GET['id']) ? intval($_GET['id']) : intval($_POST['listing_id'] ?? 0);

    if ($listingId <= 0) {
        throw new Exception("Please specify a valid item to delete.");
    }

    $currentUserId = (int) $user->getId();

    $stmt = $db->prepare("
        SELECT id, seller_id, is_deleted
        FROM listings
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$listingId]);
    $listing = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$listing) {
        http_response_code(404);
        echo json_encode(["error" => "This listing could not be found."]);
        exit();
    }

    if ((int) $listing['seller_id'] !== $currentUserId) {
        http_response_code(403);
        echo json_encode(["error" => "You do not have permission to delete this listing."]);
        exit();
    }

    if ((int) $listing['is_deleted'] === 1) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "This item has already been removed."]);
        exit();
    }

    $update = $db->prepare("
        UPDATE listings
        SET is_deleted = 1, deleted_at = NOW()
        WHERE id = ? AND seller_id = ?
    ");
    $update->execute([$listingId, $currentUserId]);

    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Your listing has been successfully removed."]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "An unexpected error occurred on the server.", "debug" => $t->getMessage()]);
}
