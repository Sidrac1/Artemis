<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "prueba"; // Cambia esto al nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Cerrar conexión (descomenta cuando termines de usarla)
// $conn->close();
?>
