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
require_once __DIR__ . '/../models/helpers/session_manager.php';

try {
    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);

    $input = json_decode(file_get_contents('php://input'), true);

    $email = isset($input['email']) ? trim(strtolower($input['email'])) : '';
    $password = $input['password'] ?? '';
    $rememberMe = isset($input['rememberMe']) ? (bool) $input['rememberMe'] : false;

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Email and password are required."]);
        exit();
    }

    $user = User::findByEmail($db, $email);

    if (!$user) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Incorrect email or password."]);
        exit();
    }

    if ($user && $user->verifyPassword($password)) {
        if ($user->isBanned()) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Access denied: Account is permanently banned."]);
            exit();
        }

        if ($user->isSuspended()) {
            http_response_code(403);
            echo json_encode([
                "status" => "error",
                "message" => "Account is suspended until " . $user->getSuspendedUntil() . ". Reason: " . $user->getSuspendedReason()
            ]);
            exit();
        }

        SessionManager::login($db, (int) $user->getId(), (int) $user->getRoleId());
        $user->updateLastLogin();

        if ($rememberMe) {
            $selector = bin2hex(random_bytes(8));
            $validator = random_bytes(32);
            $hashedValidator = hash('sha256', $validator);

            $duration = 30 * 24 * 60 * 60;
            $expiresAt = date('Y-m-d H:i:s', time() + $duration);

            $clearOld = $db->prepare("DELETE FROM user_tokens WHERE user_id = ?");
            $clearOld->execute([$user->getId()]);

            $insertToken = $db->prepare("INSERT INTO user_tokens (user_id, selector, hashed_validator, expires_at) VALUES (?, ?, ?, ?)");
            $insertToken->execute([$user->getId(), $selector, $hashedValidator, $expiresAt]);

            $cookieValue = $selector . ':' . bin2hex($validator);
            setcookie('remember_me', $cookieValue, [
                'expires' => time() + $duration,
                'path' => '/',
                'secure' => false,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
        }

        if (!$user->isMFAEnabled()) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Login successful.",
                "user" => [
                    "id" => $user->getId(),
                    "email" => $user->getEmail(),
                    "fullName" => $user->getFullName(),
                    "regType" => $user->getRegType(),
                    "roleId" => $user->getRoleId(),
                    "isMFA" => $user->isMFAEnabled()
                ],
                "rememberMe" => $rememberMe
            ]);
            exit();
        } else {
            error_log("Security: Generating verification code for user ID: " . $user->getId());
            $emailService = new EmailService();
            $otpManager = new OTPManager($db, $emailService);

            if ($otpManager->sendNewOTP($user->getEmail(), 'login', $user->getId())) {
                http_response_code(200);
                echo json_encode([
                    "status" => "pending_otp",
                    "message" => "Verification code sent to your email.",
                    "rememberMe" => $rememberMe,
                    "debug_status" => "SUCCESS: Verification email sent."
                ]);
                exit();
            } else {
                http_response_code(500);
                echo json_encode([
                    "status" => "error",
                    "message" => "Failed to send verification code.",
                    "debug_status" => "FAILURE: Check mail server connection."
                ]);
                exit();
            }
        }
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Incorrect email or password."]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "An unexpected error occurred while checking your login details.",
        "debug" => $e->getMessage()
    ]);
    exit();
}
