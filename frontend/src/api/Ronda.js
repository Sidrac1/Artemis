const API_URL = "http://172.18.6.16/backend/api/models/ronda.php";

export const getRondas = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo rondas:", error);
  }
};

export const createRonda = async (ronda) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ronda),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando ronda:", error);
  }
};

export const updateRonda = async (codigo, ronda) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo, ...ronda }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando ronda:", error);
  }
};

export const deleteRonda = async (codigo) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando ronda:", error);
  }
};
