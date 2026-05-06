import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
});

export const setupInterceptors = (navigate) => {
    api.interceptors.request.clear();
    api.interceptors.response.clear();

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use((res) => res, async (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("auth");
            
            if (window.location.pathname !== "/login") {
                navigate("/login");
            }
        }

        if (status === 403 && !error?.config?.ignoreForbiddenRedirect && window.location.pathname !== "/forbidden") {
            navigate("/forbidden");
        }

        return Promise.reject(error);
    });
};
