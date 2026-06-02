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

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Unsupported request method.");
    }

    $inputData = json_decode(file_get_contents("php://input"), true);

    $targetUserId = isset($inputData['user_id']) ? (int) $inputData['user_id'] : 0;
    $requestedRoleId = isset($inputData['new_role_id']) ? (int) $inputData['new_role_id'] : 0;
    $executingAdminId = isset($inputData['admin_user_id']) ? (int) $inputData['admin_user_id'] : 0;

    $currentRegType = isset($inputData['reg_type']) ? trim($inputData['reg_type']) : 'both';

    if ($targetUserId <= 0 || $requestedRoleId <= 0 || $executingAdminId <= 0) {
        throw new Exception("Missing or invalid user profile details.");
    }

    if (!in_array($requestedRoleId, [1, 3, 4], true)) {
        throw new Exception("This action is only authorized for managing system roles.");
    }

    $sqlAdminCheck = "SELECT role_id FROM users WHERE id = ? AND is_deleted = 0 AND is_suspended = 0 AND is_banned = 0 LIMIT 1";
    $stmtAdmin = $db->prepare($sqlAdminCheck);
    $stmtAdmin->execute([$executingAdminId]);
    $adminRow = $stmtAdmin->fetch(PDO::FETCH_ASSOC);

    if (!$adminRow || (int)$adminRow['role_id'] !== 4) {
        http_response_code(403);
        echo json_encode(["error" => "Access Denied. You do not have permission to manage roles."]);
        exit();
    }

    if ($targetUserId === $executingAdminId && $requestedRoleId !== 4) {
        throw new Exception("You cannot remove your own administrator permissions.");
    }

    if ($requestedRoleId === 4) {
        $newRegType = 'admin';
    } elseif ($requestedRoleId === 3) {
        $newRegType = 'moderator';
    } else {
        if (!in_array($currentRegType, ['buyer', 'seller', 'both'], true)) {
            $newRegType = 'both';
        } else {
            $newRegType = $currentRegType;
        }
    }

    $sqlUpdateRole = "UPDATE users SET role_id = ?, reg_type = ? WHERE id = ? AND is_deleted = 0";
    $stmtUpdate = $db->prepare($sqlUpdateRole);
    $stmtUpdate->execute([$requestedRoleId, $newRegType, $targetUserId]);

    if ($stmtUpdate->rowCount() === 0) {
        throw new Exception("No modifications were made. The user might already have this role assigned.");
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "User role and account configuration properties updated successfully."
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong while managing user access settings. Please try again later."]);
}
