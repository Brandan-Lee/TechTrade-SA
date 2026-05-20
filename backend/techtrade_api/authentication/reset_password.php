<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../models/validation/database.php';
require_once __DIR__ . '/../config/config.php';

$db = Database::getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->otp) || empty($data->password)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "field" => "password",
        "message" => "INVALID DATA SYNC. SESSION REJECTED."
    ]);
    exit;
}

$email = trim($data->email);
$otp = trim($data->otp);
$password = $data->password;

$hasUppercase = preg_match("/[A-Z]/", $password);
$hasLowercase = preg_match("/[a-z]/", $password);
$hasNumber = preg_match("/[0-9]/", $password);
$hasSymbol = preg_match("/[^A-Za-z0-9]/", $password);
$validLength = strlen($password) >= 8;

if (!$validLength || !$hasUppercase || !$hasLowercase || !$hasNumber || !$hasSymbol) {
    http_response_code(422);
    echo json_encode([
        "status" => "error",
        "field" => "password",
        "message" => "PASSWORD INSUFFICIENT. ALL SECURITY CRITERIA MUST BE MET."
    ]);
    exit;
}

if (!isset($db)) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "field" => "password",
        "message" => "DATABASE LINK FAILURE: System instance not found."
    ]);
    exit;
}

$stmt = $db->prepare("SELECT * FROM otp_verifications 
                        WHERE email = ? 
                          AND purpose = 'reset' 
                          AND verified_at IS NULL 
                        ORDER BY created_at DESC LIMIT 1");
$stmt->execute([$email]);
$otpRecord = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$otpRecord || (time() > strtotime($otpRecord['expires_at'])) || !password_verify($otp, $otpRecord['code_hash'])) {
    http_response_code(403);
    echo json_encode([
        "status" => "error",
        "field" => "password",
        "message" => "TRANSACTION DENIED: Session signature invalid or expired."
    ]);
    exit;
}

$userStmt = $db->prepare("SELECT password_hash FROM users WHERE email = ?");
$userStmt->execute([$email]);
$currentUser = $userStmt->fetch(PDO::FETCH_ASSOC);

if ($currentUser && password_verify($password, $currentUser['password_hash'])) {
    http_response_code(422);
    echo json_encode([
        "status" => "error",
        "field" => "password",
        "message" => "New password cannot match your current password."
    ]);
    exit;
}

$secureHash = password_hash($password, PASSWORD_BCRYPT);

try {
    $db->beginTransaction();

    $updateUser = $db->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
    $updateUser->execute([$secureHash, $email]);

    $burnToken = $db->prepare("UPDATE otp_verifications SET verified_at = NOW() WHERE id = ?");
    $burnToken->execute([$otpRecord['id']]);

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "PASSWORD MODIFIED SUCCESSFULLY! REDIRECTING..."
    ]);

} catch (PDOException $e) {
    if ($db && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "field" => "password",
        "message" => "Could not save password change configurations.",
        "debug_error_details" => $e->getMessage()
    ]);
} catch (Exception $e) {
    if ($db && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "field" => "password",
        "message" => "GENERAL SYSTEM FAILURE: Processing aborted.",
        "debug_error_details" => $e->getMessage()
    ]);
}
?>