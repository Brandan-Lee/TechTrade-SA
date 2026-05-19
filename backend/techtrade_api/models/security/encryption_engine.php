<?php

class EncryptionEngine
{
    private string $encryptionKey;
    private string $cipherMethod = 'AES-256-CBC';

    public function __construct(string $secretKey)
    {
        $this->encryptionKey = $secretKey;
    }

    public function encrypt(string $plainText): string
    {
        $ivLength = openssl_cipher_iv_length($this->cipherMethod);
        $iv = openssl_random_pseudo_bytes($ivLength);

        $encryptedRaw = openssl_encrypt($plainText, $this->cipherMethod, $this->encryptionKey, OPENSSL_RAW_DATA, $iv);

        return base64_encode($iv . $encryptedRaw);
    }

    public function decrypt(string $cipherText): ?string
    {
        $mix = base64_decode($cipherText);
        $ivLength = openssl_cipher_iv_length($this->cipherMethod);

        if (strlen($mix) <= $ivLength) {
            return null;
        }

        $iv = substr($mix, 0, $ivLength);
        $encryptedRaw = substr($mix, $ivLength);

        $decrypted = openssl_decrypt($encryptedRaw, $this->cipherMethod, $this->encryptionKey, OPENSSL_RAW_DATA, $iv);

        return $decrypted !== false ? $decrypted : null;
    }
}

?>