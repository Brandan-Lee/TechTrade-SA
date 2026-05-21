<?php

class Category
{
    private PDO $db;

    private int $id;
    private string $groupLabel;
    private string $name;
    private string $slug;
    private ?string $specTable;
    private int $sortOrder;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public static function findById(PDO $db, int $id): ?self
    {
        $stmt = $db->prepare("SELECT * FROM categories WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $category = new self($db);
        $category->hydrate($row);
        return $category;
    }

    public static function findBySlug(PDO $db, string $slug): ?self
    {
        $stmt = $db->prepare("SELECT * FROM categories WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row)
            return null;

        $category = new self($db);
        $category->hydrate($row);
        return $category;
    }

    public static function getAll(PDO $db): array
    {
        $stmt = $db->query("SELECT * FROM categories ORDER BY sort_order ASC");
        $categories = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $cat = new self($db);
            $cat->hydrate($row);
            $categories[] = $cat;
        }
        return $categories;
    }

    private function hydrate(array $row): void
    {
        $this->id = (int) $row['id'];
        $this->groupLabel = $row['group_label'];
        $this->name = $row['name'];
        $this->slug = $row['slug'];
        $this->specTable = $row['spec_table'] ?? null;
        $this->sortOrder = (int) $row['sort_order'];
    }

    public function getId(): int
    {
        return $this->id;
    }
    public function getGroupLabel(): string
    {
        return $this->groupLabel;
    }
    public function getName(): string
    {
        return $this->name;
    }
    public function getSlug(): string
    {
        return $this->slug;
    }
    public function getSpecTable(): ?string
    {
        return $this->specTable;
    }
    public function getSortOrder(): int
    {
        return $this->sortOrder;
    }
}