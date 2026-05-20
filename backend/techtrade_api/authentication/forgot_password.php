<?php
// Clear any active output buffers to avoid leaking corrupted text streams
if (ob_get_level()) ob_end_clean();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Global Exception Handler to capture fatal crashes and prevent "Failed to fetch"
set_exception_handler(function($e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal Gateway Engine Crash.",
        "exception_details" => $e->getMessage()
    ]);
    exit();
});

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
    // Security Best Practice: Fake a success message if email doesn't exist
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "If the profile node exists, a reset code has been transmitted."
    ]);
    exit();
}

// Defensive Checks: Ensure methods exist on your User model instance before running them
$isBanned = method_exists($user, 'isBanned') ? $user->isBanned() : false;
$isSuspended = method_exists($user, 'isSuspended') ? $user->isSuspended() : false;

if ($isBanned || $isSuspended) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Account restriction parameters active."]);
    exit();
}

$emailService = new EmailService();
$otpManager = new OTPManager($db, $emailService);

// Capture method parameters dynamically 
$userEmail = method_exists($user, 'getEmail') ? $user->getEmail() : $email;
$userId = method_exists($user, 'getId') ? $user->getId() : null;

if ($otpManager->sendNewOTP($userEmail, 'reset', $userId)) {
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "If the profile node exists, a reset code has been transmitted."
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to transmit secure code allocation."]);
}
exit();
?>