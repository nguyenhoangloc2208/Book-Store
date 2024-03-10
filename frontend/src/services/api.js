import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type":"application/json"
    },
});

instance.interceptors.request.use(
    (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
        // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        config.headers["access"] = token;
    }
    return config;
    },
    (error) => {
    return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    async (res) => {
        console.log('check response axios:', res);
        return res.data ? res.data : {statusCode: res.status};
    },
    async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/api/login/" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
            const rs = await instance.post("/dj-rest-auth/token/refresh/", {
            refresh: TokenService.getLocalRefreshToken(),
            });

            const { access } = rs.data;
            TokenService.updateLocalAccessToken(access);

            return instance(originalConfig);
        } catch (_error) {
            return Promise.reject(_error);
        }
        }
    }

    return Promise.reject(err);
    }
);

export default instance;