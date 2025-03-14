<!-- EJEMPLO DE ENDPOINT PARA DISPOSITIVOS-->

<!-- El archivo dispositivos.php es el punto de entrada para las solicitudes HTTP relacionadas con los dispositivos. 
 Aquí se define cómo se manejan las rutas y se llama al controlador correspondiente. -->

<?php
// back-end/api/dispositivos.php
require_once '../controllers/DispositivoController.php';
require_once '../models/Dispositivo.php';

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'tu_base_de_datos';
$user = 'usuario';
$password = 'contraseña';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error de conexión a la base de datos']);
    exit;
}

// Crear una instancia del controlador
$dispositivoController = new DispositivoController($db);

// Obtener la ruta y el método de la solicitud
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Manejar las solicitudes HTTP
if ($requestMethod === 'GET') {
    // Obtener todos los dispositivos
    if ($requestUri === '/api/dispositivos') {
        $dispositivoController->index();
    }
    // Obtener un dispositivo por ID
    elseif (preg_match('/^\/api\/dispositivos\/(\d+)$/', $requestUri, $matches)) {
        $id = $matches[1];
        $dispositivoController->show($id);
    }
} elseif ($requestMethod === 'POST') {
    // Crear un nuevo dispositivo
    if ($requestUri === '/api/dispositivos') {
        $dispositivoController->store();
    }
} elseif ($requestMethod === 'PUT') {
    // Actualizar un dispositivo
    if (preg_match('/^\/api\/dispositivos\/(\d+)$/', $requestUri, $matches)) {
        $id = $matches[1];
        $dispositivoController->update($id);
    }
} elseif ($requestMethod === 'DELETE') {
    // Eliminar un dispositivo
    if (preg_match('/^\/api\/dispositivos\/(\d+)$/', $requestUri, $matches)) {
        $id = $matches[1];
        $dispositivoController->destroy($id);
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(['message' => 'Método no permitido']);
}
?>