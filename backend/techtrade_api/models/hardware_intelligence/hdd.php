<?php

class Hdd extends Hardware
{
    public ?int $capacityGb;
    public ?int $rpm;
    public ?int $cacheMb;
    public ?string $formFactor;
    public ?string $interfaceType;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM hdds WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $hdd = new self($db);
        $hdd->hydrate($hardwareRow);
        $hdd->hydrateHdd($row);

        return $hdd;
    }

    private function hydrateHdd(array $row): void
    {
        $this->capacityGb = isset($row['capacity_gb']) ? (int) $row['capacity_gb'] : null;
        $this->rpm = isset($row['rpm']) ? (int) $row['rpm'] : null;
        $this->cacheMb = isset($row['cache_mb']) ? (int) $row['cache_mb'] : null;
        $this->formFactor = $row['form_factor'] ?? null;
        $this->interfaceType = $row['interface_type'] ?? null;
    }
}