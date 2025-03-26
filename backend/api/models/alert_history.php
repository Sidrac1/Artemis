<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAlertHistory();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getAlertHistory() {
    global $pdo;
    
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
    ");
    
    $alert_history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($alert_history);
}
?>
