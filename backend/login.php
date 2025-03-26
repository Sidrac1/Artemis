<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

error_log("login.php: Starting execution");

$dbFilePath = 'api/config/db.php';
if (!file_exists($dbFilePath)) {
    error_log("login.php: Error - db.php not found at " . $dbFilePath);
    echo json_encode(["message" => "Error: db.php not found"]);
    exit;
}

include_once $dbFilePath;

error_log("login.php: db.php included");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    error_log("login.php: Method is POST");
    if (isset($_GET['action']) && $_GET['action'] === 'checkEmail') {
        checkEmail();
    } else {
        login();
    }
} else {
    error_log("login.php: Method is not POST");
    echo json_encode(["message" => "Método no permitido"]);
}

function login() {
    global $pdo;

    error_log("login.php: login() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error: " . json_last_error_msg());
        echo json_encode(["message" => "Error: Invalid JSON data"]);
        return;
    }

    $correo = $data->correo;
    $contrasena = $data->contrasena;

    if (empty($correo) || empty($contrasena)) {
        error_log("login.php: Email or password missing");
        echo json_encode(["message" => "Correo y contraseña son requeridos"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT l.id_empleado, e.rol, l.contrasena
            FROM login l
            INNER JOIN empleado e ON l.id_empleado = e.ID
            WHERE l.correo = ?
        ");
        $stmt->execute([$correo]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Verificar si la contraseña almacenada parece ser un hash SHA256 (longitud típica)
            if (strlen($user['contrasena']) === 64) {
                // Hashear la contraseña ingresada con SHA256
                $hashedInputPassword = hash('sha256', $contrasena);
                // Comparar el hash de la entrada con el hash almacenado
                if ($hashedInputPassword === $user['contrasena']) {
                    error_log("login.php: Login successful (SHA256 hashed password)");
                    echo json_encode([
                        "message" => "Inicio de sesión exitoso",
                        "id_empleado" => $user['id_empleado'],
                        "rol" => $user['rol']
                    ]);
                } else {
                    error_log("login.php: Invalid credentials (SHA256 hash mismatch)");
                    echo json_encode(["message" => "Credenciales incorrectas"]);
                }
            }
            // Verificar si la contraseña almacenada parece ser un bcrypt hash
            elseif (strlen($user['contrasena']) > 60 && strpos($user['contrasena'], '$2y$') === 0) {
                if (password_verify($contrasena, $user['contrasena'])) {
                    error_log("login.php: Login successful (bcrypt hashed password)");
                    echo json_encode([
                        "message" => "Inicio de sesión exitoso",
                        "id_empleado" => $user['id_empleado'],
                        "rol" => $user['rol']
                    ]);
                } else {
                    error_log("login.php: Invalid credentials (bcrypt hash mismatch)");
                    echo json_encode(["message" => "Credenciales incorrectas"]);
                }
            }
            // Si no parece ser ningún hash conocido, intentar comparar directamente (¡RIESGO!)
            else {
                if ($contrasena === $user['contrasena']) {
                    error_log("login.php: Login successful (plain text password - SECURITY RISK)");
                    echo json_encode([
                        "message" => "Inicio de sesión exitoso",
                        "id_empleado" => $user['id_empleado'],
                        "rol" => $user['rol']
                    ]);
                    // ¡¡¡IMPORTANTE!!! Considera actualizar la contraseña plana a un hash más seguro (bcrypt):
                    $newHash = password_hash($contrasena, PASSWORD_DEFAULT);
                    $updateStmt = $pdo->prepare("UPDATE login SET contrasena = ? WHERE id_empleado = ?");
                    $updateStmt->execute([$newHash, $user['id_empleado']]);
                    error_log("login.php: Plain text password updated to bcrypt hash for user " . $user['id_empleado']);
                } else {
                    error_log("login.php: Invalid credentials (plain text mismatch)");
                    echo json_encode(["message" => "Credenciales incorrectas"]);
                }
            }
        } else {
            error_log("login.php: User not found");
            echo json_encode(["message" => "Credenciales incorrectas"]);
        }
    } catch (PDOException $e) {
        error_log("login.php: PDO exception: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error"]);
    }

}

function checkEmail() {
    global $pdo;

    error_log("login.php: checkEmail() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in checkEmail: " . json_last_error_msg());
        echo json_encode(["exists" => false, "message" => "Error: Invalid JSON data"]);
        return;
    }

    $correo = $data->correo;

    if (empty($correo)) {
        error_log("login.php: Email missing in checkEmail");
        echo json_encode(["exists" => false, "message" => "Error: Email is required"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM login WHERE correo = ?
        ");
        $stmt->execute([$correo]);
        $count = $stmt->fetchColumn();

        if ($count > 0) {
            error_log("login.php: Email exists: " . $correo);
            echo json_encode(["exists" => true]);
        } else {
            error_log("login.php: Email does not exist: " . $correo);
            echo json_encode(["exists" => false]);
        }
    } catch (PDOException $e) {
        error_log("login.php: PDO exception in checkEmail: " . $e->getMessage());
        echo json_encode(["exists" => false, "message" => "Error: Database error"]);
    }
}
?>