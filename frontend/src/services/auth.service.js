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
    .post("/api/user/login/", {
      email: email,
      password: password
    })
    .then((response) => {
      if (response.access) {
        TokenService.setUser(response);
      }

      return response.data;
    });
};

const logout = () => {
  TokenService.removeUser();
  return api.post("/dj-rest-auth/logout/")
};

const verifyToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.access) {
    const token = user.access;
    return api.post("/dj-rest-auth/token/verify/",{
      "token": token
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
  } else {
    return ("false");
  }
}
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  verifyToken,
};

export default AuthService;