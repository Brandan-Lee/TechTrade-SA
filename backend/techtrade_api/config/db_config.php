<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$db   = 'techtrade_za';
$user = 'root';
$pass = '';

global $pdo;

try {
    if (!isset($pdo)) {
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
        "message" => "Database Connection Failed: " . $e->getMessage()
    ]));
}
?>