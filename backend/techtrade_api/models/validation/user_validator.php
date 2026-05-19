<?php

class UserValidator
{
    private PDO $db;
    private array $errors = [];

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function validate(array $data): bool
    {
        if (empty(trim($data['firstName'] ?? ''))) {
            $this->errors[] = "First name field cannot be empty.";
        }

        if (empty(trim($data['lastName'] ?? ''))) {
            $this->errors[] = "Last name field cannot be empty.";
        }

        if (!filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "Please enter a valid email address.";
        } else {
            // Using positional (?) parameter style
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
            $stmt->execute([$data['email']]);

            if ($stmt->fetch()) {
                $this->errors[] = "An account with this email address already exists.";
            }
        }

        $password = $data['password'] ?? '';
        $errors = [];

        if (strlen($password) < MIN_PASSWORD_LENGTH) {
            $errors[] = "Password must be at least " . MIN_PASSWORD_LENGTH . " characters.";
        }
        if (REQUIRE_UPPERCASE && !preg_match('/[A-Z]/', $password)) {
            $errors[] = "Password must include at least one uppercase letter.";
        }
        if (REQUIRE_NUMBER && !preg_match('/[0-9]/', $password)) {
            $errors[] = "Password must include at least one number.";
        }
        if (REQUIRE_SYMBOL && !preg_match('/[^A-Za-z0-9]/', $password)) {
            $errors[] = "Password must include at least one symbol.";
        }

        if (!empty($errors)) {
            $this->errors = array_merge($this->errors, $errors);
        }

        if (!preg_match('/^(?:\+27|0)[6-8][0-9]{8}$/', $data['mobile'] ?? '')) {
            $this->errors[] = "Please enter a valid South African mobile number (e.g., 0611234567 or +27611234567).";
        }

        if (!in_array($data['province'] ?? '', SOUTH_AFRICAN_PROVINCES)) {
            $this->errors[] = "Please select a valid South African province location.";
        }

        if (!in_array($data['regType'] ?? '', ['buyer', 'seller', 'both'])) {
            $this->errors[] = "Invalid account role type selection.";
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}