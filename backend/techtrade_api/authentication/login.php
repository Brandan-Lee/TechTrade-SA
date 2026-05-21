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

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$rememberMe = isset($input['rememberMe']) ? (bool) $input['rememberMe'] : false;

$user = User::findByEmail($db, $email);

if ($user && $user->verifyPassword($password)) {

    if ($user->isBanned()) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Access denied: Account is permanently banned."]);
        exit;
    }

    if ($user->isSuspended()) {
        http_response_code(403);
        echo json_encode([
            "status" => "error",
            "message" => "Account is suspended until " . $user->getSuspendedUntil() . ". Reason: " . $user->getSuspendedReason()
        ]);
        exit;
    }

    $emailService = new EmailService();
    $otpManager = new OTPManager($db, $emailService);

    if ($otpManager->sendNewOTP($user->getEmail(), 'login', $user->getId())) {
        http_response_code(200);
        echo json_encode([
            "status" => "pending_otp",
            "message" => "Verification code sent to your email.",
            "rememberMe" => $rememberMe
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send verification code."]);
    }

} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid credentials."]);
}
?>