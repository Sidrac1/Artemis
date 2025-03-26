<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getLastAlerts();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getLastAlerts() {
    global $pdo;
    
    // Consulta SQL para obtener las últimas alertas
    $stmt = $pdo->query("
        SELECT 
            ar.nombre AS area, 
            DATE_FORMAT(la.fecha, '%d/%m/%Y') AS fecha,
            la.hora,
            al.descripcion
        FROM 
            log_acceso la
        JOIN 
            acceso a ON la.id_registro = a.id_registro
        JOIN 
            area ar ON a.codigo_area = ar.codigo_area
        JOIN 
            alerta al ON la.id_registro = al.id_registro
        ORDER BY 
            al.id DESC
        LIMIT 10;
    ");
    
    $last_alerts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($last_alerts);
}
?>
