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
        throw new Exception("This action is not supported.");
    }

    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../models/validation/database.php';
    require_once __DIR__ . '/../models/security/encryption_engine.php';
    require_once __DIR__ . '/../models/helpers/session_manager.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    $crypto = null;
    if (defined('ENCRYPTION_KEY')) {
        $crypto = new EncryptionEngine(ENCRYPTION_KEY);
    }

    SessionManager::init($db);
    $activeUserId = SessionManager::getActiveUserId();
    $userIdValue = $activeUserId ? intval($activeUserId) : null;

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        throw new Exception("We couldn't read your request. Please check your submission and try again.");
    }

    $firstName = isset($data['firstName']) ? trim($data['firstName']) : '';
    $lastName = isset($data['lastName']) ? trim($data['lastName']) : '';
    $inquiryType = isset($data['inquiryType']) ? trim($data['inquiryType']) : '';
    $messageText = isset($data['message']) ? trim($data['message']) : '';
    $contactPreference = isset($data['contactPreference']) ? trim($data['contactPreference']) : 'Email';

    $fullName = trim($firstName . ' ' . $lastName);
    $userEmail = "anonymous-support@techtradesa.co.za";

    if ($userIdValue) {
        $sqlUser = "SELECT email FROM users WHERE id = ? LIMIT 1";
        $stmtUser = $db->prepare($sqlUser);
        $stmtUser->execute([$userIdValue]);
        $userRow = $stmtUser->fetch();
        if ($userRow) {
            $userEmail = $userRow['email'];
        }
    }

    if (empty($fullName)) {
        throw new Exception("Please provide your first and last name.");
    }
    if (empty($inquiryType)) {
        throw new Exception("Please select a reason for contacting us.");
    }
    if (empty($messageText)) {
        throw new Exception("Please type a message explaining how we can help you.");
    }

    if (!in_array($contactPreference, ['Email', 'WhatsApp'])) {
        $contactPreference = 'Email';
    }

    $finalName = $fullName;
    if ($crypto) {
        $finalName = $crypto->encrypt($fullName) ?? $fullName;
    }

    $subjectMapping = [
        "marketplace" => "Marketplace Support",
        "escrow"      => "Escrow & Payment Assistance",
        "technical"   => "Technical Help",
        "general"     => "General Question",
        "feedback"    => "Feedback & Suggestions"
    ];

    $resolvedSubject = isset($subjectMapping[$inquiryType]) ? $subjectMapping[$inquiryType] : "General Inquiry";

    $db->beginTransaction();

    $sqlInsertMessage = "
        INSERT INTO support_messages (user_id, name, email, subject, message, contact_preference, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'new', NOW(), NOW())
    ";

    $stmtInsert = $db->prepare($sqlInsertMessage);
    $stmtInsert->execute([
        $userIdValue,
        $finalName,
        filter_var($userEmail, FILTER_SANITIZE_EMAIL),
        htmlspecialchars($resolvedSubject, ENT_QUOTES, 'UTF-8'),
        htmlspecialchars($messageText, ENT_QUOTES, 'UTF-8'),
        $contactPreference
    ]);

    $db->commit();

    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Your message has been sent successfully! Our team will get back to you within 24 hours."
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error" => "An unexpected error occurred while sending your message.",
        "debug" => $t->getMessage()
    ]);
}
