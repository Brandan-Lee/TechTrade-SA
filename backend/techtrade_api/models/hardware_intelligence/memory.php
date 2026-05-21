<?php

class Memory extends Hardware
{
    public ?string $memoryType;
    public ?int $capacityGb;
    public ?int $kitModules;
    public ?int $speedMhz;
    public ?string $casLatency;
    public ?float $voltage;
    public bool $rgb;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM memory WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $memory = new self($db);
        $memory->hydrate($hardwareRow);
        $memory->hydrateMemory($row);

        return $memory;
    }

    private function hydrateMemory(array $row): void
    {
        $this->memoryType = $row['memory_type'] ?? null;
        $this->capacityGb = isset($row['capacity_gb']) ? (int) $row['capacity_gb'] : null;
        $this->kitModules = isset($row['kit_modules']) ? (int) $row['kit_modules'] : null;
        $this->speedMhz = isset($row['speed_mhz']) ? (int) $row['speed_mhz'] : null;
        $this->casLatency = $row['cas_latency'] ?? null;
        $this->voltage = isset($row['voltage']) ? (float) $row['voltage'] : null;
        $this->rgb = (bool) $row['rgb'];
    }
}