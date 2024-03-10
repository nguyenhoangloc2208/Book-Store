import api from "./api";
import TokenService from "./token.service";

const register = (username, email, password) => {
  return api.post("/auth/signup/", {
    username,
    email,
    password
  });
};

const login = (email, password) => {
  return api
    .post("/api/login/", {
      email: email,
      password: password
    })
    .then((response) => {
      if (response.data.access) {
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
  TokenService.removeUser();
  return api.post("/dj-rest-auth/logout/")
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;