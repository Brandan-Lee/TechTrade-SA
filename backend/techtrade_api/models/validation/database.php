<?php

class Database
{
    public static function getConnection(): PDO
    {
        require_once __DIR__ . '/../../config/config.php';
        require_once __DIR__ . '/../../config/db_config.php';

        global $pdo;

        if (!$pdo instanceof PDO) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Could not connect to the database. Please check your setup configuration."]);
            exit();
        }

        return $pdo;
    }
}
