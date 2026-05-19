<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/session_manager.php';

SessionManager::init($db);

if (isset($_COOKIE['remember_me'])) {
    $selector = explode(':', $_COOKIE['remember_me'])[0];
    $stmt = $db->prepare("DELETE FROM user_tokens WHERE selector = ?");
    $stmt->execute([$selector]);

    setcookie('remember_me', '', time() - 3600, '/', '', true, true);
}

$_SESSION = [];
session_destroy();

echo json_encode(["status" => "success", "message" => "Session terminated."]);