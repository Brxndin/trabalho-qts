import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
});

// feito nesse formato para ter redirecionamento dinâmico, não recarregando a tela
export const setupInterceptors = (navigate) => {
    api.interceptors.request.clear();
    api.interceptors.response.clear();

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
                navigate("/login");
            }
        }

        // aqui é proibido
        // estou tratando para quando o recurso só é disponível para adm
        if (status === 403 && window.location.pathname !== "/forbidden") {
            navigate("/forbidden");
        }

        return Promise.reject(error);
    });
};
