const API_URL = "http://172.18.6.16/backend/api/models/ronda_guardia.php";

export const getRondasGuardias = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo rondas-guardias:", error);
  }
};

export const createRondaGuardia = async (rondaGuardia) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rondaGuardia),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando ronda-guardia:", error);
  }
};

export const updateRondaGuardia = async (numero, rondaGuardia) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero, ...rondaGuardia }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando ronda-guardia:", error);
  }
};

export const deleteRondaGuardia = async (numero) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando ronda-guardia:", error);
  }
};
