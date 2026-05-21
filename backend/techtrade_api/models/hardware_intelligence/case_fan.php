<?php

class CaseFan extends Hardware
{
    public ?int $sizeMm;
    public ?int $maxRpm;
    public ?float $airflowCfm;
    public ?float $noiseDb;
    public bool $pwm;
    public bool $rgb;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM case_fans WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $fan = new self($db);
        $fan->hydrate($hardwareRow);
        $fan->hydrateCaseFan($row);

        return $fan;
    }

    private function hydrateCaseFan(array $row): void
    {
        $this->sizeMm = isset($row['size_mm']) ? (int) $row['size_mm'] : null;
        $this->maxRpm = isset($row['max_rpm']) ? (int) $row['max_rpm'] : null;
        $this->airflowCfm = isset($row['airflow_cfm']) ? (float) $row['airflow_cfm'] : null;
        $this->noiseDb = isset($row['noise_db']) ? (float) $row['noise_db'] : null;
        $this->pwm = (bool) $row['pwm'];
        $this->rgb = (bool) $row['rgb'];
    }
}