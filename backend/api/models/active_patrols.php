<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getRouteSchedule();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRouteSchedule() {
    global $pdo;
    
    try {
        // Consulta SQL para obtener el horario de rutas
        $stmt = $pdo->prepare("SELECT 
            rd.nombre AS nombre,
            CONCAT(gs.nombre, ' ', gs.apellido_paterno, ' ', gs.apellido_materno) AS guard,
            rd.hora_inicio AS start,
            rd.hora_fin AS end,
            rd.secuencia AS sectors,
            rd.intervalos AS frequency
        FROM ronda rd
        JOIN ronda_guardia rg ON rd.codigo = rg.codigo_ronda
        JOIN guardia_seguridad gs ON rg.id_guardia = gs.ID
        WHERE rd.estado = 1
        ORDER BY rd.codigo DESC");
        
        $stmt->execute();
        $route_schedule = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($route_schedule);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}