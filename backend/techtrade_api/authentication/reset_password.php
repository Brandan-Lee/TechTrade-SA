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
require_once __DIR__ . '/../models/services/email_service.php';

try {
    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $email = isset($input['email']) ? trim(strtolower($input['email'])) : '';
    $otpCode = isset($input['otp']) ? trim($input['otp']) : '';
    $newPassword = $input['password'] ?? '';

    if (empty($email) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }

    $user = User::findByEmail($db, $email);
    if (!$user) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Account not found."]);
        exit();
    }

    if ($user->isBanned() || $user->isSuspended()) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Access denied: This account is disabled."]);
        exit();
    }

    $mfaEnabled = method_exists($user, 'isMFAEnabled') ? $user->isMFAEnabled() : false;

    if ($mfaEnabled) {
        if (empty($otpCode)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "A security verification code is required."]);
            exit();
        }

        $emailService = new EmailService();
        $otpManager = new OTPManager($db, $emailService);

        if (!$otpManager->verifyOTP($email, $otpCode, 'reset')) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "The verification code is invalid or expired."]);
            exit();
        }
    }

    if ($user->updatePassword($newPassword)) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Your password has been changed successfully."
        ]);
        exit();
    } else {
        throw new Exception("Could not save your new password.");
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "An unexpected error occurred while resetting your password.",
        "debug" => $e->getMessage()
    ]);
    exit();
}
