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

try {
    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database engine connection node context dropped.");
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $email = isset($input['email']) ? trim(strtolower($input['email'])) : '';
    $otpCode = isset($input['otp']) ? trim($input['otp']) : '';
    $newPassword = $input['password'] ?? '';

    if (empty($email) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required parameter payloads."]);
        exit();
    }

    $user = User::findByEmail($db, $email);
    if (!$user) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Target profile node not found."]);
        exit();
    }

    // Check account lockdown rules
    if ($user->isBanned() || $user->isSuspended()) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Access denied: Account state restricted."]);
        exit();
    }

    // Dynamic Evaluation based on User's MFA configuration
    $mfaEnabled = method_exists($user, 'isMFAEnabled') ? $user->isMFAEnabled() : false;

    if ($mfaEnabled) {
        // Track A: User has MFA active -> Explicitly validate OTP token match
        if (empty($otpCode)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Security verification code is required for this node."]);
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
            "message" => "Security credentials updated successfully."
        ]);
        exit();
    } else {
        throw new Exception("Failed to commit new password payload into the storage database ledger.");
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal processing exception caught during credentials reset execution.",
        "debug" => $e->getMessage()
    ]);
    exit();
}
