import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type":"application/json"
    },
});

instance.defaults.requiresAuth = true;

instance.interceptors.request.use(
    (config) => {
        if (config.requiresAuth) {
            const token = TokenService.getLocalAccessToken();
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
    return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    async (res) => {
        return res.data ?? {statusCode: res.status};
    },
    async (err) => {
    const originalConfig = err.config;

    const refresh = TokenService.getLocalRefreshToken();
    const access = TokenService.getLocalAccessToken();
    if(refresh && refresh.length > 0 && access && access.length > 0){
        if (originalConfig && originalConfig.url !== "/api/user/login/" && err.response) {
        // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                
                try {            
                    const rs = await instance.post("/dj-rest-auth/token/refresh/", {
                        refresh: refresh,
                    });
                    TokenService.updateLocalAccessToken(rs.access);
                    
                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }
    }

    return Promise.reject(err);
    }
);

export default instance;