<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

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
        echo json_encode(["error" => "Your session has expired."]);
        exit();
    }

    $user = User::findById($db, $_SESSION['user_id']);
    if (!$user) {
        http_response_code(403);
        echo json_encode(["error" => "Access denied."]);
        exit();
    }

    $slug = isset($_GET['category']) ? trim($_GET['category']) : 'all';
    $searchText = isset($_GET['search']) ? trim($_GET['search']) : '';

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 10;
    $offset = ($page - 1) * $limit;

    $items = [];
    $totalItems = 0;
    $categoryName = "All Inventory";
    $queryParams = [];

    $searchPattern = '';
    if (!empty($searchText)) {
        $words = explode(' ', $searchText);
        $sanitizedWords = [];
        foreach ($words as $word) {
            $cleaned = preg_replace('/[^a-zA-Z0-9]/', '', $word);
            if (!empty($cleaned)) {
                $sanitizedWords[] = $cleaned . '*';
            }
        }
        if (!empty($sanitizedWords)) {
            $searchPattern = implode(' ', $sanitizedWords);
        }
    }

    if ($slug === 'all' || empty($slug)) {
        $countQuery = "SELECT COUNT(h.id) FROM hardware h WHERE 1=1";

        $dataQuery = "SELECT h.*, c.slug as category,
                             IF(
                                 cp.hardware_id IS NOT NULL OR 
                                 gp.hardware_id IS NOT NULL OR 
                                 mb.hardware_id IS NOT NULL OR 
                                 mem.hardware_id IS NOT NULL OR 
                                 ssd.hardware_id IS NOT NULL OR 
                                 hdd.hardware_id IS NOT NULL OR 
                                 cf.hardware_id IS NOT NULL OR 
                                 aio.hardware_id IS NOT NULL OR 
                                 ac.hardware_id IS NOT NULL OR 
                                 psu.hardware_id IS NOT NULL OR 
                                 cas.hardware_id IS NOT NULL, 
                                 1, 0
                             ) as has_specs,
                             cp.socket AS cpu_socket, cp.cores, cp.threads, cp.architecture, cp.base_clock_ghz, cp.boost_clock_ghz, cp.tdp_watts, cp.integrated_graphics, cp.unlocked,
                             gp.chipset AS gpu_chipset, gp.vram_gb, gp.vram_type, gp.core_clock_mhz, gp.boost_clock_mhz, gp.pcie_version, gp.power_connectors, gp.tdp_watts AS gpu_tdp, gp.outputs, gp.length_mm, gp.slot_width,
                             mb.socket AS mobo_socket, mb.chipset AS mobo_chipset, mb.form_factor AS mobo_form_factor, mb.memory_type AS mobo_memory_type, mb.memory_slots, mb.max_memory_gb, mb.pcie_x16_slots, mb.m2_slots, mb.sata_ports, mb.wifi,
                             mem.memory_type, mem.capacity_gb AS ram_capacity, mem.kit_modules, mem.speed_mhz, mem.cas_latency, mem.voltage, mem.rgb AS ram_rgb,
                             ssd.capacity_gb AS ssd_capacity, ssd.interface_type AS ssd_interface, ssd.form_factor AS ssd_form_factor, ssd.nand_type, ssd.pcie_gen, ssd.read_speed_mbps, ssd.write_speed_mbps,
                             hdd.capacity_gb AS hdd_capacity, hdd.rpm, hdd.cache_mb, hdd.form_factor AS hdd_form_factor, hdd.interface_type AS hdd_interface,
                             cf.size_mm AS fan_size, cf.max_rpm, cf.airflow_cfm, cf.noise_db, cf.pwm, cf.rgb AS fan_rgb,
                             aio.radiator_mm, aio.fan_count AS aio_fan_count, aio.fan_size_mm AS aio_fan_size, aio.socket_compatibility AS aio_sockets, aio.rgb AS aio_rgb,
                             ac.height_mm AS cooler_height, ac.fan_count AS cooler_fan_count, ac.fan_size_mm AS cooler_fan_size, ac.tdp_rating_watts, ac.socket_compatibility AS cooler_sockets, ac.rgb AS cooler_rgb,
                             psu.wattage, psu.efficiency_rating, psu.modular_type, psu.form_factor AS psu_form_factor, psu.pcie_connectors, psu.sata_connectors,
                             cas.form_factor AS case_form_factor, cas.side_panel, cas.max_gpu_length_mm, cas.max_cooler_height_mm, cas.drive_bays_3_5, cas.drive_bays_2_5, cas.dimensions
                      FROM hardware h
                      INNER JOIN categories c ON h.category_id = c.id
                      LEFT JOIN cpus cp ON h.id = cp.hardware_id
                      LEFT JOIN gpus gp ON h.id = gp.hardware_id
                      LEFT JOIN motherboards mb ON h.id = mb.hardware_id
                      LEFT JOIN memory mem ON h.id = mem.hardware_id
                      LEFT JOIN ssds ssd ON h.id = ssd.hardware_id
                      LEFT JOIN hdds hdd ON h.id = hdd.hardware_id
                      LEFT JOIN `case_fans` cf ON h.id = cf.hardware_id
                      LEFT JOIN aios aio ON h.id = aio.hardware_id
                      LEFT JOIN `air_coolers` ac ON h.id = ac.hardware_id
                      LEFT JOIN psus psu ON h.id = psu.hardware_id
                      LEFT JOIN `pc_cases` cas ON h.id = cas.hardware_id
                      WHERE 1=1";

        if (!empty($searchPattern)) {
            $searchFilter = " AND MATCH(h.brand, h.model, h.full_name) AGAINST(:search IN BOOLEAN MODE)";
            $countQuery .= $searchFilter;
            $dataQuery .= $searchFilter;
            $queryParams[':search'] = $searchPattern;
        }

        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($queryParams);
        $totalItems = intval($countStmt->fetchColumn());

        $sessionSeed = crc32(session_id());

        $dataQuery .= " ORDER BY RAND({$sessionSeed}) LIMIT {$limit} OFFSET {$offset}";

        $dataStmt = $db->prepare($dataQuery);
        $dataStmt->execute($queryParams);
        $items = $dataStmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $categoryStmt = $db->prepare("SELECT id, name, spec_table FROM categories WHERE slug = ? LIMIT 1");
        $categoryStmt->execute([$slug]);
        $category = $categoryStmt->fetch(PDO::FETCH_ASSOC);

        if (!$category) {
            http_response_code(404);
            throw new Exception("The requested category could not be found.");
        }

        $categoryId = intval($category['id']);
        $specTable = $category['spec_table'];
        $categoryName = $category['name'];

        $queryParams[':category_id'] = $categoryId;
        $countQuery = "SELECT COUNT(h.id) FROM hardware h WHERE h.category_id = :category_id";

        if (!empty($specTable) && preg_match('/^[a-zA-Z0-9_]+$/', $specTable)) {
            $dataQuery = "SELECT h.*, s.*, 1 AS has_specs FROM hardware h 
                          INNER JOIN {$specTable} s ON h.id = s.hardware_id 
                          WHERE h.category_id = :category_id";
        } else {
            $dataQuery = "SELECT h.*, 0 AS has_specs FROM hardware h WHERE h.category_id = :category_id";
        }

        if (!empty($searchPattern)) {
            $searchFilter = " AND MATCH(h.brand, h.model, h.full_name) AGAINST(:search IN BOOLEAN MODE)";
            $countQuery .= $searchFilter;
            $dataQuery .= $searchFilter;
            $queryParams[':search'] = $searchPattern;
        }

        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($queryParams);
        $totalItems = intval($countStmt->fetchColumn());

        $dataQuery .= " ORDER BY h.id DESC LIMIT {$limit} OFFSET {$offset}";
        $dataStmt = $db->prepare($dataQuery);
        $dataStmt->execute($queryParams);
        $items = $dataStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "category_name" => $categoryName,
        "total_items" => $totalItems,
        "items" => $items
    ]);
} catch (Exception $e) {
    if (http_response_code() === 200) {
        http_response_code(400);
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "An internal system error occurred while fetching hardware items."]);
}
