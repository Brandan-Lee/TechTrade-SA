<?php

class Cpu extends Hardware
{
    public ?string $socket;
    public ?string $architecture;
    public ?int $cores;
    public ?int $threads;
    public ?float $baseClockGhz;
    public ?float $boostClockGhz;
    public ?int $tdpWatts;
    public ?string $integratedGraphics;
    public bool $unlocked;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM cpus WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $cpuRow = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$cpuRow)
            return null;

        $cpu = new self($db);

        $cpu->hydrate($hardwareRow);
        $cpu->hydrateCpu($cpuRow);

        return $cpu;
    }

    private function hydrateCpu(array $row): void
    {
        $this->socket = $row['socket'] ?? null;
        $this->architecture = $row['architecture'] ?? null;
        $this->cores = isset($row['cores']) ? (int) $row['cores'] : null;
        $this->threads = isset($row['threads']) ? (int) $row['threads'] : null;
        $this->baseClockGhz = isset($row['base_clock_ghz']) ? (float) $row['base_clock_ghz'] : null;
        $this->boostClockGhz = isset($row['boost_clock_ghz']) ? (float) $row['boost_clock_ghz'] : null;
        $this->tdpWatts = isset($row['tdp_watts']) ? (int) $row['tdp_watts'] : null;
        $this->integratedGraphics = $row['integrated_graphics'] ?? null;
        $this->unlocked = (bool) $row['unlocked'];
    }
}