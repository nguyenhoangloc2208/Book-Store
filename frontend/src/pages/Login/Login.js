import React, { useEffect, useState } from "react";
import '../../assets/styles/Login.scss';
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { Helmet } from "react-helmet";
import useDataMutation from "../../hooks/useDataMutation";
import useEmailValidation from "../../hooks/useEmailValidation";
import {toast} from 'react-hot-toast';
import Cookies from "js-cookie";


const TITLE = 'Login Page';

const Login = () =>{
    const { email, isValidEmail, validateEmail } = useEmailValidation();
    const [password, setPassword] = useState();
    const [isEmailNull, setEmailNull] = useState(false);
    const [isPasswordNull, setPasswordNull] = useState(false);
    const navigate = useNavigate();
    const {updateData} = useDataMutation();
    const [isShowPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const isLogin = Cookies.get("isLoggedIn");
        if(isLogin === "true"){
            navigate('/');
        }
    }, [])

    const handleSignIn = async () =>{
        console.log(isValidEmail);
        if(email==='' && password===''){
            setEmailNull(true);
            setPasswordNull(true);
        }else if(email===''){
            setEmailNull(true);
            setPasswordNull(false);
        }else if(password===''){
            setPasswordNull(true);
            setEmailNull(false);
        }else{
            setEmailNull(false);
            setPasswordNull(false);
        }
        try{
            await AuthService.login(email, password);
            toast.success('Login success!');
            await updateData();
            navigate('/');
        }catch(err){
            console.error(err);
            toast.error(Object.values(err.response.data));
        }
    }

    const isValidAccount = () =>{

    }
    return(
        <>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
            <section className="login-container">
                <div>
                    <h1>Login</h1>
                    <div className="input-container">
                        <input className={(isEmailNull) && `emailValidation`} type="email" placeholder="Email" id="email" name="email" value={email} onChange={(e) => validateEmail(e.target.value) }/>
                    </div>
                        {isEmailNull && <div className="login-warning"><i class="fa-solid fa-circle-exclamation"></i>Email can't be blank.</div>}
                    <div className="input-container">
                        <input className={(isPasswordNull) && `passwordValidation`} type={isShowPassword ? "text" : "password"} placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <span><i className={isShowPassword === false ? "fa-solid fa-eye-slash": "fa-solid fa-eye"}
                                onClick={()=>setShowPassword(!isShowPassword)}></i></span>
                    </div>
                        {isPasswordNull && <div className="login-warning"><i class="fa-solid fa-circle-exclamation"></i>Password can't be blank.</div>}
                    <Link to="/account/forgot-password" className="forgot-password">Forgoten your password?</Link>
                    <button onClick={() => handleSignIn()}>Sign In</button>
                    <Link to="/account/register" className="register">Create account</Link>
                </div>
            </section>
        </>
    )
}

export default Login;