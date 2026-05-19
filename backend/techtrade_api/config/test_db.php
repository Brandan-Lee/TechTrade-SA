<?php
// Force CORS headers to allow connection from Vite dev server
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

try {
    // 1. Force strict error reporting for debugging
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    // 2. Import the config file sitting right next to us
    require_once __DIR__ . '/db_config.php'; 
    
    // 3. Verify if the database connection variable is alive
    if (isset($pdo)) {
        // Ping the database
        $stmt = $pdo->query("SELECT 1");
        
        echo json_encode([
            "status" => "success", 
            "message" => "Database handshake successful! Core matrix online.",
            "connected_to" => "techtrade_za"
        ]);
    } else {
        throw new Exception("The connection variable \$pdo was not found inside your db_config.php file.");
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Infrastructure Link Failure: " . $e->getMessage()
    ]);
}
?>