<?php

class Database
{

    public static function getConnection(): PDO
    {
        require_once __DIR__ . '/../../config/db_config.php';

        global $pdo;

        if (!$pdo instanceof PDO) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database connection asset missing or invalid."]);
            exit();
        }

        return $pdo;
    }
}