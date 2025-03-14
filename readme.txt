##Flujo de comunicación

*Frontend (React):
-El usuario interactúa con la interfaz (por ejemplo, hace clic en un botón).
-React ejecuta una función que hace una solicitud HTTP al backend (por ejemplo, usando fetch o axios).

*Backend (PHP):
-Recibe la solicitud HTTP en uno de sus endpoints (por ejemplo, /api/dispositivos).
-El endpoint llama al controlador correspondiente.
-El controlador ejecuta la lógica de negocio y, si es necesario, interactúa con el modelo para acceder a la base de datos.
-El controlador devuelve una respuesta (por ejemplo, un JSON).

*Frontend (React):
-Recibe la respuesta del backend.
-Actualiza el estado de la aplicación o muestra los datos al usuario.