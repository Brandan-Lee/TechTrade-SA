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
    exit(0);
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/authentication/avatar_uploader.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';

    // Ensure the user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(419);
        echo json_encode(["message" => "Your session has expired. Please log in again."]);
        exit;
    }

    $db = Database::getConnection();
    $userId = intval($_SESSION['user_id']);

    $firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
    $lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $mobile = isset($_POST['mobile']) ? trim($_POST['mobile']) : '';
    $province = isset($_POST['province']) ? trim($_POST['province']) : '';
    $regType = isset($_POST['regType']) ? trim($_POST['regType']) : 'buyer';

    // Verify that all profile details are provided
    if (empty($firstName)) throw new Exception(json_encode(["field" => "firstName", "message" => "Please enter your first name."]));
    if (empty($lastName)) throw new Exception(json_encode(["field" => "lastName", "message" => "Please enter your last name."]));
    if (empty($email)) throw new Exception(json_encode(["field" => "email", "message" => "Please enter your email address."]));
    if (empty($mobile)) throw new Exception(json_encode(["field" => "mobile", "message" => "Please enter your mobile number."]));
    if (empty($province)) throw new Exception(json_encode(["field" => "province", "message" => "Please select your province."]));

    $accountTypeMap = [
        'buyer' => 1,
        'seller' => 2,
        'both' => 5
    ];

    $roleId = isset($accountTypeMap[$regType]) ? $accountTypeMap[$regType] : 1;

    $checkSql = "SELECT id FROM users WHERE email = ? AND id != ? AND is_deleted = 0 LIMIT 1";
    $checkStmt = $db->prepare($checkSql);
    $checkStmt->execute([$email, $userId]);
    if ($checkStmt->fetch()) {
        throw new Exception(json_encode(["field" => "email", "message" => "This email is already in use by another account."]));
    }

    $crypto = defined('ENCRYPTION_KEY') ? new EncryptionEngine(ENCRYPTION_KEY) : null;
    if ($crypto) {
        $encFirstName = $crypto->encrypt($firstName);
        $encLastName = $crypto->encrypt($lastName);
        $encMobile = $crypto->encrypt($mobile);
    } else {
        $encFirstName = $firstName;
        $encLastName = $lastName;
        $encMobile = $mobile;
    }

    $avatarPath = null;
    if (isset($_FILES['profilePhoto'])) {
        try {
            $uploader = new AvatarUploader();
            $avatarPath = $uploader->upload($_FILES['profilePhoto']);
        } catch (Throwable $t) {
            throw new Exception(json_encode(["field" => "profilePhoto", "message" => $t->getMessage()]));
        }
    }

    if ($avatarPath) {
        $sql = "UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, province = ?, reg_type = ?, role_id = ?, avatar_url = ? WHERE id = ?";
        $params = [$encFirstName, $encLastName, $email, $encMobile, $province, $regType, $roleId, $avatarPath, $userId];
    } else {
        $sql = "UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, province = ?, reg_type = ?, role_id = ? WHERE id = ?";
        $params = [$encFirstName, $encLastName, $email, $encMobile, $province, $regType, $roleId, $userId];
    }

    $db->prepare($sql)->execute($params);

    echo json_encode(["status" => "success", "message" => "Your profile has been updated successfully."]);
} catch (Exception $e) {
    http_response_code(400);
    $msg = $e->getMessage();
    if (json_decode($msg) !== null) {
        echo $msg;
    } else {
        echo json_encode(["field" => "serverError", "message" => $msg]);
    }
}
