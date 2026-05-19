<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/validation/database.php';        
require_once __DIR__ . '/../models/authentication/avatar_uploader.php';
require_once __DIR__ . '/../models/security/encryption_engine.php';
require_once __DIR__ . '/../models/validation/user_validator.php';
require_once __DIR__ . '/../models/validation/hardware_checker.php';

$db = Database::getConnection();

$inputData = [
    'firstName' => $_POST['firstName'] ?? '',
    'lastName' => $_POST['lastName'] ?? '',
    'email' => $_POST['email'] ?? '',
    'password' => $_POST['password'] ?? '',
    'mobile' => $_POST['mobile'] ?? '',
    'province' => $_POST['province'] ?? '',
    'regType' => $_POST['regType'] ?? 'buyer',
    'hardwareId' => $_POST['hardwareId'] ?? ''
];

$validator = new UserValidator($db);

if (!$validator->validate($inputData)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => implode(" ", $validator->getErrors())
    ]);
    exit();
}

$hardwareChecker = new HardwareChecker($db);

if ($hardwareChecker->isBanned($inputData['hardwareId'])) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "REG_EXCEPTION: Device registration access blocked."]);
    exit();
}

$avatarUrl = null;
if (isset($_FILES['profilePhoto']) && $_FILES['profilePhoto']['error'] === UPLOAD_ERR_OK) {
    try {
        $uploader = new AvatarUploader('../uploads/avatars/');
        $avatarUrl = $uploader->upload($_FILES['profilePhoto']);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        exit();
    }
}

$crypto = new EncryptionEngine(ENCRYPTION_KEY);

$encryptedFirstName = $crypto->encrypt($inputData['firstName']);
$encryptedLastName = $crypto->encrypt($inputData['lastName']);
$encryptedMobile = $crypto->encrypt($inputData['mobile']);

$passwordHash = password_hash($inputData['password'], PASSWORD_BCRYPT);

try {
    $sql = 'INSERT INTO users (
                first_name, 
                last_name, 
                email, 
                password_hash, 
                mobile, 
                hardware_id, 
                province, 
                avatar_url, 
                reg_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    $stmt = $db->prepare($sql);

    $stmt->execute([
        $encryptedFirstName,
        $encryptedLastName,
        $inputData['email'],
        $passwordHash,
        $encryptedMobile,
        !empty($inputData['hardwareId']) ? $inputData['hardwareId'] : null,
        $inputData['province'],
        $avatarUrl,
        $inputData['regType']
    ]);

    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "Registration completed successfully."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Internal processing error: " . $e->getMessage()]);
}
?>