<?php
// 1. Initial Handshake: Acknowledge PayFast quickly
header('HTTP/1.0 200 OK');
flush();

// Ensure path to config is correct
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/validation/database.php';

// Use the constant defined in config.php instead of hardcoding
$pfHost = (defined('PAYFAST_SANDBOX_MODE') && PAYFAST_SANDBOX_MODE) ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
$pfPassphrase = defined('PAYFAST_PASSPHRASE') ? PAYFAST_PASSPHRASE : '';

$pfData = $_POST;
if (empty($pfData)) die('No data received');

// Build Param String
$pfParamString = '';
foreach ($pfData as $key => $val) {
    if ($key !== 'signature') {
        $pfParamString .= $key . '=' . urlencode(stripslashes($val)) . '&';
    } else {
        break;
    }
}
$pfParamString = substr($pfParamString, 0, -1);

// Helper Functions
function pfValidSignature($pfData, $pfParamString, $pfPassphrase)
{
    $tempParamString = $pfParamString . '&passphrase=' . urlencode($pfPassphrase);
    return ($pfData['signature'] === md5($tempParamString));
}

function pfValidServerConfirmation($pfParamString, $pfHost)
{
    $url = 'https://' . $pfHost . '/eng/query/validate';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $pfParamString);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    // Added timeout for stability
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    return ($response === 'VALID');
}

// Validation Workflow
$signatureValid = pfValidSignature($pfData, $pfParamString, $pfPassphrase);
$serverValid = pfValidServerConfirmation($pfParamString, $pfHost);

if ($signatureValid && $serverValid) {
    $transactionId = intval($pfData['m_payment_id']);

    try {
        $db = Database::getConnection();
        $db->beginTransaction();

        // Update payment status
        $stmt = $db->prepare("UPDATE payments SET status = 'completed' WHERE transaction_id = ?");
        $stmt->execute([$transactionId]);

        // Update Transaction/Escrow Step
        $db->prepare("UPDATE transactions SET status = 'committed', escrow_step = 2 WHERE id = ?")
            ->execute([$transactionId]);

        $db->prepare("INSERT INTO transaction_events (transaction_id, event_type, from_step, to_step, metadata_json) VALUES (?, 'payment_received', 1, 2, ?)")
            ->execute([$transactionId, json_encode(['note' => 'Payment validated via ITN'])]);

        $db->commit();
    } catch (Exception $e) {
        if (isset($db)) $db->rollBack();
        error_log("PayFast ITN Error: " . $e->getMessage());
    }
} else {
    error_log("PayFast ITN Validation Failed. Signature Valid: " . ($signatureValid ? 'Yes' : 'No') . ", Server Valid: " . ($serverValid ? 'Yes' : 'No'));
}
