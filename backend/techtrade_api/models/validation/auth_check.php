<?php
// 🚀 1. Prevent raw HTML error screens from breaking React. Force errors to text streams instead.
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
    // 🚀 2. Load Core Dependencies
    require_once __DIR__ . '/../../config/config.php';
    require_once __DIR__ . '/../../models//validation/database.php';
    require_once __DIR__ . '/../../helpers/session_manager.php'; 
    require_once __DIR__ . '/../../models/authentication/user.php';

    // 🚀 3. Establish DB Connection FIRST before calling SessionManager
    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Database connection channel could not be established.");
    }

    // 🚀 4. Init Session Framework Engine
    SessionManager::init($db);

    // 🚀 5. Evaluate active Session Data Blocks
    if (isset($_SESSION['user_id'])) {
        $user = User::findById($db, $_SESSION['user_id']);

        if ($user && !$user->isBanned()) {
            $roleId = (int)$user->getRoleId();

            // Only allow Buyers (1) or Sellers (2)
            if (in_array($roleId, [1, 2])) {
                echo json_encode([
                    "status" => "authenticated",
                    "user" => [
                        "id" => $user->getId(),
                        "email" => $user->getEmail(),
                        "fullName" => $user->getFullName(),
                        "regType" => $user->getRegType(),
                        "roleId" => $roleId
                    ]
                ]);
                exit;
            }
        }
    }

    // Fallback path if matching session state metrics indicate user is a Guest
    echo json_encode(["status" => "guest", "user" => null]);
    exit();

} catch (Throwable $e) {
    // 🚀 6. Catch any internal server engine crash anomalies and return clean JSON instead of raw HTML errors
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal Server Error during session bootstrapping handshake.",
        "debug" => $e->getMessage() // This will print what column name or file target exactly broke inside console payload array data
    ]);
    exit();
}
?>