import React, { useState } from "react";
import '../../assets/styles/Register.scss';
import useEmailValidation from "../../hooks/useEmailValidation";
import { Helmet } from "react-helmet";
import usePhoneNumberValidation from "../../hooks/usePhoneNumberValidation";
import AuthService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';

const TITLE = 'Register Page';

const Register = () =>{
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [password, setPassword] = useState();
    const { email, isValidEmail, validateEmail } = useEmailValidation();
    const [passwordValidation, setPasswordValidation] = useState(true);
    const { phoneNumber, isValidPhoneNumber, validateAndFormatPhoneNumber } = usePhoneNumberValidation();
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const handleRegisterAccount = async () =>{
        setIsLoading(true);
        setIsSubmit(true);
        if(!isValidEmail){
            setPasswordValidation(false);
        }
        else{
            try{
                const response = await AuthService.register(email, password, firstName, lastName, phoneNumber);  
                if (response && response.detail === "Verification e-mail sent.") {
                    navigate(`/account/register/verification/${email}`);
                } 
            }
            catch(error){
                if (error.response && error.response.data && error.response.data.email && error.response.data.email[0] === "A user is already registered with this e-mail address.") {
                    // Xử lý trường hợp email đã được đăng ký
                    toast('A user is already registered with this e-mail address.');
                  } else {
                    // Xử lý các lỗi khác
                    validateEmail(email);
                    validateAndFormatPhoneNumber(phoneNumber);
                  }
            }
        }
        setIsLoading(false);
    }

    const handleInputPhoneNumberChange = (event) => {
        const input = event.target.value;
        validateAndFormatPhoneNumber(input);
      };

    return(
        <>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
        <section className="register-container">
            <div>
                <h1>Create account</h1>
                <div className={isSubmit && (!isValidEmail || !isValidPhoneNumber) ? `validation` : `d-none`}>
                    <ul><h4><i class="fa-solid fa-circle-exclamation"></i>Please adjust the following:</h4>
                        {!isValidEmail && <li><h5>Incorrect email or password.</h5></li>}
                        {!isValidPhoneNumber && <li><h5>Incorrect phone number.</h5></li>}
                    </ul>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                </div>
                <div className="input-container">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => validateEmail(e.target.value) }/>
                </div>
                <div className="input-container">
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                {/* <div className="input-container">
                    <input type="phonenumber" placeholder="Phone number" value={phoneNumber} onChange={handleInputPhoneNumberChange}/>
                </div> */}
                <button onClick={() => handleRegisterAccount()} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Create'}
                    </button>
            </div>
        </section>
        </>
    )
}

export default Register;