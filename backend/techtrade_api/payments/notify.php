<?php
header('HTTP/1.0 200 OK');
flush();

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/validation/database.php';

$pfHost = (defined('PAYFAST_SANDBOX_MODE') && PAYFAST_SANDBOX_MODE) ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
$pfPassphrase = defined('PAYFAST_PASSPHRASE') ? PAYFAST_PASSPHRASE : '';

$pfData = $_POST;
if (empty($pfData)) die('No data received');

$pfParamString = '';
foreach ($pfData as $key => $val) {
    if ($key !== 'signature') {
        $pfParamString .= $key . '=' . urlencode(stripslashes($val)) . '&';
    } else {
        break;
    }
}
$pfParamString = substr($pfParamString, 0, -1);

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
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $error = curl_error($ch);

    return ($response === 'VALID');
}

$signatureValid = pfValidSignature($pfData, $pfParamString, $pfPassphrase);
$serverValid = pfValidServerConfirmation($pfParamString, $pfHost);

if ($signatureValid && $serverValid) {
    $transactionId = intval($pfData['m_payment_id']);

    try {
        $db = Database::getConnection();

        $db->beginTransaction();

        $stmt = $db->prepare("UPDATE payments SET status = 'completed' WHERE transaction_id = ?");
        $stmt->execute([$transactionId]);

        $db->prepare("UPDATE transactions SET status = 'committed', escrow_step = 2 WHERE id = ?")
            ->execute([$transactionId]);

        $db->prepare("INSERT INTO transaction_events (transaction_id, event_type, from_step, to_step, metadata_json) VALUES (?, 'payment_received', 1, 2, ?)")
            ->execute([$transactionId, json_encode(['note' => 'Payment confirmed and verified by payment provider.'])]);

        $db->commit();
    } catch (Exception $e) {
        if (isset($db)) $db->rollBack();
        error_log("Payment Process Error: " . $e->getMessage());
    }
} else {
    error_log("Payment verification failed. Security check passed: " . ($signatureValid ? 'Yes' : 'No') . ", Provider check passed: " . ($serverValid ? 'Yes' : 'No'));
}
