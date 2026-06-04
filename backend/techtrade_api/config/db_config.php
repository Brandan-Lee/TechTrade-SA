<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once __DIR__ . '/config.php';

global $pdo;

try {
    if (!isset($pdo)) {
        $host = getEnvVariable('DB_HOST');
        $db   = getEnvVariable('DB_NAME');
        $user = getEnvVariable('DB_USER');
        $pass = getEnvVariable('DB_PASS', '');

        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "status" => "error",
        "message" => "Could not connect to the database.",
    ]));
}
