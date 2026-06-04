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
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        throw new Exception("Method not allowed.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    // Initialize encryption engine handler conditionally
    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    // Verify requesting user session identity
    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Your session has expired. Please log in again.");
    }

    // Verify permission rights (Staff only: Moderators = 3, Admins = 4)
    $staffCheck = $db->prepare("SELECT role_id FROM users WHERE id = ? AND is_deleted = 0 LIMIT 1");
    $staffCheck->execute([intval($activeUserId)]);
    $staffRow = $staffCheck->fetch(PDO::FETCH_ASSOC);

    if (!$staffRow || !in_array((int)$staffRow['role_id'], [3, 4], true)) {
        http_response_code(403);
        throw new Exception("Access Denied. You do not have permission to view support messages.");
    }

    $query = "
        SELECT 
            sm.id,
            sm.user_id,
            sm.name AS form_name,
            sm.email AS form_email,
            sm.subject,
            sm.message,
            sm.contact_preference,
            sm.status,
            sm.assigned_to,
            sm.created_at,
            u.first_name AS registered_fn,
            u.last_name AS registered_ln,
            u.email AS registered_email,
            u.mobile AS registered_mobile
        FROM support_messages sm
        LEFT JOIN users u ON sm.user_id = u.id
        ORDER BY sm.created_at ASC
    ";

    $stmt = $db->query($query);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $processedMessages = [];
    foreach ($rows as $row) {
        $displayName = $row['form_name'];
        $contactDetails = $row['form_email'];

        if (!empty($row['user_id'])) {
            $firstName = $row['registered_fn'];
            $lastName = $row['registered_ln'];
            $mobileNumber = $row['registered_mobile'];

            if ($crypto) {
                if (!empty($firstName)) {
                    $firstName = $crypto->decrypt($firstName) ?? $firstName;
                }
                if (!empty($lastName)) {
                    $lastName = $crypto->decrypt($lastName) ?? $lastName;
                }
                if (!empty($mobileNumber)) {
                    $mobileNumber = $crypto->decrypt($mobileNumber) ?? $mobileNumber;
                }
            }

            $fullName = trim($firstName . ' ' . $lastName);
            if (!empty($fullName)) {
                $displayName = $fullName;
            }

            if (strcasecmp($row['contact_preference'], 'WhatsApp') === 0) {
                $contactDetails = !empty($mobileNumber) ? $mobileNumber : "No Phone Number Provided";
            } else {
                $contactDetails = !empty($row['registered_email']) ? $row['registered_email'] : $row['form_email'];
            }
        } else {
            if (strcasecmp($row['contact_preference'], 'WhatsApp') === 0) {
                $contactDetails = "Phone available via registered profiles only";
            }
        }

        $processedMessages[] = [
            "id" => intval($row['id']),
            "user_id" => $row['user_id'] ? intval($row['user_id']) : null,
            "name" => $displayName,
            "contact_info" => $contactDetails,
            "subject" => $row['subject'],
            "message" => $row['message'],
            "contact_preference" => $row['contact_preference'],
            "status" => $row['status'],
            "assigned_to" => $row['assigned_to'] ? intval($row['assigned_to']) : null,
            "created_at" => $row['created_at']
        ];
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "messages" => $processedMessages
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "An internal system error occurred processing account records."]);
}
