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






#### USO DE CONTEXTOS ####

### **¿Por qué usar Contextos?**

1. **Evitar duplicación de código**:
   - En lugar de repetir la lógica de verificación de roles en cada componente, puedes centralizarla en un contexto.

2. **Facilitar el mantenimiento**:
   - Si necesitas cambiar la lógica de permisos, solo debes hacerlo en un solo lugar (el contexto).

3. **Mejor organización**:
   - Separas la lógica de negocio (autenticación y autorización) de la lógica de presentación (componentes).

4. **Reutilización**:
   - Puedes usar el contexto en cualquier componente sin necesidad de pasar props manualmente.

---

### **Cómo implementar un Contexto para manejar roles y permisos**

Vamos a crear un contexto llamado `AuthContext` que maneje la autenticación y los permisos de los usuarios (admin y supervisor).

---

#### **1. Crear el Contexto (`AuthContext`)**

Crea un archivo llamado `AuthContext.js` dentro de una carpeta `context/`:

```javascript
// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData); // Guardar los datos del usuario
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null); // Eliminar los datos del usuario
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Verificar si el usuario tiene permisos para una acción específica
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  // Valores que estarán disponibles en el contexto
  const value = {
    user,
    login,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
```

---

#### **2. Usar el Contexto en la Aplicación**

Envuelve tu aplicación con el `AuthProvider` en el archivo principal (`App.js` o `index.js`):

```javascript
// src/App.js
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes'; // Importa tus rutas

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
```

---

#### **3. Usar el Contexto en los Componentes**

Ahora puedes usar el contexto en cualquier componente para verificar roles y permisos.

**Ejemplo: Componente que solo el admin puede ver**:
```javascript
// src/components/AdminPanel.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { user, hasRole } = useAuth();

  if (!hasRole('admin')) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {user.name}!</p>
    </div>
  );
}

export default AdminPanel;
```

**Ejemplo: Componente que el admin y el supervisor pueden ver**:
```javascript
// src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, hasRole } = useAuth();

  if (!hasRole('admin') && !hasRole('supervisor')) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user.name}!</p>
      {hasRole('admin') && <button>Eliminar Usuario</button>}
    </div>
  );
}

export default Dashboard;
```

---

#### **4. Iniciar Sesión y Establecer el Rol**

Cuando el usuario inicie sesión, puedes establecer su rol y permisos en el contexto:

```javascript
// src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    // Simular una solicitud de inicio de sesión
    const userData = {
      id: 1,
      name: username,
      role: username === 'admin' ? 'admin' : 'supervisor', // Asignar rol dinámicamente
      permissions: ['view_dashboard'], // Permisos del usuario
    };

    login(userData); // Guardar los datos del usuario en el contexto
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default Login;
```

---

### **Ventajas de este enfoque**

1. **Centralización**:
   - Toda la lógica de autenticación y autorización está en un solo lugar (`AuthContext`).

2. **Reutilización**:
   - Puedes usar el contexto en cualquier componente sin necesidad de pasar props manualmente.

3. **Escalabilidad**:
   - Si agregas más roles o permisos en el futuro, solo necesitas modificar el contexto.

4. **Mantenibilidad**:
   - Cambiar la lógica de permisos es fácil, ya que solo debes modificar el contexto.

---

### **Conclusión**

Usar **Contextos en React** es una excelente manera de manejar roles y permisos en tu aplicación, especialmente cuando tienes múltiples actores (como admin y supervisor) con diferentes niveles de acceso. Este enfoque te permite evitar la duplicación de código, centralizar la lógica y facilitar el mantenimiento.

Si tienes más preguntas o necesitas más detalles, ¡no dudes en preguntar! 😊