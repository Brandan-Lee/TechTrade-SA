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
require_once __DIR__ . '/../models/authentication/user.php';
require_once __DIR__ . '/../models/security/otp_manager.php';
require_once __DIR__ . '/../services/email_service.php';

$db = Database::getConnection();
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';
$purpose = isset($input['purpose']) ? trim($input['purpose']) : 'login';

if (empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email identifier is required."]);
    exit();
}

$user = User::findByEmail($db, $email);

if (!$user) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "A fresh code has been sent if the account exists."]);
    exit();
}

if ($user->isBanned() || $user->isSuspended()) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Account status restricts code authorization."]);
    exit();
}

$emailService = new EmailService();
$otpManager = new OTPManager($db, $emailService);

if ($otpManager->sendNewOTP($user->getEmail(), $purpose, $user->getId())) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "A fresh verification code has been transmitted."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to re-transmit verification code."]);
}
?>