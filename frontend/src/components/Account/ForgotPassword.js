import { useEffect, useState } from "react";
import '../../assets/styles/Login.scss';
import { Link } from "react-router-dom";
import AuthService from "../../services/auth.service.js";
import { Helmet } from "react-helmet";
import useEmailValidation from "../../hooks/useEmailValidation.js";
import {toast} from 'react-hot-toast';
import Loading from "../ui/Loading.js";

const TITLE = 'Forgot Password Page';

const ForgotPassword = () =>{
    const { email, isValidEmail, validateEmail } = useEmailValidation();
    const [isEmailNull, setEmailNull] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    useEffect(() => {
        validateEmail(email);
    }, [email]);

    const handleCLick = async () =>{
        setIsLoading(true)
        if(email.length > 0 && isValidEmail){
            setEmailNull(false);
            const res = await AuthService.forgotPassword(email);
            if(res && res.detail === "Password reset e-mail has been sent."){
                toast.success("Password reset e-mail has been sent.");
                setIsSuccess(true);
            }
        }else{
            setEmailNull(true);
        }
        setIsLoading(false);
    }

    if(isLoading) return <div><Loading/></div>
    if(isSuccess) return <section><h3>Password reset e-mail has been sent to {email}</h3></section>

    return(
        <>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
            <section className="login-container">
                <div>
                    <h2>Find your account</h2>
                    <div className="input-container">
                        <input className={(isEmailNull) && `emailValidation`} type="email" placeholder="Email" id="email" name="email" value={email} onChange={(e) => validateEmail(e.target.value) }/>
                        {isEmailNull && <div className="login-warning"><i className="fa-solid fa-circle-exclamation"></i>Email can&apos;t be blank.</div>}
                    </div>
                    <Link to="/account/forgot-password" className="forgot-password">Login</Link>
                    <button onClick={() => handleCLick()}>Send</button>
                    <Link to="/account/register" className="register">Create account</Link>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword;