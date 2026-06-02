<?php

$configFile = dirname(__DIR__, 2) . '/config/config.php';

if (!file_exists($configFile)) {
    die("Setup Error: Could not find config.php at: " . $configFile);
}

require_once $configFile;


class AvatarUploader
{
    private string $targetDirectory;


    public function __construct(?string $targetDirectory = null)
    {
        $this->targetDirectory = $targetDirectory ?? getUploadFolderPath('avatars');

        if (!str_ends_with($this->targetDirectory, DIRECTORY_SEPARATOR)) {
            $this->targetDirectory .= DIRECTORY_SEPARATOR;
        }

        if (!is_dir($this->targetDirectory)) {
            mkdir($this->targetDirectory, 0755, true);
        }
    }

    public function upload(array $fileData): ?string
    {
        if ($fileData['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("An error occurred while transferring your image. Please try again.");
        }

        if ($fileData['size'] > MAX_IMAGE_SIZE) {
            throw new Exception("The profile image is too large. The maximum size limit is 2MB.");
        }

        $fileExtension = strtolower(pathinfo($fileData['name'], PATHINFO_EXTENSION));

        if (!in_array($fileExtension, ALLOWED_IMAGE_TYPES)) {
            throw new Exception("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
        }

        $newFileName = bin2hex(random_bytes(16)) . '.' . $fileExtension;
        $fullDestinationPath = $this->targetDirectory . $newFileName;

        if (!move_uploaded_file($fileData['tmp_name'], $fullDestinationPath)) {
            throw new Exception("We couldn't save your profile image. Please try again.");
        }

        return 'uploads/avatars/' . $newFileName;
    }
}
