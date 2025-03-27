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
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'checkEmail':
                checkEmail();
                break;
            case 'getEmail':
                getEmail();
                break;
            case 'updateEmail': // Nueva acción para actualizar el correo
                updateEmail();
                break;
            case 'updatePassword': // Nueva acción para actualizar la contraseña
                updatePassword();
                break;
            default:
                login();
                break;
        }
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
            $storedPassword = $user['contrasena'];
            error_log("login.php: Contraseña almacenada para " . $correo . ": " . $storedPassword);

            // Verificar si la contraseña almacenada parece ser un hash SHA256 (longitud típica)
            if (strlen($storedPassword) === 64) {
                error_log("login.php: Intentando verificación SHA256");
                // Hashear la contraseña ingresada con SHA256
                $hashedInputPassword = hash('sha256', $contrasena);
                // Comparar el hash de la entrada con el hash almacenado
                if ($hashedInputPassword === $storedPassword) {
                    error_log("login.php: Login successful (SHA256 hashed password)");
                    echo json_encode([
                        "message" => "Inicio de sesión exitoso",
                        "id_empleado" => $user['id_empleado'],
                        "rol" => $user['rol']
                    ]);
                    return;
                } else {
                    error_log("login.php: Invalid credentials (SHA256 hash mismatch)");
                    echo json_encode(["message" => "Credenciales incorrectas"]);
                }
            } else {
                error_log("login.php: Contraseña almacenada no parece ser un hash SHA256");
                echo json_encode(["message" => "Credenciales incorrectas"]);
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

function getEmail() {
    global $pdo;

    error_log("login.php: getEmail() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in getEmail: " . json_last_error_msg());
        echo json_encode(["email" => null, "message" => "Error: Invalid JSON data"]);
        return;
    }

    $id_empleado = $data->id_empleado;

    if (empty($id_empleado)) {
        error_log("login.php: Employee ID missing in getEmail");
        echo json_encode(["email" => null, "message" => "Error: Employee ID is required"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT correo FROM login WHERE id_empleado = ?
        ");
        $stmt->execute([$id_empleado]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result && isset($result['correo'])) {
            error_log("login.php: Email found for employee ID " . $id_empleado . ": " . $result['correo']);
            echo json_encode(["email" => $result['correo']]);
        } else {
            error_log("login.php: Email not found for employee ID " . $id_empleado);
            echo json_encode(["email" => null, "message" => "Error: Email not found for this employee ID"]);
        }
    } catch (PDOException $e) {
        error_log("login.php: PDO exception in getEmail: " . $e->getMessage());
        echo json_encode(["email" => null, "message" => "Error: Database error"]);
    }
}

function updateEmail() {
    global $pdo;

    error_log("login.php: updateEmail() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in updateEmail: " . json_last_error_msg());
        echo json_encode(["message" => "Error: Invalid JSON data"]);
        return;
    }

    $id_empleado = $data->id_empleado;
    $nuevo_correo = $data->nuevo_correo;

    if (empty($id_empleado) || empty($nuevo_correo)) {
        error_log("login.php: Employee ID or new email missing in updateEmail");
        echo json_encode(["message" => "Error: Employee ID and new email are required"]);
        return;
    }

    // Validar el formato del correo electrónico
    if (!filter_var($nuevo_correo, FILTER_VALIDATE_EMAIL)) {
        error_log("login.php: Invalid email format in updateEmail: " . $nuevo_correo);
        echo json_encode(["message" => "Error: Invalid email format"]);
        return;
    }

    try {
        // Verificar si el nuevo correo ya existe para otro usuario
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM login WHERE correo = ? AND id_empleado != ?");
        $stmtCheck->execute([$nuevo_correo, $id_empleado]);
        $count = $stmtCheck->fetchColumn();

        if ($count > 0) {
            error_log("login.php: New email already exists for another user: " . $nuevo_correo);
            echo json_encode(["message" => "Error: This email address is already in use"]);
            return;
        }

        $stmtUpdate = $pdo->prepare("
            UPDATE login
            SET correo = ?
            WHERE id_empleado = ?
        ");
        $stmtUpdate->execute([$nuevo_correo, $id_empleado]);

        if ($stmtUpdate->rowCount() > 0) {
            error_log("login.php: Email updated successfully for employee ID " . $id_empleado . " to " . $nuevo_correo);
            echo json_encode(["message" => "Correo electrónico actualizado exitosamente"]);
        } else {
            error_log("login.php: Could not update email for employee ID " . $id_empleado . " (user not found or email already the same)");
            echo json_encode(["message" => "Error: Could not update email"]);
        }

    } catch (PDOException $e) {
        error_log("login.php: PDO exception in updateEmail: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error during email update"]);
    }
}

function updatePassword() {
    global $pdo;
    error_log("login.php: updatePassword() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in updatePassword: " . json_last_error_msg());
        echo json_encode(["message" => "Error: Invalid JSON data"]);
        return;
    }

    $id_empleado = $data->id_empleado;
    $currentPassword = $data->currentPassword;
    $newPassword = $data->newPassword;
    $confirmPassword = $data->confirmPassword;

    if (empty($id_empleado) || empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        error_log("login.php: Required fields missing in updatePassword");
        echo json_encode(["message" => "Error: All fields are required"]);
        return;
    }

    if ($newPassword !== $confirmPassword) {
        error_log("login.php: New password and confirm password do not match");
        echo json_encode(["message" => "Error: New password and confirmation do not match"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT contrasena FROM login WHERE id_empleado = ?");
        $stmt->execute([$id_empleado]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $storedPassword = $user['contrasena'];

            if (hash('sha256', $currentPassword) === $storedPassword) {
                $hashedNewPassword = hash('sha256', $newPassword);

                $updateStmt = $pdo->prepare("UPDATE login SET contrasena = ? WHERE id_empleado = ?");
                $updateResult = $updateStmt->execute([$hashedNewPassword, $id_empleado]);

                if ($updateResult) {
                    error_log("login.php: Password updated successfully" . $id_empleado);
                    echo json_encode(["message" => "Password updated successfully"]);
                } else {
                    error_log("login.php: Could not update password for employee ID " . $id_empleado);
                    echo json_encode(["message" => "Error: Could not update password"]);
                }
            } else {
                error_log("login.php: Incorrect current password for employee ID " . $id_empleado);
                echo json_encode(["message" => "Error: Incorrect current password"]);
            }
        } else {
            error_log("login.php: User not found with ID " . $id_empleado);
            echo json_encode(["message" => "Error: User not found"]);
        }

    } catch (PDOException $e) {
        error_log("login.php: PDO exception in updatePassword: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error updating password"]);
    }
}
?>