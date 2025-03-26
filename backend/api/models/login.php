<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    login();
} else {
    echo json_encode(["message" => "Método no permitido"]);
}

function login() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $correo = $data->correo;
    $contrasena = $data->contrasena;

    if (empty($correo) || empty($contrasena)) {
        echo json_encode(["message" => "Correo y contraseña son requeridos"]);
        return;
    }

    $stmt = $pdo->prepare("SELECT id_empleado, rol FROM login WHERE correo = ? AND contrasena = ?");
    $stmt->execute([$correo, $contrasena]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["message" => "Inicio de sesión exitoso", "id_empleado" => $user['id_empleado'], "rol" => $user['rol']]);
    } else {
        echo json_encode(["message" => "Credenciales incorrectas"]);
    }
}
?>