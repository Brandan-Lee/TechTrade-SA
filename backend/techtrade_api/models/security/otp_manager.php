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

    public function sendNewOTP(string $email, string $purpose, ?int $userId = null): bool
    {
        $code = (string) random_int(1000, 9999);
        $hash = password_hash($code, PASSWORD_BCRYPT);
        
        $stmt = $this->db->prepare("DELETE FROM otp_verifications WHERE email = ? AND purpose = ? AND verified_at IS NULL");
        $stmt->execute([$email, $purpose]);

        $stmt = $this->db->prepare("
            INSERT INTO otp_verifications (user_id, email, code_hash, purpose, created_at, expires_at) 
            VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE))
        ");
        $stmt->execute([$userId, $email, $hash, $purpose]);

        return $this->emailService->sendOTP($email, $code, $purpose);
    }

    public function verifyOTP(string $email, string $purpose, string $submittedCode): bool
    {
        $stmt = $this->db->prepare("SELECT * FROM otp_verifications 
                                    WHERE email = ? 
                                      AND purpose = ? 
                                      AND verified_at IS NULL 
                                    ORDER BY id DESC LIMIT 1");

        $stmt->execute([$email, $purpose]);
        $otp = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$otp) {
            return false;
        }

        $expiryTimestamp = strtotime($otp['expires_at']);
        $currentTimestamp = time(); 

        if ($currentTimestamp > $expiryTimestamp) {
            return false;
        }

        if (password_verify(trim($submittedCode), $otp['code_hash'])) {
            $verifiedAt = date('Y-m-d H:i:s', $currentTimestamp);
            
            $update = $this->db->prepare("UPDATE otp_verifications SET verified_at = ? WHERE id = ?");
            $update->execute([$verifiedAt, $otp['id']]);
            return true;
        }

        return false;
    }
}
?>