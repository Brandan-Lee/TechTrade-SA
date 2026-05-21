<?php

class Gpu extends Hardware
{
    public ?string $chipset;
    public ?float $vramGb;
    public ?string $vramType;
    public ?int $coreClockMhz;
    public ?int $boostClockMhz;
    public ?string $pcieVersion;
    public ?string $powerConnectors;
    public ?int $tdpWatts;
    public ?string $outputs;
    public ?int $lengthMm;
    public ?int $slotWidth;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM gpus WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $gpuRow = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$gpuRow)
            return null;

        $gpu = new self($db);

        $gpu->hydrate($hardwareRow);
        $gpu->hydrateGpu($gpuRow);

        return $gpu;
    }

    private function hydrateGpu(array $row): void
    {
        $this->chipset = $row['chipset'] ?? null;
        $this->vramGb = isset($row['vram_gb']) ? (float) $row['vram_gb'] : null;
        $this->vramType = $row['vram_type'] ?? null;
        $this->coreClockMhz = isset($row['core_clock_mhz']) ? (int) $row['core_clock_mhz'] : null;
        $this->boostClockMhz = isset($row['boost_clock_mhz']) ? (int) $row['boost_clock_mhz'] : null;
        $this->pcieVersion = $row['pcie_version'] ?? null;
        $this->powerConnectors = $row['power_connectors'] ?? null;
        $this->tdpWatts = isset($row['tdp_watts']) ? (int) $row['tdp_watts'] : null;
        $this->outputs = $row['outputs'] ?? null;
        $this->lengthMm = isset($row['length_mm']) ? (int) $row['length_mm'] : null;
        $this->slotWidth = isset($row['slot_width']) ? (int) $row['slot_width'] : null;
    }
}