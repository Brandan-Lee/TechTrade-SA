<?php

class Aio extends Hardware
{
    public ?int $radiatorMm;
    public ?int $fanCount;
    public ?int $fanSizeMm;
    public ?string $socketCompatibility;
    public bool $rgb;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM aios WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $aio = new self($db);
        $aio->hydrate($hardwareRow);
        $aio->hydrateAio($row);

        return $aio;
    }

    private function hydrateAio(array $row): void
    {
        $this->radiatorMm = isset($row['radiator_mm']) ? (int) $row['radiator_mm'] : null;
        $this->fanCount = isset($row['fan_count']) ? (int) $row['fan_count'] : null;
        $this->fanSizeMm = isset($row['fan_size_mm']) ? (int) $row['fan_size_mm'] : null;
        $this->socketCompatibility = $row['socket_compatibility'] ?? null;
        $this->rgb = (bool) $row['rgb'];
    }
}