<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

function makeSlug($text)
{
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return empty($text) ? 'n-a' : $text;
}

try {
    require_once __DIR__ . '/../../config/config.php';
    require_once __DIR__ . '/../../models/validation/database.php';
    require_once __DIR__ . '/../../models/helpers/session_manager.php';
    require_once __DIR__ . '/../../models/authentication/user.php';

    $db = Database::getConnection();
    if (!$db) {
        throw new Exception("Could not connect to the database.");
    }

    SessionManager::init($db);
    if (!isset($_SESSION['user_id'])) {
        http_response_code(419);
        echo json_encode(["error" => "Your session has expired. Please log in again."]);
        exit();
    }

    $user = User::findById($db, $_SESSION['user_id']);
    if (!$user) {
        http_response_code(403);
        echo json_encode(["error" => "Access denied."]);
        exit();
    }

    $rawInput = file_get_contents("php://input");
    $payload = json_decode($rawInput, true);

    if (!$payload || !isset($payload['category']) || !isset($payload['fields'])) {
        http_response_code(400);
        throw new Exception("The information sent from the form is incomplete or poorly formatted.");
    }

    $categorySlug = trim($payload['category']);
    $formFields = $payload['fields'];

    if (empty($categorySlug) || !is_array($formFields)) {
        throw new Exception("Required category selections or field values are missing.");
    }

    $categoryQuery = $db->prepare("SELECT id, spec_table FROM categories WHERE slug = ? LIMIT 1");
    $categoryQuery->execute([$categorySlug]);
    $categoryData = $categoryQuery->fetch(PDO::FETCH_ASSOC);

    if (!$categoryData) {
        http_response_code(404);
        throw new Exception("The requested hardware category could not be found.");
    }

    $categoryId = intval($categoryData['id']);
    $specificTableName = $categoryData['spec_table'];

    $fullNameInput = trim($formFields['full_name'] ?? '');
    if (empty($fullNameInput)) {
        throw new Exception("The Full System Name is required to build database entries.");
    }
    $generatedSlug = makeSlug($fullNameInput);

    $db->beginTransaction();

    $mainTableData = [
        'category_id' => $categoryId,
        'brand'       => trim($formFields['brand'] ?? ''),
        'model'       => trim($formFields['model'] ?? ''),
        'full_name'   => $fullNameInput,
        'slug'        => $generatedSlug,
        'msrp_cents'  => ($formFields['msrp_cents'] === null || $formFields['msrp_cents'] === '') ? null : intval($formFields['msrp_cents']),
        'is_active'   => intval($formFields['is_active'] ?? 1)
    ];

    if (empty($mainTableData['brand']) || empty($mainTableData['model'])) {
        throw new Exception("Brand and Model definitions cannot be saved completely blank.");
    }

    $mainInsertQuery = "INSERT INTO hardware (category_id, brand, model, full_name, slug, msrp_cents, is_active) 
                        VALUES (:category_id, :brand, :model, :full_name, :slug, :msrp_cents, :is_active)";

    $mainStatement = $db->prepare($mainInsertQuery);
    $mainStatement->execute($mainTableData);

    $newHardwareId = $db->lastInsertId();

    if (!empty($specificTableName) && preg_match('/^[a-zA-Z0-9_]+$/', $specificTableName)) {

        $layoutQuery = $db->prepare("DESCRIBE {$specificTableName}");
        $layoutQuery->execute();
        $validColumns = $layoutQuery->fetchAll(PDO::FETCH_COLUMN);

        $insertColumns = ['hardware_id'];
        $insertPlaceholders = [':hardware_id'];
        $queryValues = [':hardware_id' => $newHardwareId];

        $mainTableFields = ['brand', 'model', 'full_name', 'msrp_cents', 'is_active', 'slug', 'category_id'];

        foreach ($validColumns as $columnName) {
            if ($columnName === 'hardware_id' || in_array($columnName, $mainTableFields)) {
                continue;
            }

            if (array_key_exists($columnName, $formFields)) {
                $currentValue = $formFields[$columnName];

                if ($currentValue !== '' && $currentValue !== null) {
                    $insertColumns[] = $columnName;
                    $insertPlaceholders[] = ":{$columnName}";
                    $queryValues[":{$columnName}"] = trim($currentValue);
                }
            }
        }

        $subTableQuery = "INSERT INTO {$specificTableName} (" . implode(", ", $insertColumns) . ") 
                          VALUES (" . implode(", ", $insertPlaceholders) . ")";
        $subStatement = $db->prepare($subTableQuery);
        $subStatement->execute($queryValues);
    }

    $db->commit();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "New hardware component registered successfully."
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} catch (Throwable $t) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "An unexpected system error occurred while registering the component. Please try again."]);
}
