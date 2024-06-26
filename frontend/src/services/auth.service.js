import api from "./api.js";
import TokenService from "./token.service.js";
import {store} from '../store/store.js'
import { setIsLogin } from "../store/slice/AuthSlice.js";
import Cookies from 'js-cookie';

const addCountryCode = (phoneNumber) => {
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+84' + phoneNumber.slice(1);
  }
  return phoneNumber;
};

// const register = (email, password, first_name, last_name, phone_number) => {
//   if(phone_number === ''){
//     return api.post("/api/user/register/", {
//       "email": email,
//       "password1": password,
//       "password2": password,
//       "first_name": first_name,
//       "last_name": last_name,
//     }, {
//       requiredAuth: false
//     })
//     .catch((error)=>{
//       throw error
//   });
//   } else{
//     return api.post("/api/user/register/", {
//       "email": email,
//       "password1": password,
//       "password2": password,
//       "first_name": first_name,
//       "last_name": last_name,
//       "phone_number": addCountryCode(phone_number),
//     }, {
//       requiredAuth: false
//     })
//     .catch((error)=>{
//       throw error
//   });
//   }
  
// };

const register = (email, password, first_name, last_name) => {

    return api.post("/api/user/register/", {
      "email": email,
      "password1": password,
      "password2": password,
      "first_name": first_name,
      "last_name": last_name,
    }, {
      requiredAuth: false
    })
    .catch((error)=>{
      throw error
  });
  
};

const confirmEmail = (key) => {
  return api.post("/account-confirm-email/",{
    key: key,
  },{
    requiredAuth: false,
  })
  .catch((error) =>{
    throw error
  })
}
const resendEmail = (email) => {
  return api.post("/resend-email/",{
    email: email,
  },{
    requiredAuth: false,
  })
  .catch((error) =>{
    throw error
  })
}

const forgotPassword = (email) => {
  return api.post("/password/reset/",
  {
    email: email,
  }
  )
}

const confirmPassword = (password, uid, token) => {
  return api.post("/password/reset/confirm/",
  {
    "new_password1": password,
    "new_password2": password,
    "uid": uid,
    "token": token
  }
  )
}

const changePassword = (password) => {
  return api.post("/password/change/",
  {
    "new_password1": password,
    "new_password2": password,
  }
  )
}

const login = (email, password) => {
  return api
    .post("/api/user/login/", {
      email: email,
      password: password
    },{
      requiresAuth:false
    })
    .then((response) => {
      if (response.access) {
      store.dispatch(setIsLogin(true));
      Cookies.set('isLoggedIn', true.toString());
        TokenService.setUser(response);
      }

      return response.data;
    });
};

const logout = () => {
  TokenService.removeUser();
  store.dispatch(setIsLogin(false));
  Cookies.set('isLoggedIn', false.toString());
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
  confirmEmail,
  resendEmail,
  forgotPassword,
  changePassword,
  confirmPassword
};

export default AuthService;