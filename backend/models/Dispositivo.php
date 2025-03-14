<!-- EJEMPLO DE MODELO -->

<!--El modelo Dispositivo.php es responsable de interactuar con la base de datos. 
Aquí defines la lógica para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) 
relacionadas con los dispositivos.-->


<?php
// back-end/models/Dispositivo.php
class Dispositivo {
    private $db;

    // Constructor: Recibe la conexión a la base de datos
    public function __construct($db) {
        $this->db = $db;
    }

    // Obtener todos los dispositivos
    public function getAll() {
        $query = "SELECT * FROM dispositivos";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un dispositivo por ID
    public function getById($id) {
        $query = "SELECT * FROM dispositivos WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Crear un nuevo dispositivo
    public function create($nombre, $ubicacion) {
        $query = "INSERT INTO dispositivos (nombre, ubicacion) VALUES (:nombre, :ubicacion)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);
        return $stmt->execute();
    }

    // Actualizar un dispositivo
    public function update($id, $nombre, $ubicacion) {
        $query = "UPDATE dispositivos SET nombre = :nombre, ubicacion = :ubicacion WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);
        return $stmt->execute();
    }

    // Eliminar un dispositivo
    public function delete($id) {
        $query = "DELETE FROM dispositivos WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>