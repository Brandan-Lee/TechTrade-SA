<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/validation/database.php';
require_once __DIR__ . '/../helpers/session_manager.php';

try {
    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database connection could not be established.");
    }

    SessionManager::init($db);

    if (isset($_COOKIE['remember_me'])) {
        $parts = explode(':', $_COOKIE['remember_me']);
        if (!empty($parts[0])) {
            $stmt = $db->prepare("DELETE FROM user_tokens WHERE selector = ?");
            $stmt->execute([$parts[0]]);
        }

        setcookie('remember_me', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    $_SESSION = [];
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    echo json_encode(["status" => "success", "message" => "Session terminated."]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Logout failed.",
        "debug" => $e->getMessage(),
    ]);
}
