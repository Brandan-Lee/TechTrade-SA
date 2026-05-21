<?php
ini_set('display_errors', 0); 
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true"); 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . '/../../config/config.php';
    require_once __DIR__ . '/../../models//validation/database.php';
    require_once __DIR__ . '/../../helpers/session_manager.php'; 
    require_once __DIR__ . '/../../models/authentication/user.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database connection channel could not be established.");
    }

    SessionManager::init($db);

    if (isset($_SESSION['user_id'])) {
        $user = User::findById($db, $_SESSION['user_id']);

        if ($user && !$user->isBanned() ) {
            $roleId = (int)$user->getRoleId();

            if (in_array($roleId, [1, 2, 5], true)) {
                echo json_encode([
                    "status" => "authenticated",
                    "user" => [
                        "id" => $user->getId(),
                        "email" => $user->getEmail(),
                        "fullName" => $user->getFullName(),
                        "regType" => $user->getRegType(),
                        "roleId" => $roleId,
                        "location_province" => $user->getProvince() 
                    ]
                ]);
                exit;
            }
        }
    }

    echo json_encode(["status" => "guest", "user" => null]);
    exit();

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal Server Error during session bootstrapping handshake.",
        "debug" => $e->getMessage()
    ]);
    exit();
}
?>