<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getEmpleados();
        break;
    case 'POST':
        createEmpleado();
        break;
    case 'PUT':
        updateEmpleado();
        break;
    case 'DELETE':
        deleteEmpleado();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getEmpleados() {
    global $pdo;
    $stmt = $pdo->query("SELECT e.ID, e.nombre, e.apellido_paterno, e.apellido_materno, e.codigo_puesto, p.nombre_puesto AS puesto FROM empleado e LEFT JOIN puesto p ON e.codigo_puesto = p.codigo");
    $empleados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($empleados);
}

function createEmpleado() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $nombre = $data->nombre;
    $apellido_paterno = $data->apellido_paterno;
    $apellido_materno = $data->apellido_materno;
    $codigo_puesto = $data->codigo_puesto;

    $stmt = $pdo->prepare("INSERT INTO empleado (nombre, apellido_paterno, apellido_materno, codigo_puesto) VALUES (?, ?, ?, ?)");
    $stmt->execute([$nombre, $apellido_paterno, $apellido_materno, $codigo_puesto]);
    echo json_encode(["message" => "Empleado creado"]);
}

function updateEmpleado() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $nombre = $data->nombre;
    $apellido_paterno = $data->apellido_paterno;
    $apellido_materno = $data->apellido_materno;
    $codigo_puesto = $data->codigo_puesto;

    $stmt = $pdo->prepare("UPDATE empleado SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, codigo_puesto = ? WHERE ID = ?");
    $stmt->execute([$nombre, $apellido_paterno, $apellido_materno, $codigo_puesto, $id]);
    echo json_encode(["message" => "Empleado actualizado"]);
}

function deleteEmpleado() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM empleado WHERE ID = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Empleado eliminado"]);
}
?>
