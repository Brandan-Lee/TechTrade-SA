<?php

class Hardware
{
    protected PDO $db;

    private int $id;
    private int $categoryId;
    private string $brand;
    private string $model;
    private string $fullName;
    private string $slug;
    private ?int $msrpCents;
    private bool $isActive;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public static function findById(PDO $db, int $id): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $item = new self($db);
        $item->hydrate($row);
        return $item;
    }

    public static function findBySlug(PDO $db, string $slug): ?self
    {
        $stmt = $db->prepare("SELECT * FROM hardware WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $item = new self($db);
        $item->hydrate($row);
        return $item;
    }

    protected function hydrate(array $row): void
    {
        $this->id = (int) $row['id'];
        $this->categoryId = (int) $row['category_id'];
        $this->brand = $row['brand'];
        $this->model = $row['model'];
        $this->fullName = $row['full_name'];
        $this->slug = $row['slug'];
        $this->msrpCents = $row['msrp_cents'] ? (int) $row['msrp_cents'] : null;
        $this->isActive = (bool) $row['is_active'];
        $this->createdAt = $row['created_at'];
        $this->updatedAt = $row['updated_at'];
    }

    public function getId(): int
    {
        return $this->id;
    }
    public function getCategoryId(): int
    {
        return $this->categoryId;
    }
    public function getBrand(): string
    {
        return $this->brand;
    }
    public function getModel(): string
    {
        return $this->model;
    }
    public function getFullName(): string
    {
        return $this->fullName;
    }
    public function getSlug(): string
    {
        return $this->slug;
    }
    public function getMsrpCents(): ?int
    {
        return $this->msrpCents;
    }
    public function isActive(): bool
    {
        return $this->isActive;
    }
}