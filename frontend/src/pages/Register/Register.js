import React, { useState } from "react";
import '../../assets/styles/Register.scss';
import useEmailValidation from "../../hooks/useEmailValidation";
import { Helmet } from "react-helmet";

const TITLE = 'Register Page';

const Register = () =>{
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isValidEmail, validateEmail] = useEmailValidation();
    const [emailValidation, setEmailValidation] = useState(true);
    const [passwordValidation, setPasswordValidation] = useState(true);

    const handleRegisterAccount= () =>{
        validateEmail(email);
        if(!isValidEmail){
            setEmailValidation(false);
            setPasswordValidation(false);
        }
    }

    return(
        <>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
        <section className="register-container">
            <div>
                <h1>Create account</h1>
                <div className={!emailValidation ? `validation` : `d-none`}>
                    <ul><h4><i class="fa-solid fa-circle-exclamation"></i>Please adjust the following:</h4>
                        <li><h5>Incorrect email or password.</h5></li>
                    </ul>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                </div>
                <div className="input-container">
                    <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="input-container">
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.password)}/>
                </div>
                <button onClick={() => handleRegisterAccount()}>Create</button>
            </div>
        </section>
        </>
    )
}

export default Register;