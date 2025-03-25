export const API_IP = "192.168.100.14";

export const getApiUrl = (model) => `http://${API_IP}/backend/api/models/${model}.php`;

export const getLoginUrl = () => `http://${API_IP}/backend/login.php`;