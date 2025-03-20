const API_URL = "http://172.18.6.16/backend/api/models/empleados.php";

export const getEmpleados = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo empleados:", error);
  }
};

export const createEmpleado = async (empleado) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleado),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando empleado:", error);
  }
};

export const updateEmpleado = async (id, empleado) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...empleado }),
    });

    const text = await response.text();

    console.log("Respuesta del servidor:", text); 

    if (response.ok) {
      return JSON.parse(text);  
    } else {
      console.error("Error en la respuesta:", text); 
      return { message: "Error al actualizar el empleado" };
    }
  } catch (error) {
    console.error("Error actualizando empleado:", error);
    return { message: "Error al actualizar el empleado" };
  }
};

export const deleteEmpleado = async (id) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando empleado:", error);
  }
};
