import axios from "axios";
import TokenService from "./token.service.js";
import AuthService from "./auth.service.js";

const instance = axios.create({
    baseURL: "/choreo-apis/hoang-loc-book-store/backend/rest-api-be2/v1.0",
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

let refreshAttempts = 0;

instance.interceptors.response.use(
    async (res) => {
        return res.data ?? {statusCode: res.status};
    },
    async (err) => {
        const originalRequest = err.config;

        const refresh = TokenService.getLocalRefreshToken();
        const access = TokenService.getLocalAccessToken();
        if(refresh && refresh.length > 0 && access && access.length > 0){
            if (originalRequest && originalRequest.url !== "/api/user/login/" && err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalRequest._retry) {
                    if (refreshAttempts < 4) {
                        originalRequest._retry = true;
                        refreshAttempts++; // Increase the refresh attempts counter
                        try {            
                            const rs = await instance.post("/dj-rest-auth/token/refresh/", {
                                refresh: refresh,
                            });
                            TokenService.updateLocalAccessToken(rs.access);
                            
                            // Retry the original request
                            return instance(originalRequest);
                        } catch (_error) {
                            return Promise.reject(_error);
                        }
                    } else {
                        // Logout after 4 failed refresh attempts
                        AuthService.logout();
                    }
                }
            }
        }

        return Promise.reject(err);
    }
);


export default instance;