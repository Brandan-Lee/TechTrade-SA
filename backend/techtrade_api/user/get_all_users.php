<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();
    if (!$activeUserId) {
        throw new Exception("Your session has expired. Please log in again to continue.");
    }

    $crypto = defined('ENCRYPTION_KEY') ? new EncryptionEngine(ENCRYPTION_KEY) : null;

    $sqlAllUsers = "
        SELECT 
            id, role_id, first_name, last_name, province, 
            reg_type, trust_score, trade_count, strike_count 
        FROM users 
        WHERE is_deleted = 0 
        ORDER BY id DESC
    ";

    $stmt = $db->prepare($sqlAllUsers);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $transformedUsers = array_map(function ($row) use ($crypto) {
        if ($crypto) {
            $firstName = $crypto->decrypt($row['first_name']) ?? '';
            $lastName = $crypto->decrypt($row['last_name']) ?? '';
        } else {
            $firstName = $row['first_name'];
            $lastName = $row['last_name'];
        }

        return [
            "id" => (int) $row['id'],
            "roleId" => (int) $row['role_id'],
            "firstName" => $firstName ?: "Community",
            "lastName" => $lastName ?: "Member",
            "province" => $row['province'] ?? 'Unknown',
            "regType" => $row['reg_type'],
            "trustScore" => number_format((float) $row['trust_score'], 1, '.', ''),
            "tradeCount" => (int) $row['trade_count'],
            "strikeCount" => (int) $row['strike_count']
        ];
    }, $rows);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "users" => $transformedUsers
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong while loading the user list. Please try again later."]);
}
