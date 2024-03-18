import React, { useEffect, useState } from "react";
import '../../assets/styles/Login.scss';
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../../store/slice/AuthSlice";

const Login = () =>{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [emailValidation, setEmailValidation] = useState(true);
    const [passwordValidation, setPasswordValidation] = useState(true);
    const [isEmailNull, setEmailNull] = useState(false);
    const [isPasswordNull, setPasswordNull] = useState(false);
    const [isValidEmail, setIsValid] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = pattern.test(email);
        setIsValid(isValid);
    }, [email]);

    const handleSignIn = async () =>{
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
            if (isValidEmail){
                try{
                    await AuthService.login(email, password);
                    dispatch(setIsLogin(true));
                    navigate('/');
                }catch(err){
                    console.error(err);
                }
            }else {
                setEmailValidation(false);
                setPasswordValidation(false);
            }
        }
    }

    const isValidAccount = () =>{

    }
    return(
        <>
            <section className="login-container">
                <div>
                    <h1>Login</h1>
                    <div className={!emailValidation ? `validation` : `d-none`}>
                        <ul><h4><i class="fa-solid fa-circle-exclamation"></i>Please adjust the following:</h4>
                            <li><h5>Incorrect email or password.</h5></li>
                        </ul>
                    </div>
                    <div className="input-container">
                        <input className={(!emailValidation || isEmailNull) && `emailValidation`} type="email" placeholder="Email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value) }/>
                        {isEmailNull && <div className="login-warning"><i class="fa-solid fa-circle-exclamation"></i>Email can't be blank.</div>}
                    </div>
                    <div className="input-container">
                        <input className={(!passwordValidation || isPasswordNull) && `passwordValidation`} type="password" placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        {isPasswordNull && <div className="login-warning"><i class="fa-solid fa-circle-exclamation"></i>Password can't be blank.</div>}
                    </div>
                    <Link to="/account/forgot-password" className="forgot-password">Forgot your password?</Link>
                    <button onClick={() => handleSignIn()}>Sign In</button>
                    <Link to="/account/register" className="register">Create account</Link>
                </div>
            </section>
        </>
    )
}

export default Login;