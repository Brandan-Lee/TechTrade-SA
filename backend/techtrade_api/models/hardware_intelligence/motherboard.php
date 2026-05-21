<?php

class Motherboard extends Hardware
{
    public ?string $socket;
    public ?string $chipset;
    public ?string $formFactor;
    public ?string $memoryType;
    public ?int $maxMemoryGb;
    public ?int $memorySlots;
    public ?int $pcieX16Slots;
    public ?int $m2Slots;
    public ?int $sataPorts;
    public bool $wifi;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM motherboards WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $mobo = new self($db);
        $mobo->hydrate($hardwareRow);
        $mobo->hydrateMotherboard($row);

        return $mobo;
    }

    private function hydrateMotherboard(array $row): void
    {
        $this->socket = $row['socket'] ?? null;
        $this->chipset = $row['chipset'] ?? null;
        $this->formFactor = $row['form_factor'] ?? null;
        $this->memoryType = $row['memory_type'] ?? null;
        $this->maxMemoryGb = isset($row['max_memory_gb']) ? (int) $row['max_memory_gb'] : null;
        $this->memorySlots = isset($row['memory_slots']) ? (int) $row['memory_slots'] : null;
        $this->pcieX16Slots = isset($row['pcie_x16_slots']) ? (int) $row['pcie_x16_slots'] : null;
        $this->m2Slots = isset($row['m2_slots']) ? (int) $row['m2_slots'] : null;
        $this->sataPorts = isset($row['sata_ports']) ? (int) $row['sata_ports'] : null;
        $this->wifi = (bool) $row['wifi'];
    }
}