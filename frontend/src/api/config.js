export const API_IP = "192.168.100.10";

export const getApiUrl = (model) => `http://${API_IP}/Artemis/backend/api/models/${model}.php`;

export const getLoginUrl = () => `http://${API_IP}/Artemis/backend/login.php`;