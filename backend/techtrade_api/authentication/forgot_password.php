<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/validation/database.php';
require_once __DIR__ . '/../models/authentication/user.php';
require_once __DIR__ . '/../models/security/otp_manager.php';
require_once __DIR__ . '/../services/email_service.php';

$db = Database::getConnection();
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';

if (empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email address is required."]);
    exit();
}

$user = User::findByEmail($db, $email);

if (!$user) {
    password_verify("dummy_password", '$2y$10$abcdefghijklmnopqrstuv');
    http_response_code(200);
    echo json_encode([
        "status" => "process_initiated",
        "message" => "If the profile node exists, an authentication token link has been dispatched."
    ]);
    exit();
}

$isBanned = method_exists($user, 'isBanned') ? $user->isBanned() : false;
$isSuspended = method_exists($user, 'isSuspended') ? $user->isSuspended() : false;

if ($isBanned || $isSuspended) {
    http_response_code(200);
    echo json_encode([
        "status" => "process_initiated",
        "message" => "If the profile node exists, an authentication token link has been dispatched."
    ]);
    exit();
}

$emailService = new EmailService();
$otpManager = new OTPManager($db, $emailService);

$userEmail = method_exists($user, 'getEmail') ? $user->getEmail() : $email;
$userId = method_exists($user, 'getId') ? $user->getId() : null;

if ($otpManager->sendNewOTP($userEmail, 'reset', $userId)) {
    http_response_code(200);
    echo json_encode([
        "status" => "process_initiated",
        "message" => "If the profile node exists, an authentication token link has been dispatched."
    ]);
} else {
    http_response_code(200);
    echo json_encode([
        "status" => "process_initiated",
        "message" => "If the profile node exists, an authentication token link has been dispatched."
    ]);
}
exit();
?>