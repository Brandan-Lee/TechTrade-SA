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
require_once __DIR__ . '/../models/security/otp_manager.php';
require_once __DIR__ . '/../models/services/email_service.php';

$db = Database::getConnection();

$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';
$otpCode = isset($input['otp']) ? trim($input['otp']) : '';

if (empty($email) || empty($otpCode)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email and verification code are required."]);
    exit();
}

$stmt = $db->prepare("SELECT * FROM otp_verifications 
                        WHERE email = ? 
                          AND purpose = 'reset' 
                          AND verified_at IS NULL 
                        ORDER BY created_at DESC LIMIT 1");
$stmt->execute([$email]);
$otpRecord = $stmt->fetch(PDO::FETCH_ASSOC);

if ($otpRecord) {
    $isExpired = (time() > strtotime($otpRecord['expires_at']));

    if (!$isExpired && password_verify($otpCode, $otpRecord['code_hash'])) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Code verified successfully. You can now choose a new password.",
            "email" => $email,
            "otp" => $otpCode
        ]);
        exit();
    }
}

http_response_code(401);
echo json_encode([
    "status" => "error",
    "message" => "The verification code is invalid or has expired."
]);
