import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

// aqui intercepta o envio da request, colocando o token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// aqui trata a resposta caso ela seja específica pro token
api.interceptors.response.use((res) => res, async (error) => {
    const status = error?.response?.status;

    // aqui é para não autorizado
    // estou tratando quando o token não é mais válido
    if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
        
        if (window.location.pathname !== "/login") {
            window.location.assign("/login");
        }
    }

    // aqui é proibido
    // estou tratando para quando o recurso só é disponível para adm
    if (status === 403) {
        window.location.assign("/forbidden");
    }

    return Promise.reject(error);
});

export default api;