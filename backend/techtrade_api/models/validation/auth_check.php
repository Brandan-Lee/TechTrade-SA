<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../../helpers/session_manager.php';
require_once __DIR__ . '/../models/authentication/user.php';

SessionManager::init($db);

if (isset($_SESSION['user_id'])) {
    $user = User::findById($db, $_SESSION['user_id']);

    if ($user && !$user->isBanned()) {
        echo json_encode([
            "status" => "authenticated",
            "user" => [
                "id" => $user->getId(),
                "email" => $user->getEmail(),
                "fullName" => $user->getFullName(),
                "regType" => $user->getRegType()
            ]
        ]);
        exit;
    }
}

http_response_code(401);
echo json_encode(["status" => "guest"]);

?>