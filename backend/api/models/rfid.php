<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getRFID();
        break;
    case 'POST':
        createRFID();
        break;
    case 'PUT':
        updateRFID();
        break;
    case 'DELETE':
        deleteRFID();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRFID() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM rfid");
    $rfid = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rfid);
}

function createRFID() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $estado = $data->estado;
    $codigo_rfid = $data->codigo_rfid;
    $fecha_registro = $data->fecha_registro;
    $tipo = $data->tipo;
    $id_empleado = $data->id_empleado;

    $stmt = $pdo->prepare("INSERT INTO rfid (estado, codigo_rfid, fecha_registro, tipo, id_empleado) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$estado, $codigo_rfid, $fecha_registro, $tipo, $id_empleado]);
    echo json_encode(["message" => "RFID creado"]);
}

function updateRFID() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id_RFID = $data->id_RFID;
    $estado = $data->estado;
    $codigo_rfid = $data->codigo_rfid;
    $fecha_registro = $data->fecha_registro;
    $tipo = $data->tipo;
    $id_empleado = $data->id_empleado;

    $stmt = $pdo->prepare("UPDATE rfid SET estado = ?, codigo_rfid = ?, fecha_registro = ?, tipo = ?, id_empleado = ? WHERE id_RFID = ?");
    $stmt->execute([$estado, $codigo_rfid, $fecha_registro, $tipo, $id_empleado, $id_RFID]);
    echo json_encode(["message" => "RFID actualizado"]);
}

function deleteRFID() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id_RFID = $data->id_RFID;

    $stmt = $pdo->prepare("DELETE FROM rfid WHERE id_RFID = ?");
    $stmt->execute([$id_RFID]);
    echo json_encode(["message" => "RFID eliminado"]);
}
?>
