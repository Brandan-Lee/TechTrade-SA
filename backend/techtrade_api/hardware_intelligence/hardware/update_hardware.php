<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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

    if (!$payload || !isset($payload['category']) || !isset($payload['id']) || !isset($payload['fields'])) {
        http_response_code(400);
        throw new Exception("The information sent from the form is incomplete or poorly formatted.");
    }

    $categorySlug = trim($payload['category']);
    $itemId = intval($payload['id']);
    $formFields = $payload['fields'];

    if (empty($categorySlug) || $itemId <= 0 || !is_array($formFields)) {
        throw new Exception("Required item identification numbers or category names are missing.");
    }

    $categoryQuery = $db->prepare("SELECT spec_table FROM categories WHERE slug = ? LIMIT 1");
    $categoryQuery->execute([$categorySlug]);
    $categoryData = $categoryQuery->fetch(PDO::FETCH_ASSOC);

    if (!$categoryData) {
        http_response_code(404);
        throw new Exception("The requested hardware category could not be found.");
    }

    $specificTableName = $categoryData['spec_table'];

    $db->beginTransaction();

    $mainTableData = [
        'brand'      => trim($formFields['brand'] ?? ''),
        'model'      => trim($formFields['model'] ?? ''),
        'full_name'  => trim($formFields['full_name'] ?? ''),
        'msrp_cents' => ($formFields['msrp_cents'] === null || $formFields['msrp_cents'] === '') ? null : intval($formFields['msrp_cents']),
        'is_active'  => intval($formFields['is_active'] ?? 1),
        'id'         => $itemId
    ];

    if (empty($mainTableData['brand']) || empty($mainTableData['model']) || empty($mainTableData['full_name'])) {
        throw new Exception("Brand, Model, and Full Name cannot be left completely blank.");
    }

    $mainUpdateQuery = "UPDATE hardware SET 
                        brand = :brand, 
                        model = :model, 
                        full_name = :full_name, 
                        msrp_cents = :msrp_cents, 
                        is_active = :is_active 
                      WHERE id = :id";

    $mainStatement = $db->prepare($mainUpdateQuery);
    $mainStatement->execute($mainTableData);

    if (!empty($specificTableName) && preg_match('/^[a-zA-Z0-9_]+$/', $specificTableName)) {

        $layoutQuery = $db->prepare("DESCRIBE {$specificTableName}");
        $layoutQuery->execute();
        $validColumns = $layoutQuery->fetchAll(PDO::FETCH_COLUMN);

        $columnsToUpdate = [];
        $queryValues = [':hardware_id' => $itemId];

        $mainTableFields = ['brand', 'model', 'full_name', 'msrp_cents', 'is_active', 'slug'];

        foreach ($validColumns as $columnName) {
            if ($columnName === 'hardware_id' || in_array($columnName, $mainTableFields)) {
                continue;
            }

            if (array_key_exists($columnName, $formFields)) {
                $currentValue = $formFields[$columnName];

                if ($currentValue === '' || $currentValue === null) {
                    $columnsToUpdate[] = "{$columnName} = NULL";
                } else {
                    $columnsToUpdate[] = "{$columnName} = :{$columnName}";
                    $queryValues[":{$columnName}"] = trim($currentValue);
                }
            }
        }

        if (!empty($columnsToUpdate)) {
            $subTableQuery = "UPDATE {$specificTableName} SET " . implode(", ", $columnsToUpdate) . " WHERE hardware_id = :hardware_id";
            $subStatement = $db->prepare($subTableQuery);
            $subStatement->execute($queryValues);
        }
    }

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Component information updated successfully."
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
    echo json_encode(["success" => false, "error" => "An unexpected system error occurred while saving. Please try again."]);
}
