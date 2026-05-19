<?php

class HardwareChecker
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function isBanned(?string $hardwareId): bool
    {
        if (empty($hardwareId)) {
            return false;
        }

        $sql = "SELECT id FROM users WHERE hardware_id = ? AND is_banned = 1 LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$hardwareId]);

        return (bool) $stmt->fetch();
    }
}