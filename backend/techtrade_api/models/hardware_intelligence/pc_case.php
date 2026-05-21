<?php

class PcCase extends Hardware
{
    public ?string $formFactor;
    public ?string $sidePanel;
    public ?int $maxGpuLengthMm;
    public ?int $maxCoolerHeightMm;
    public ?int $driveBays35;
    public ?int $driveBays25;
    public ?string $dimensions;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM pc_cases WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $case = new self($db);
        $case->hydrate($hardwareRow);
        $case->hydratePcCase($row);

        return $case;
    }

    private function hydratePcCase(array $row): void
    {
        $this->formFactor = $row['form_factor'] ?? null;
        $this->sidePanel = $row['side_panel'] ?? null;
        $this->maxGpuLengthMm = isset($row['max_gpu_length_mm']) ? (int) $row['max_gpu_length_mm'] : null;
        $this->maxCoolerHeightMm = isset($row['max_cooler_height_mm']) ? (int) $row['max_cooler_height_mm'] : null;
        $this->driveBays35 = isset($row['drive_bays_3_5']) ? (int) $row['drive_bays_3_5'] : null;
        $this->driveBays25 = isset($row['drive_bays_2_5']) ? (int) $row['drive_bays_2_5'] : null;
        $this->dimensions = $row['dimensions'] ?? null;
    }
}