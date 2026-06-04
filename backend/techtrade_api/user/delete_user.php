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

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(419);
        echo json_encode(["status" => "error", "message" => "Session expired. Please log in again."]);
        exit;
    }

    $db = Database::getConnection();
    $userId = intval($_SESSION['user_id']);

    $db->beginTransaction();

    $userSql = "
        UPDATE users 
        SET is_deleted = 1, 
            deleted_at = CURRENT_TIMESTAMP,
            email = CONCAT(email, '.deleted.', UNIX_TIMESTAMP()) 
        WHERE id = ? AND is_deleted = 0
    ";

    $userStmt = $db->prepare($userSql);
    $userStmt->execute([$userId]);

    if ($userStmt->rowCount() === 0) {
        throw new Exception("Account could not be found or has already been closed.");
    }

    $listingsSql = "UPDATE listings SET is_deleted = 1 WHERE seller_id = ?";
    $listingsStmt = $db->prepare($listingsSql);
    $listingsStmt->execute([$userId]);

    $db->commit();
    $_SESSION = array();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();

    echo json_encode([
        "status" => "success",
        "message" => "Your account profile has been successfully closed"
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
