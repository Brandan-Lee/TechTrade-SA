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

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../models/validation/database.php';
require_once __DIR__ . '/../models/security/otp_manager.php';

$db = Database::getConnection();
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$otpCode = $input['otp'] ?? '';

$otpManager = new OTPManager($db, new EmailService());

if ($otpManager->verifyOTP($email, 'login', $otpCode)) {
    session_start();
    $user = User::findByEmail($db, $email);
    $_SESSION['user_id'] = $user->getId();
    $user->updateLastLogin();
    
    echo json_encode(["status" => "success", "message" => "Login verified."]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid or expired code."]);
}


?>