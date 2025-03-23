export const API_IP = "192.168.100.10";

export const getApiUrl = (model) => `http://${API_IP}/backend/api/models/${model}.php`;
