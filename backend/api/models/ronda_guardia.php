<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getRondaGuardia();
        break;
    case 'POST':
        createRondaGuardia();
        break;
    case 'PUT':
        updateRondaGuardia();
        break;
    case 'DELETE':
        deleteRondaGuardia();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRondaGuardia() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM ronda_guardia");
    $rondasGuardias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rondasGuardias);
}

function createRondaGuardia() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo_ronda = $data->codigo_ronda;
    $id_guardia = $data->id_guardia;

    $stmt = $pdo->prepare("INSERT INTO ronda_guardia (codigo_ronda, id_guardia) VALUES (?, ?)");
    $stmt->execute([$codigo_ronda, $id_guardia]);
    echo json_encode(["message" => "Ronda-Guardia asignada"]);
}

function updateRondaGuardia() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $numero = $data->numero;
    $codigo_ronda = $data->codigo_ronda;
    $id_guardia = $data->id_guardia;

    $stmt = $pdo->prepare("UPDATE ronda_guardia SET codigo_ronda = ?, id_guardia = ? WHERE numero = ?");
    $stmt->execute([$codigo_ronda, $id_guardia, $numero]);
    echo json_encode(["message" => "Ronda-Guardia actualizada"]);
}

function deleteRondaGuardia() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $numero = $data->numero;

    $stmt = $pdo->prepare("DELETE FROM ronda_guardia WHERE numero = ?");
    $stmt->execute([$numero]);
    echo json_encode(["message" => "Ronda-Guardia eliminada"]);
}
?>
