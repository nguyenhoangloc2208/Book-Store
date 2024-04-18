import { useState } from "react";
import '../../assets/styles/Login.scss';
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { Helmet } from "react-helmet";
import Loading from "../ui/Loading";
import {toast } from "react-hot-toast";

const TITLE = 'Reset Your Password Page';

const ResetPassword = () =>{
    const {uid, token} = useParams();
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [isPassword1Null, setPassword1Null] = useState();
    const [isPassword2Null, setPassword2Null] = useState();
    const [isShowPassword1, setShowPassword1] = useState(false);
    const [isShowPassword2, setShowPassword2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState({ data: {} });
    const navigate = useNavigate();
    
    const handleCLick = async () =>{
        setIsError(true);
        setIsLoading(true);
        if(password1.length === 0){
            setPassword1Null(true);
        } else{
            setPassword1Null(false);
        }
        if(password2.length === 0){
            setPassword2Null(true);
        } else{
            setPassword2Null(false);
        }
        if(password1.length >0 && password2.length > 0){
            console.log(token);
            setError({data: {}});
            try{
                const res = await AuthService.confirmPassword(password2, uid, token);
                if (res){
                    toast.success("Success!");
                    setIsError(false);
                    navigate('/account/login');
                }
            } catch(err){
                setError(prevState => ({
                    ...prevState,
                    data: err.response.data
                }));
                setIsError(true);
            }
        }
        setIsLoading(false);
    }

    if(isLoading) return <div><Loading/></div>

    return(
        <>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
            <section className="login-container">
                <div>
                    <h2>Reset password</h2>
                    <div className={isError ? `validation` : `d-none`}>
                        <ul><h4><i className="fa-solid fa-circle-exclamation"></i>Please adjust the following:</h4>
                        {error && error.data && Object.values(error.data).map(messages => (
                            messages.map(message => (
                                <li key={message}><h5>{message.includes("Invalid value") ? "Token expired" : message}</h5></li>
                            ))
                        ))}
                        </ul>
                    </div>
                    <div className="input-container">
                        <input className={(isPassword1Null) && `emailValidation`} type={isShowPassword1 ? "text" : "password"} placeholder="Password" id="email" name="email" value={password1} onChange={(e) => setPassword1(e.target.value) }/>
                        <span><i className={isShowPassword1 === false ? "fa-solid fa-eye-slash": "fa-solid fa-eye"}
                                onClick={()=>setShowPassword1(!isShowPassword1)}></i></span>
                    </div>
                                {isPassword1Null && <div className="login-warning"><i className="fa-solid fa-circle-exclamation"></i>Password can&apos;t be blank.</div>}
                    <div className="input-container">
                        <input className={(isPassword2Null) && `emailValidation`} type={isShowPassword2 ? "text" : "password"} placeholder="Re Enter PassWord" id="email" name="email" value={password2} onChange={(e) => setPassword2(e.target.value) }/>
                        <span><i className={isShowPassword2 === false ? "fa-solid fa-eye-slash": "fa-solid fa-eye"}
                                onClick={()=>setShowPassword2(!isShowPassword2)}></i></span>
                    </div>
                                {isPassword2Null && <div className="login-warning"><i className="fa-solid fa-circle-exclamation"></i>This field can&apos;t be blank.</div>}
                    <button onClick={() => handleCLick()}>Send</button>
                </div>
            </section>
        </>
    )
}

export default ResetPassword;