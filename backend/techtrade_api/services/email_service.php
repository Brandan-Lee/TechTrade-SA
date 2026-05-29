<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

class EmailService
{
    private PHPMailer $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);

        $this->mailer->isSMTP();
        $this->mailer->Host       = SMTP_HOST;
        $this->mailer->SMTPAuth   = true;
        $this->mailer->Username   = SMTP_USER;
        $this->mailer->Password   = SMTP_PASS;
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port       = 587;
        $this->mailer->setFrom(FROM_EMAIL, FROM_NAME);
        $this->mailer->isHTML(true);
    }

    public function sendOTP(string $toEmail, string $otpCode, string $purpose): bool
    {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->clearAttachments();
            $this->mailer->addAddress($toEmail);
            $this->mailer->Subject = 'Verification Code - TechTrade';

            $action = ($purpose === 'reset') ? 'reset your password' : 'login to your account';

            $this->mailer->Body = "
                <div style='font-family: sans-serif; padding: 20px;'>
                    <h2>Security Verification</h2>
                    <p>You have requested to <b>{$action}</b>.</p>
                    <h1 style='color: #d946ef; letter-spacing: 5px;'>{$otpCode}</h1>
                    <p>This code expires in 10 minutes. If you did not request this, please contact support. Your account may have been breached</p>
                </div>";

            return $this->mailer->send();
        } catch (Exception $e) {
            error_log("Email could not be sent. Mailer Error: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
}
