const API_URL = "http://172.18.6.16/backend/api/models/rutas.php";

export const getRutas = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo rutas:", error);
  }
};

export const createRuta = async (ruta) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ruta),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando ruta:", error);
  }
};

export const updateRuta = async (id, ruta) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...ruta }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando ruta:", error);
  }
};

export const deleteRuta = async (id) => {
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
    console.error("Error eliminando ruta:", error);
  }
};
