<?php

class Ssd extends Hardware
{
    public ?int $capacityGb;
    public ?string $interfaceType;
    public ?string $formFactor;
    public ?string $nandType;
    public ?string $pcieGen;
    public ?int $readSpeedMbps;
    public ?int $writeSpeedMbps;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM ssds WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $ssd = new self($db);
        $ssd->hydrate($hardwareRow);
        $ssd->hydrateSsd($row);

        return $ssd;
    }

    private function hydrateSsd(array $row): void
    {
        $this->capacityGb = isset($row['capacity_gb']) ? (int) $row['capacity_gb'] : null;
        $this->interfaceType = $row['interface_type'] ?? null;
        $this->formFactor = $row['form_factor'] ?? null;
        $this->nandType = $row['nand_type'] ?? null;
        $this->pcieGen = $row['pcie_gen'] ?? null;
        $this->readSpeedMbps = isset($row['read_speed_mbps']) ? (int) $row['read_speed_mbps'] : null;
        $this->writeSpeedMbps = isset($row['write_speed_mbps']) ? (int) $row['write_speed_mbps'] : null;
    }
}