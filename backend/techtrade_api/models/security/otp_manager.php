<?php
class OTPManager
{
    private PDO $db;
    private EmailService $emailService;

    public function __construct(PDO $db, EmailService $emailService)
    {
        $this->db = $db;
        $this->emailService = $emailService;
    }

    /**
     * Generates, stores, and emails an OTP in one go.
     */
    public function sendNewOTP(string $email, string $purpose, ?int $userId = null): bool
    {
        $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        $hash = password_hash($code, PASSWORD_BCRYPT);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        $stmt = $this->db->prepare("DELETE FROM otp_verifications WHERE email = ? AND purpose = ? AND verified_at IS NULL");
        $stmt->execute([$email, $purpose]);

        $stmt = $this->db->prepare("INSERT INTO otp_verifications (user_id, email, code_hash, purpose, expires_at) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $email, $hash, $purpose, $expiresAt]);

        return $this->emailService->sendOTP($email, $code, $purpose);
    }

    public function verifyOTP(string $email, string $purpose, string $submittedCode): bool
    {
        $stmt = $this->db->prepare("SELECT * FROM otp_verifications WHERE email = ? AND purpose = ? AND verified_at IS NULL AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$email, $purpose]);
        $otp = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($otp && password_verify($submittedCode, $otp['code_hash'])) {
            $update = $this->db->prepare("UPDATE otp_verifications SET verified_at = NOW() WHERE id = ?");
            $update->execute([$otp['id']]);
            return true;
        }
        return false;
    }
}