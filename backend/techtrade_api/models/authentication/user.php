<?php

require_once __DIR__ . '/../security/encryption_engine.php';

class User
{
    private PDO $db;
    private ?EncryptionEngine $crypto = null;

    private int $id;
    private int $roleId;
    private string $email;
    private string $passwordHash;
    private string $firstName;
    private string $lastName;
    private ?string $encryptedMobile; 
    private ?string $hardwareId;      
    private ?string $province;        
    private ?string $avatarUrl;       
    private string $regType;
    private string $memberSince;      
    private float $trustScore;
    private int $tradeCount;
    private int $strikeCount;
    private bool $isSuspended;
    private bool $hasBeenSuspended;
    private ?string $suspendedAt;
    private ?string $suspendedReason;
    private ?string $suspendedUntil;
    private bool $isBanned;
    private ?string $bannedAt;
    private ?string $banReason;
    private ?string $tosAcceptedAt;   
    private ?string $lastLoginAt;    
    private string $createdAt;        
    private string $updatedAt;        
    private bool $isDeleted;
    private bool $isMFA;              
    private ?string $deletedAt;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        if (defined('ENCRYPTION_KEY')) {
            $this->crypto = new EncryptionEngine(ENCRYPTION_KEY);
        }
    }

    private function isEncrypted(?string $value): bool
    {
        if (empty($value)) {
            return false;
        }
        return (bool) preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $value);
    }

    private function safeDecrypt(?string $payload): string
    {
        if (empty($payload)) {
            return '';
        }
        if ($this->crypto && $this->isEncrypted($payload)) {
            return $this->crypto->decrypt($payload) ?? $payload;
        }
        return $payload;
    }

    public static function findById(PDO $db, int $id): ?User
    {
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ? AND is_deleted = 0 LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        $user = new self($db);
        $user->hydrate($row);
        return $user;
    }

    public static function findByEmail(PDO $db, string $email): ?User
    {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? AND is_deleted = 0 LIMIT 1");
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        $user = new self($db);
        $user->hydrate($row);
        return $user;
    }

    public function verifyPassword(string $password): bool
    {
        return password_verify($password, $this->passwordHash);
    }

    private function hydrate(array $row): void
    {
        $this->id = (int) $row['id'];
        $this->roleId = (int) $row['role_id'];
        $this->email = $row['email'];
        $this->passwordHash = $row['password_hash'];
        $this->firstName = $row['first_name'];
        $this->lastName = $row['last_name'];
        $this->encryptedMobile = $row['mobile'] ?? null;
        $this->hardwareId = $row['hardware_id'] ?? null;
        $this->province = $row['province'] ?? null;
        $this->avatarUrl = $row['avatar_url'] ?? null;
        $this->regType = $row['reg_type'];
        $this->memberSince = $row['member_since'];
        $this->trustScore = (float) $row['trust_score'];
        $this->tradeCount = (int) $row['trade_count'];
        $this->strikeCount = (int) $row['strike_count'];
        $this->isSuspended = (bool) $row['is_suspended'];
        $this->hasBeenSuspended = (bool) $row['has_been_suspended'];
        $this->suspendedAt = $row['suspended_at'] ?? null;
        $this->suspendedReason = $row['suspended_reason'] ?? null;
        $this->suspendedUntil = $row['suspended_until'] ?? null;
        $this->isBanned = (bool) $row['is_banned'];
        $this->bannedAt = $row['banned_at'] ?? null;
        $this->banReason = $row['ban_reason'] ?? null;
        $this->tosAcceptedAt = $row['tos_accepted_at'] ?? null;
        $this->lastLoginAt = $row['last_login_at'] ?? null;
        $this->createdAt = $row['created_at'];
        $this->updatedAt = $row['updated_at'];
        $this->isDeleted = (bool) $row['is_deleted'];
        $this->isMFA = (bool) ($row['MFA'] ?? 1); 
        $this->deletedAt = $row['deleted_at'] ?? null;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getRoleId(): int
    {
        return $this->roleId;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getFullName(): string
    {
        $first = $this->safeDecrypt($this->firstName);
        $last = $this->safeDecrypt($this->lastName);
        return trim($first . ' ' . $last);
    }

    public function getMobile(): string
    {
        return $this->safeDecrypt($this->encryptedMobile);
    }

    public function getHardwareId(): ?string
    {
        return $this->hardwareId;
    }

    public function getProvince(): ?string
    {
        return $this->province;
    }

    public function getRawProvinceCode(): ?string
    {
        return $this->province;
    }

    public function getAvatarUrl(): ?string
    {
        return $this->avatarUrl;
    }

    public function getRegType(): string
    {
        return $this->regType;
    }

    public function getMemberSince(): string
    {
        return $this->memberSince;
    }

    public function getTrustScore(): float
    {
        return $this->trustScore;
    }

    public function getTradeCount(): int
    {
        return $this->tradeCount;
    }

    public function getStrikeCount(): int
    {
        return $this->strikeCount;
    }

    public function isSuspended(): bool
    {
        return $this->isSuspended;
    }

    public function hasBeenSuspended(): bool
    {
        return $this->hasBeenSuspended;
    }

    public function getSuspendedAt(): ?string
    {
        return $this->suspendedAt;
    }

    public function getSuspendedReason(): ?string
    {
        return $this->suspendedReason;
    }

    public function getSuspendedUntil(): ?string
    {
        return $this->suspendedUntil;
    }

    public function isBanned(): bool
    {
        return $this->isBanned;
    }

    public function getBannedAt(): ?string
    {
        return $this->bannedAt;
    }

    public function getBanReason(): ?string
    {
        return $this->banReason;
    }

    public function getTosAcceptedAt(): ?string
    {
        return $this->tosAcceptedAt;
    }

    public function getLastLoginAt(): ?string
    {
        return $this->lastLoginAt;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    public function isDeleted(): bool
    {
        return $this->isDeleted;
    }

    public function getDeletedAt(): ?string
    {
        return $this->deletedAt;
    }

    public function isMFAEnabled(): bool
    {
        return $this->isMFA;
    }


    public function addStrike(int $count = 1, string $reason = ''): bool
    {
        $this->strikeCount += $count;
        $params = [$this->strikeCount];
        $sql = "UPDATE users SET strike_count = ?";

        if ($this->hasBeenSuspended && $this->strikeCount >= 3) {
            $this->isBanned = true;
            $this->banReason = empty($reason) ? 'Permanent Hardware Ban' : $reason;
            $sql .= ", is_banned = 1, banned_at = NOW(), ban_reason = ?";
            $params[] = $this->banReason;
        } else if ($this->strikeCount == 2) {
            $this->isSuspended = true;
            $this->hasBeenSuspended = true;
            $this->suspendedReason = empty($reason) ? 'Automatic system suspension' : $reason;
            $sql .= ", is_suspended = 1, has_been_suspended = 1, suspended_at = NOW(), suspended_until = DATE_ADD(NOW(), INTERVAL ? DAY), suspended_reason = ?";
            $params[] = 7;
            $params[] = $this->suspendedReason;
        }

        $sql .= " WHERE id = ?";
        $params[] = $this->id;

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function suspend(string $reason, ?int $customDays = null): bool
    {
        $days = $customDays ?? 7;
        $sql = "UPDATE users SET is_suspended = 1, has_been_suspended = 1, suspended_at = NOW(), suspended_until = DATE_ADD(NOW(), INTERVAL ? DAY), suspended_reason = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$days, $reason, $this->id]);
    }

    public function liftSuspension(): bool
    {
        $sql = "UPDATE users SET is_suspended = 0, suspended_at = NULL, suspended_until = NULL, suspended_reason = NULL WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$this->id]);
    }

    public function updateLastLogin(): bool
    {
        $sql = "UPDATE users SET last_login_at = NOW() WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$this->id]);
    }

    public function updatePassword(string $newPassword): bool
    {
        $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

        $sql = "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?";

        $stmt = $this->db->prepare($sql);
        $success = $stmt->execute([$newHash, $this->id]);

        if ($success) {
            $this->passwordHash = $newHash;
            $this->updatedAt = date('Y-m-d H:i:s');
        }

        return $success;
    }
}
