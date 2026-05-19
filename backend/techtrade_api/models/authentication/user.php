<?php

require_once __DIR__ . '/EncryptionEngine.php';

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
    private string $encryptedMobile;
    private ?string $hardwareId;
    private string $province;
    private ?string $avatarUrl;
    private string $regType;
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
    private bool $isDeleted;
    private ?string $deletedAt;

    public function __construct(PDO $db)
    {
        $this->db = $db;

        if (defined('ENCRYPTION_KEY')) {
            $this->crypto = new EncryptionEngine(ENCRYPTION_KEY);
        }
    }

    public static function findById(PDO $db, int $id): ?User
    {
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ? AND is_deleted = 0 LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row)
            return null;

        $user = new self($db);
        $user->hydrate($row);
        return $user;
    }

    public static function findByEmail(PDO $db, string $email): ?User
    {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? AND is_deleted = 0 LIMIT 1");
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row)
            return null;

        $user = new self($db);
        $user->hydrate($row);
        return $user;
    }

    private function hydrate(array $row): void
    {
        $this->id = (int) $row['id'];
        $this->roleId = (int) $row['role_id'];
        $this->email = $row['email'];
        $this->passwordHash = $row['password_hash'];
        $this->firstName = $row['first_name'];
        $this->lastName = $row['last_name'];
        $this->encryptedMobile = $row['mobile'] ?? '';
        $this->hardwareId = $row['hardware_id'] ?? null;
        $this->province = $row['province'];
        $this->avatarUrl = $row['avatar_url'];
        $this->regType = $row['reg_type'];
        $this->trustScore = (float) $row['trust_score'];
        $this->tradeCount = (int) $row['trade_count'];
        $this->strikeCount = (int) $row['strike_count'];
        $this->isSuspended = (bool) $row['is_suspended'];
        $this->hasBeenSuspended = (bool) $row['has_been_suspended'];
        $this->suspendedAt = $row['suspended_at'];
        $this->suspendedReason = $row['suspended_reason'];
        $this->suspendedUntil = $row['suspended_until'];
        $this->isBanned = (bool) $row['is_banned'];
        $this->bannedAt = $row['banned_at'];
        $this->banReason = $row['ban_reason'];
        $this->isDeleted = (bool) $row['is_deleted'];
        $this->deletedAt = $row['deleted_at'];
    }

    // Getters
    public function getId(): int
    {
        return $this->id;
    }
    public function getEmail(): string
    {
        return $this->email;
    }
    public function getFullName(): string
    {
        return $this->firstName . ' ' . $this->lastName;
    }
    public function getProvince(): string
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
    public function getTrustScore(): float
    {
        return $this->trustScore;
    }
    public function getStrikeCount(): int
    {
        return $this->strikeCount;
    }
    public function getHardwareId(): ?string
    {
        return $this->hardwareId;
    }
    public function isSuspended(): bool
    {
        return $this->isSuspended;
    }
    public function hasBeenSuspended(): bool
    {
        return $this->hasBeenSuspended;
    }
    public function isBanned(): bool
    {
        return $this->isBanned;
    }
    public function isDeleted(): bool
    {
        return $this->isDeleted;
    }

    public function getMobile(): string
    {
        if (!empty($this->encryptedMobile) && $this->crypto) {
            return $this->crypto->decrypt($this->encryptedMobile) ?? 'Decryption Error';
        }
        return '';
    }

    public function addStrike(int $count = 1, string $reason = ''): bool
    {
        $this->strikeCount += $count;
        $params = [$this->strikeCount];
        $sql = "UPDATE users SET strike_count = ?";

        if ($this->hasBeenSuspended && $this->strikeCount >= BAN_STRIKE_THRESHOLD) {
            $this->isBanned = true;
            $this->banReason = empty($reason) ? 'Permanent Hardware Ban: Reached max limit (' . BAN_STRIKE_THRESHOLD . ' strikes) following a prior suspension.' : $reason;
            $sql .= ", is_banned = 1, banned_at = NOW(), ban_reason = ?";
            $params[] = $this->banReason;
        } else if ($this->strikeCount == SUSPENSION_STRIKE_THRESHOLD) {
            $this->isSuspended = true;
            $this->hasBeenSuspended = true;
            $this->suspendedReason = empty($reason) ? 'Automatic system suspension: Account reached ' . SUSPENSION_STRIKE_THRESHOLD . ' platform strikes.' : $reason;
            $sql .= ", is_suspended = 1, has_been_suspended = 1, suspended_at = NOW(), suspended_until = DATE_ADD(NOW(), INTERVAL ? DAY), suspended_reason = ?";
            $params[] = SUSPENSION_DURATION_DAYS;
            $params[] = $this->suspendedReason;
        }

        $sql .= " WHERE id = ?";
        $params[] = $this->id;

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function suspend(string $reason, ?int $customDays = null): bool
    {
        $days = $customDays ?? SUSPENSION_DURATION_DAYS;
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
}