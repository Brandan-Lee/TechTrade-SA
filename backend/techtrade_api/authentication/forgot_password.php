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
require_once __DIR__ . '/../models/services/email_service.php';

try {
    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $email = isset($input['email']) ? trim(strtolower($input['email'])) : '';

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
            "status" => "success",
            "message" => "If the email matches an account, a link has been sent to your inbox."
        ]);
        exit();
    }

    $isBanned = method_exists($user, 'isBanned') ? $user->isBanned() : false;
    $isSuspended = method_exists($user, 'isSuspended') ? $user->isSuspended() : false;

    if ($isBanned || $isSuspended) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "If the email matches an account, a link has been sent to your inbox."
        ]);
        exit();
    }

    $userEmail = method_exists($user, 'getEmail') ? $user->getEmail() : $email;
    $userId = method_exists($user, 'getId') ? $user->getId() : null;

    $mfaEnabled = method_exists($user, 'isMFAEnabled') ? $user->isMFAEnabled() : false;

    if (!$mfaEnabled) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "If the email matches an account, a link has been sent to your inbox."
        ]);
        exit();
    } else {
        $emailService = new EmailService();
        $otpManager = new OTPManager($db, $emailService);

        if ($otpManager->sendNewOTP($userEmail, 'reset', $userId)) {
            http_response_code(200);
            echo json_encode([
                "status" => "pending_otp",
                "message" => "Verification code sent to your email.",
                "debug_status" => "SUCCESS: sendNewOTP returned true."
            ]);
            exit();
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Failed to send verification code.",
                "debug_status" => "FAILURE: sendNewOTP returned false."
            ]);
            exit();
        }
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "An unexpected error occurred on the server.",
        "debug" => $e->getMessage()
    ]);
    exit();
}
