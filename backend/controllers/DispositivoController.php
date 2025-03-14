<!-- EJEMPLO DE CONTROLLER PARA DISPOSITIVOS-->

<!-- El controlador DispositivoController.php maneja las solicitudes HTTP relacionadas con los dispositivos. 
 Aquí defines las acciones que responden a las rutas de tu API (por ejemplo, obtener, crear, actualizar o eliminar dispositivos). -->

 <?php
// back-end/controllers/DispositivoController.php
require_once '../models/Dispositivo.php'; // Importa el modelo Dispositivo

class DispositivoController {
    private $dispositivoModel;

    // Constructor: Recibe la conexión a la base de datos y crea una instancia del modelo
    public function __construct($db) {
        $this->dispositivoModel = new Dispositivo($db);
    }

    // Obtener todos los dispositivos
    public function index() {
        $dispositivos = $this->dispositivoModel->getAll();
        echo json_encode($dispositivos);
    }

    // Obtener un dispositivo por ID
    public function show($id) {
        if (!is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['message' => 'ID inválido']);
            return;
        }

        $dispositivo = $this->dispositivoModel->getById($id);
        if ($dispositivo) {
            echo json_encode($dispositivo);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Dispositivo no encontrado']);
        }
    }

    // Crear un nuevo dispositivo
    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);

        // Validar datos de entrada
        if (empty($data['nombre']) || empty($data['ubicacion'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Nombre y ubicación son obligatorios']);
            return;
        }

        $nombre = $data['nombre'];
        $ubicacion = $data['ubicacion'];

        if ($this->dispositivoModel->create($nombre, $ubicacion)) {
            http_response_code(201);
            echo json_encode(['message' => 'Dispositivo creado']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error al crear el dispositivo']);
        }
    }

    // Actualizar un dispositivo
    public function update($id) {
        if (!is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['message' => 'ID inválido']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        // Validar datos de entrada
        if (empty($data['nombre']) || empty($data['ubicacion'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Nombre y ubicación son obligatorios']);
            return;
        }

        $nombre = $data['nombre'];
        $ubicacion = $data['ubicacion'];

        if ($this->dispositivoModel->update($id, $nombre, $ubicacion)) {
            echo json_encode(['message' => 'Dispositivo actualizado']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error al actualizar el dispositivo']);
        }
    }

    // Eliminar un dispositivo
    public function destroy($id) {
        if (!is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['message' => 'ID inválido']);
            return;
        }

        if ($this->dispositivoModel->delete($id)) {
            echo json_encode(['message' => 'Dispositivo eliminado']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error al eliminar el dispositivo']);
        }
    }
}
?>