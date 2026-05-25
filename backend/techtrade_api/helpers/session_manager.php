<?php

class SessionManager
{
    /** @var int Session lifetime in seconds (7 days) */
    private const SESSION_LIFETIME = 7 * 24 * 60 * 60;

    public static function init(PDO $db): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.gc_maxlifetime', (string) self::SESSION_LIFETIME);
            ini_set('session.cookie_lifetime', (string) self::SESSION_LIFETIME);
            ini_set('session.cookie_httponly', '1');
            ini_set('session.cookie_secure', '0');
            ini_set('session.cookie_samesite', 'Lax');
            ini_set('session.cookie_path', '/');

            session_start([
                'cookie_lifetime' => self::SESSION_LIFETIME,
                'cookie_httponly' => true,
                'cookie_secure' => false,
                'cookie_samesite' => 'Lax',
                'cookie_path' => '/',
            ]);
        }

        if (!isset($_SESSION['user_id']) && isset($_COOKIE['remember_me'])) {
            self::attemptAutoLogin($db);
        }
    }

    public static function login(PDO $db, int $userId, int $roleId): void
    {
        self::init($db);
        session_regenerate_id(true);
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_role'] = $roleId;
    }

    private static function attemptAutoLogin(PDO $db): void
    {
        $parts = explode(':', $_COOKIE['remember_me'], 2);
        if (count($parts) !== 2) {
            return;
        }

        [$selector, $validatorHex] = $parts;
        if (!ctype_xdigit($validatorHex) || strlen($validatorHex) !== 64) {
            setcookie('remember_me', '', time() - 3600, '/');
            return;
        }

        $hashedValidator = hash('sha256', hex2bin($validatorHex));

        $stmt = $db->prepare("SELECT user_id, hashed_validator FROM user_tokens WHERE selector = ? AND expires_at > NOW()");
        $stmt->execute([$selector]);
        $token = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($token && hash_equals($token['hashed_validator'], $hashedValidator)) {
            $_SESSION['user_id'] = (int) $token['user_id'];
        } else {
            setcookie('remember_me', '', [
                'expires' => time() - 3600,
                'path' => '/',
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
        }
    }
}
