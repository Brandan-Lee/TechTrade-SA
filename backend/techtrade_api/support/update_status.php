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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception("Method not allowed.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();

    if (!$activeUserId) {
        http_response_code(401);
        throw new Exception("Your session has expired. Please log in again.");
    }

    $staffCheck = $db->prepare("SELECT role_id, first_name, last_name FROM users WHERE id = ? AND is_deleted = 0 LIMIT 1");
    $staffCheck->execute([intval($activeUserId)]);
    $staffRow = $staffCheck->fetch(PDO::FETCH_ASSOC);

    if (!$staffRow || !in_array((int)$staffRow['role_id'], [3, 4], true)) {
        http_response_code(403);
        throw new Exception("Access Denied. You do not have permission to change this status.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    $staffFirstName = $staffRow['first_name'];
    $staffLastName = $staffRow['last_name'];

    if ($crypto) {
        if (!empty($staffFirstName)) {
            $staffFirstName = $crypto->decrypt($staffFirstName) ?? $staffFirstName;
        }
        if (!empty($staffLastName)) {
            $staffLastName = $crypto->decrypt($staffLastName) ?? $staffLastName;
        }
    }

    $staffFullName = trim($staffFirstName . ' ' . $staffLastName);
    if (empty($staffFullName)) {
        $staffFullName = "A support agent";
    }

    $inputData = json_decode(file_get_contents("php://input"), true);
    $ticketId = isset($inputData['ticket_id']) ? intval($inputData['ticket_id']) : null;
    $requestedStatus = isset($inputData['status']) ? trim($inputData['status']) : null;

    $allowedStatuses = ['in_progress', 'resolved', 'closed'];

    if (!$ticketId || !$requestedStatus || !in_array($requestedStatus, $allowedStatuses, true)) {
        http_response_code(400);
        throw new Exception("Invalid support information or status choice provided.");
    }

    $ticketQuery = $db->prepare("SELECT user_id, subject FROM support_messages WHERE id = ? LIMIT 1");
    $ticketQuery->execute([$ticketId]);
    $ticket = $ticketQuery->fetch(PDO::FETCH_ASSOC);

    if (!$ticket) {
        http_response_code(404);
        throw new Exception("The requested support ticket could not be found.");
    }

    $finalDatabaseStatus = $requestedStatus;
    if ($requestedStatus === 'resolved') {
        $finalDatabaseStatus = 'closed';
    }

    $db->beginTransaction();

    $updateStmt = $db->prepare("UPDATE support_messages SET status = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $updateStmt->execute([$finalDatabaseStatus, intval($activeUserId), $ticketId]);

    if (!empty($ticket['user_id'])) {
        $targetUserId = intval($ticket['user_id']);
        $subjectHeader = $ticket['subject'];

        $notifTitle = "";
        $notifBody = "";

        switch ($requestedStatus) {
            case 'in_progress':
                $notifTitle = "Support Ticket Update";
                $notifBody = "{$staffFullName} has started working on your request regarding: '{$subjectHeader}'. We will contact you shortly.";
                break;
            case 'resolved':
                $notifTitle = "Support Ticket Resolved";
                $notifBody = "Great news! Your support request regarding '{$subjectHeader}' has been marked as resolved by {$staffFullName}.";
                break;
            case 'closed':
                $notifTitle = "Support Ticket Closed";
                $notifBody = "Your support request for '{$subjectHeader}' has been closed and archived.";
                break;
        }

        $notifInsert = $db->prepare("
            INSERT INTO notifications (
                user_id, 
                type, 
                title, 
                body, 
                status, 
                is_read, 
                created_at, 
                updated_at
            ) VALUES (?, 'system', ?, ?, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ");

        $notifInsert->execute([
            $targetUserId,
            $notifTitle,
            $notifBody
        ]);
    }

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Ticket status successfully updated to '{$finalDatabaseStatus}'."
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "An internal system error occurred while updating the ticket."]);
}
