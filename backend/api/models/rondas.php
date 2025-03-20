<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getRonda();
        break;
    case 'POST':
        createRonda();
        break;
    case 'PUT':
        updateRonda();
        break;
    case 'DELETE':
        deleteRonda();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRonda() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM ronda");
    $rondas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rondas);
}

function createRonda() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $hora_inicio = $data->hora_inicio;
    $hora_fin = $data->hora_fin;
    $intervalos = $data->intervalos;
    $codigo_ruta = $data->codigo_ruta;

    $stmt = $pdo->prepare("INSERT INTO ronda (hora_inicio, hora_fin, intervalos, codigo_ruta) VALUES (?, ?, ?, ?)");
    $stmt->execute([$hora_inicio, $hora_fin, $intervalos, $codigo_ruta]);
    echo json_encode(["message" => "Ronda creada"]);
}

function updateRonda() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;
    $hora_inicio = $data->hora_inicio;
    $hora_fin = $data->hora_fin;
    $intervalos = $data->intervalos;
    $codigo_ruta = $data->codigo_ruta;

    $stmt = $pdo->prepare("UPDATE ronda SET hora_inicio = ?, hora_fin = ?, intervalos = ?, codigo_ruta = ? WHERE codigo = ?");
    $stmt->execute([$hora_inicio, $hora_fin, $intervalos, $codigo_ruta, $codigo]);
    echo json_encode(["message" => "Ronda actualizada"]);
}

function deleteRonda() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;

    $stmt = $pdo->prepare("DELETE FROM ronda WHERE codigo = ?");
    $stmt->execute([$codigo]);
    echo json_encode(["message" => "Ronda eliminada"]);
}
?>
