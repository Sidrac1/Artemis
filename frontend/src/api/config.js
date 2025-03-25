export const API_IP = "172.18.4.252";

export const getApiUrl = (model) => `http://${API_IP}/backend/api/models/${model}.php`;

export const getLoginUrl = () => `http://${API_IP}/backend/login.php`;