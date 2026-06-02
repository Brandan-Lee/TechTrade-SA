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
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("We are currently having trouble connecting. Please try again in a moment.");
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();
    if (!$activeUserId) {
        throw new Exception("Your session has expired. Please log in again to continue.");
    }

    $transactionId = intval($_POST['transaction_id'] ?? 0);
    $reason = trim($_POST['reason'] ?? '');
    $details = trim($_POST['details'] ?? '');

    if (!$transactionId || empty($reason) || empty($details)) {
        throw new Exception("Please make sure you have filled out all the details for your request.");
    }

    $db->beginTransaction();

    $sqlDispute = "INSERT INTO disputes (transaction_id, opened_by_id, reason_code, details, status) VALUES (?, ?, ?, ?, 'open')";
    $db->prepare($sqlDispute)->execute([$transactionId, $activeUserId, $reason, $details]);
    $disputeId = $db->lastInsertId();

    $db->prepare("UPDATE transactions SET status = 'disputed' WHERE id = ?")->execute([$transactionId]);

    $uploadDir = getUploadFolderPath('disputes');
    $sqlEvidence = "INSERT INTO dispute_evidence (dispute_id, file_url, file_name, sort_order) VALUES (?, ?, ?, ?)";
    $stmtEvidence = $db->prepare($sqlEvidence);

    $sortOrder = 0;
    foreach ($_FILES as $key => $file) {
        if ($file['error'] === UPLOAD_ERR_OK) {
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'webp'];

            if (!in_array($ext, $allowed)) continue;

            $filename = "dispute_{$disputeId}_" . bin2hex(random_bytes(6)) . "." . $ext;
            if (move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
                $stmtEvidence->execute([$disputeId, 'uploads/disputes/' . $filename, $file['name'], $sortOrder++]);
            }
        }
    }

    $db->commit();
    echo json_encode(["status" => "success", "dispute_id" => $disputeId]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
