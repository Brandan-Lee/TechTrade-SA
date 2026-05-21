<?php

class SessionManager
{
    public static function init(PDO $db): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            // None allows session cookies when the React dev server (e.g. :5173) calls localhost:80
            ini_set('session.cookie_samesite', 'None');
            ini_set('session.cookie_secure', '0');
            ini_set('session.cookie_httponly', '1');

            session_start([
                'cookie_httponly' => true,
                'cookie_secure' => false,
                'cookie_samesite' => 'None',
                'cookie_path' => '/',
            ]);
        }

        if (!isset($_SESSION['user_id']) && isset($_COOKIE['remember_me'])) {
            self::attemptAutoLogin($db);
        }
    }

    private static function attemptAutoLogin(PDO $db): void
    {
        $parts = explode(':', $_COOKIE['remember_me']);
        if (count($parts) !== 2) {
            return;
        }

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