<?php

class Psu extends Hardware
{
    public ?int $wattage;
    public ?string $efficiencyRating;
    public ?string $modularType;
    public ?string $formFactor;
    public ?int $pcieConnectors;
    public ?int $sataConnectors;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM psus WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $psu = new self($db);
        $psu->hydrate($hardwareRow);
        $psu->hydratePsu($row);

        return $psu;
    }

    private function hydratePsu(array $row): void
    {
        $this->wattage = isset($row['wattage']) ? (int) $row['wattage'] : null;
        $this->efficiencyRating = $row['efficiency_rating'] ?? null;
        $this->modularType = $row['modular_type'] ?? null;
        $this->formFactor = $row['form_factor'] ?? null;
        $this->pcieConnectors = isset($row['pcie_connectors']) ? (int) $row['pcie_connectors'] : null;
        $this->sataConnectors = isset($row['sata_connectors']) ? (int) $row['sata_connectors'] : null;
    }
}