import React from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/NotFound.scss';

const NotFound = () =>{
    const navigate = useNavigate()

    const handleBtn = () =>{
        navigate("/");
    }

    return(
        <div className="not-found-container">
            <p>404</p>
            <span>Page not found</span>
            <div>
                <button onClick={() => handleBtn()}>Continue shopping</button>
            </div>
        </div>
    )
}

export default NotFound;