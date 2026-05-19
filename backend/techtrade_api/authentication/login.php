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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/validation/database.php';
require_once __DIR__ . '/../models/authentication/user.php';

$db = Database::getConnection();

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

$user = User::findByEmail($db, $email);

if ($user && $user->verifyPassword($password)) {

    // Check for Permanent Ban
    if ($user->isBanned()) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Access denied: Account is permanently banned."]);
        exit;
    }

    // Check for Temporary Suspension
    if ($user->isSuspended()) {
        http_response_code(403);
        echo json_encode([
            "status" => "error",
            "message" => "Account is suspended until " . $user->getSuspendedUntil() . ". Reason: " . $user->getSuspendedReason()
        ]);
        exit;
    }

    // Start secure session
    if (session_status() === PHP_SESSION_NONE) {
        session_start([
            'cookie_httponly' => true,
            'cookie_secure' => false, // Set to true if using HTTPS
            'cookie_samesite' => 'Strict'
        ]);
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = $user->getId();

    // Upate last login
    $user->updateLastLogin();

    // 6. Handle "Remember Me"
    if (!empty($input['rememberMe'])) {
        $selector = bin2hex(random_bytes(16));
        $validator = random_bytes(32);
        $hashedValidator = hash('sha256', $validator);
        $expires = date('Y-m-d H:i:s', strtotime('+30 days'));

        $stmt = $db->prepare("INSERT INTO user_tokens (user_id, selector, hashed_validator, expires_at) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user->getId(), $selector, $hashedValidator, $expires]);

        setcookie('remember_me', $selector . ':' . bin2hex($validator), [
            'expires' => strtotime($expires),
            'path' => '/',
            'secure' => false,      // Set to true if using HTTPS
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
    }

    echo json_encode(["status" => "success", "message" => "Authentication successful."]);

} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid credentials."]);
}
?>