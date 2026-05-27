<?php
require_once 'category.php';

class SearchController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function search(string $query, string $categoryName): array
    {
        $stmtCat = $this->db->prepare("SELECT id, spec_table FROM categories WHERE name = ?");
        $stmtCat->execute([$categoryName]);
        $cat = $stmtCat->fetch();

        if (!$cat)
            return [];

        $stmt = $this->db->prepare("
            SELECT id, category_id, brand, model, full_name, msrp_cents 
            FROM hardware 
            WHERE category_id = ? AND full_name LIKE ?
            LIMIT 5
        ");

        $stmt->execute([$cat['id'], "%$query%"]);
        $items = $stmt->fetchAll();

        $results = [];
        $specTable = $cat['spec_table'];

        foreach ($items as $item) {
            $stmtSpec = $this->db->prepare("SELECT * FROM {$specTable} WHERE hardware_id = ?");
            $stmtSpec->execute([$item['id']]);
            $item['specs'] = $stmtSpec->fetch() ?: [];
            $results[] = $item;
        }

        return $results;
    }

    /**
     * Lightweight global suggestions for navbar search.
     * Returns up to 5 matches across all categories.
     */
    public function suggest(string $query, int $limit = 5): array
    {
        $query = trim($query);
        if ($query === '') {
            return [];
        }

        // Prefer prefix matches, then contains.
        $stmt = $this->db->prepare("
            SELECT
                h.id,
                h.full_name,
                c.name AS category
            FROM hardware h
            JOIN categories c ON c.id = h.category_id
            WHERE h.is_active = 1
              AND h.full_name LIKE ?
            ORDER BY
                CASE WHEN h.full_name LIKE ? THEN 0 ELSE 1 END,
                h.full_name ASC
            LIMIT {$limit}
        ");

        $likeContains = '%' . $query . '%';
        $likePrefix = $query . '%';
        $stmt->execute([$likeContains, $likePrefix]);

        return $stmt->fetchAll() ?: [];
    }
}

?>