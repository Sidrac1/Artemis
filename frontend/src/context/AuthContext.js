//AuthContext se encargue de:

//Autenticar al usuario y almacenar su rol (admin o supervisor).
//Proporcionar funciones como login, logout y hasRole.

//Mostrar componentes específicos según el rol:

//Dependiendo del rol del usuario (admin o supervisor), se muestren ciertos componentes en la página.



// EJEMPLO:
// ESTE CODIGO ES UN EJEMPLO DE COMO SE USARIA EL AUTHCONTEXT DENTRO DE LA PANTALLA DASHBOARD --->>>

// src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, hasRole } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.name}!</p>

      {/* Solo el admin puede ver esta sección */}
      {hasRole('admin') && (
        <div>
          <h2>Acciones de Administración</h2>
          <button>Eliminar Usuario</button>
        </div>
      )}

      {/* Tanto el admin como el supervisor pueden ver esta sección */}
      {(hasRole('admin') || hasRole('supervisor')) && (
        <div>
          <h2>Reportes</h2>
          <button>Generar Reporte</button>
        </div>
      )}

      {/* Solo el supervisor puede ver esta sección */}
      {hasRole('supervisor') && (
        <div>
          <h2>Tareas del Supervisor</h2>
          <button>Ver Tareas</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;