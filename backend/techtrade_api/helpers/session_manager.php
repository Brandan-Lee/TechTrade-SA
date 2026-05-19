<?php

class SessionManager
{
    public static function init(PDO $db): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start([
                'cookie_httponly' => true,
                'cookie_secure' => true,
                'cookie_samesite' => 'Strict'
            ]);
        }

        if (!isset($_SESSION['user_id']) && isset($_COOKIE['remember_me'])) {
            self::attemptAutoLogin($db);
        }
    }

    private static function attemptAutoLogin(PDO $db): void
    {
        $parts = explode(':', $_COOKIE['remember_me']);
        if (count($parts) !== 2)
            return;

        [$selector, $validator] = $parts;
        $hashedValidator = hash('sha256', hex2bin($validator));

        $stmt = $db->prepare("SELECT user_id, hashed_validator FROM user_tokens WHERE selector = ? AND expires_at > NOW()");
        $stmt->execute([$selector]);
        $token = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($token && hash_equals($token['hashed_validator'], $hashedValidator)) {
            $_SESSION['user_id'] = $token['user_id'];
        } else {
            setcookie('remember_me', '', time() - 3600, '/');
        }
    }
}