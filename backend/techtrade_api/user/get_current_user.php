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

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';

    if (!isset($_SESSION['user_id'])) {
        http_response_code(419);
        echo json_encode(["status" => "logged_out", "message" => "Your session has expired. Please log in again."]);
        exit;
    }

    $db = Database::getConnection();
    $userId = intval($_SESSION['user_id']);

    $crypto = defined('ENCRYPTION_KEY') ? new EncryptionEngine(ENCRYPTION_KEY) : null;

    $sql = "
        SELECT id, first_name, last_name, email, mobile, province, reg_type, avatar_url 
        FROM users 
        WHERE id = ? AND is_deleted = 0 
        LIMIT 1
    ";
    $stmt = $db->prepare($sql);
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        throw new Exception("We couldn't find your account information.");
    }

    if ($crypto) {
        $firstName = $crypto->decrypt($user['first_name']) ?: '';
        $lastName  = $crypto->decrypt($user['last_name']) ?: '';
        $mobile    = $crypto->decrypt($user['mobile']) ?: '';
    } else {
        $firstName = $user['first_name'];
        $lastName = $user['last_name'];
        $mobile = $user['mobile'];
    }

    echo json_encode(
        [
            "status" => "success",
            "user" => [
                "id" => (int)$user['id'],
                "first_name" => $firstName,
                "last_name" => $lastName,
                "email" => $user['email'],
                "mobile" => $mobile,
                "province" => $user['province'] ?? '',
                "reg_type" => $user['reg_type'],
                "avatar_url" => !empty($user['avatar_url']) ? getPublicMediaUrl($user['avatar_url']) : null
            ]
        ]
    );
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
