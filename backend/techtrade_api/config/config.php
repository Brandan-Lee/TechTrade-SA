<?php

define('MIN_PASSWORD_LENGTH', 8);
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'webp']);
define('MAX_IMAGE_SIZE', 2 * 1024 * 1024);

// Valid South African Provinces
define('SOUTH_AFRICAN_PROVINCES', ['GP', 'EC', 'FS', 'KZN', 'LIM', 'MPU', 'NW', 'NC', 'WC']);

// Penalty and Data Retention Rules ---
define('SUSPENSION_STRIKE_THRESHOLD', 3);
define('SUSPENSION_DURATION_DAYS', 30);
define('BAN_STRIKE_THRESHOLD', 4);
define('DATA_RETENTION_YEARS', 7);

// Cookie security settings
define('SECURE_COOKIES_ONLY', false); //change later for hosting
define('COOKIE_SAMESITE', 'Lax');

function setFrontendCookie(string $name, string $value, int $durationInSeconds = 3600): void
{
    setcookie($name, $value, [
        'expires' => time() + $durationInSeconds,
        'path' => '/',
        'domain' => $_SERVER['SERVER_NAME'],
        'secure' => SECURE_COOKIES_ONLY,
        'httponly' => false,
        'samesite' => COOKIE_SAMESITE
    ]);
}

function getEnvVariable(string $key, string $fallback = ''): string
{
    $envPath = __DIR__ . '/../.env';

    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0)
                continue;

            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);

                if (trim($name) === $key) {
                    return trim($value, " \t\n\r\0\x0B\"'");
                }
            }
        }
    }
    return $fallback;
}

$rawBase64Key = getEnvVariable('APP_ENCRYPTION_KEY');

if (empty($rawBase64Key)) {
    die(json_encode(["status" => "error", "message" => "Critical configuration error: Encryption key missing."]));
}

define('ENCRYPTION_KEY', base64_decode($rawBase64Key));

?>