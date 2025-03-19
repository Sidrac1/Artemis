const API_URL = "http://172.18.6.16/backend/api/models/log_accesos.php";

export const getLogs = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo logs:", error);
  }
};

export const createLog = async (log) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando log:", error);
  }
};

export const updateLog = async (id, log) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...log }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando log:", error);
  }
};

export const deleteLog = async (id) => {
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
    console.error("Error eliminando log:", error);
  }
};
