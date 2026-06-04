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

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    $crypto = defined('ENCRYPTION_KEY') ? new EncryptionEngine(ENCRYPTION_KEY) : null;

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception("Unsupported request method.");
    }

    $sql = "
        SELECT 
            p.id AS payment_id,
            p.m_payment_id,
            p.amount_cents,
            p.currency,
            p.status AS payment_status,
            p.created_at AS payment_date,
            t.id AS transaction_id,
            t.public_id AS tx_public_id,
            t.status AS tx_status,
            t.escrow_step,
            u.first_name AS payer_first,
            u.last_name AS payer_last
        FROM payments p
        INNER JOIN transactions t ON p.transaction_id = t.id
        INNER JOIN users u ON p.payer_id = u.id
        WHERE t.status = 'completed' AND t.escrow_released = 0
        ORDER BY p.created_at DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $vaultItems = array_map(function ($row) use ($crypto) {
        if ($crypto) {
            $firstName = $crypto->decrypt($row['payer_first']) ?? '';
            $lastName = $crypto->decrypt($row['payer_last']) ?? '';
        } else {
            $firstName = $row['payer_first'];
            $lastName = $row['payer_last'];
        }

        return [
            "id" => (int)$row['payment_id'],
            "mPaymentId" => $row['m_payment_id'],
            "amount" => (float)($row['amount_cents'] / 100),
            "currency" => $row['currency'],
            "paymentStatus" => $row['payment_status'],
            "date" => $row['payment_date'],
            "transaction" => [
                "id" => (int)$row['transaction_id'],
                "publicId" => $row['tx_public_id'],
                "status" => $row['tx_status'],
                "escrowStep" => (int)$row['escrow_step']
            ],
            "payer" => [
                "name" => trim("$firstName $lastName") ?: "Anonymous User"
            ]
        ];
    }, $rows);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "vault" => $vaultItems
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred while inspecting the escrow vault database files."]);
}
