<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/otp_manager.php';
    require_once __DIR__ . '/../services/email_service.php';
    require_once __DIR__ . '/../models/authentication/user.php';
    require_once __DIR__ . '/../helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database engine connection dropped.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $email = isset($input['email']) ? trim(strtolower($input['email'])) : '';
    $otpCode = isset($input['otp']) ? trim($input['otp']) : '';
    $purpose = isset($input['purpose']) ? trim($input['purpose']) : 'login';
    $rememberMe = isset($input['rememberMe']) ? (bool) $input['rememberMe'] : false;

    if (empty($email) || empty($otpCode)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing authentication details."]);
        exit();
    }

    $otpManager = new OTPManager($db, new EmailService());

    if ($otpManager->verifyOTP($email, $purpose, $otpCode)) {

        $userModel = User::findByEmail($db, $email);

        if (!$userModel) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Profile link verification dropped."]);
            exit();
        }

        if ($userModel->isBanned()) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "This account has been banned."]);
            exit();
        }

        SessionManager::login($db, (int) $userModel->getId(), (int) $userModel->getRoleId());

        $userModel->updateLastLogin();

        if ($rememberMe) {
            $selector = bin2hex(random_bytes(8));  
            $validator = random_bytes(32);         
            $hashedValidator = hash('sha256', $validator);

            $duration = 30 * 24 * 60 * 60;
            $expiresAt = date('Y-m-d H:i:s', time() + $duration);

            $clearOld = $db->prepare("DELETE FROM user_tokens WHERE user_id = ?");
            $clearOld->execute([$userModel->getId()]);

            $insertToken = $db->prepare("INSERT INTO user_tokens (user_id, selector, hashed_validator, expires_at) VALUES (?, ?, ?, ?)");
            $insertToken->execute([$userModel->getId(), $selector, $hashedValidator, $expiresAt]);

            $cookieValue = $selector . ':' . bin2hex($validator);
            setcookie('remember_me', $cookieValue, [
                'expires' => time() + $duration,
                'path' => '/',
                'secure' => false,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
        }

        echo json_encode([
            "status" => "success",
            "message" => "Login verified.",
            "user" => [
                "id" => $userModel->getId(),
                "email" => $userModel->getEmail(),
                "fullName" => $userModel->getFullName(), 
                "regType" => $userModel->getRegType(),
                "roleId" => $userModel->getRoleId()
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired code."]);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal processing exception occurred during verification.",
        "debug" => $e->getMessage()
    ]);
}
?>