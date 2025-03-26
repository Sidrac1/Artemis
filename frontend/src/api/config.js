export const API_IP = "192.168.0.8";

export const getApiUrl = (model) => `http://${API_IP}/artemis/backend/api/models/${model}.php`;

export const getLoginUrl = () => `http://${API_IP}/artemis/backend/login.php`;