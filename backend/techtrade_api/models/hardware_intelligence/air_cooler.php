<?php

class AirCooler extends Hardware
{
    public ?int $heightMm;
    public ?int $fanCount;
    public ?int $fanSizeMm;
    public ?int $tdpRatingWatts;
    public ?string $socketCompatibility;
    public bool $rgb;

    public static function findByHardwareId(PDO $db, int $hardwareId): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$hardwareId]);
        $hardwareRow = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$hardwareRow)
            return null;

        $stmtSpec = $db->prepare("SELECT * FROM air_coolers WHERE hardware_id = ? LIMIT 1");
        $stmtSpec->execute([$hardwareId]);
        $row = $stmtSpec->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $cooler = new self($db);
        $cooler->hydrate($hardwareRow);
        $cooler->hydrateAirCooler($row);

        return $cooler;
    }

    private function hydrateAirCooler(array $row): void
    {
        $this->heightMm = isset($row['height_mm']) ? (int) $row['height_mm'] : null;
        $this->fanCount = isset($row['fan_count']) ? (int) $row['fan_count'] : null;
        $this->fanSizeMm = isset($row['fan_size_mm']) ? (int) $row['fan_size_mm'] : null;
        $this->tdpRatingWatts = isset($row['tdp_rating_watts']) ? (int) $row['tdp_rating_watts'] : null;
        $this->socketCompatibility = $row['socket_compatibility'] ?? null;
        $this->rgb = (bool) $row['rgb'];
    }
}