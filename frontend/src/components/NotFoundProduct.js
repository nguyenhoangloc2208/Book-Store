import React from "react";
import '../assets/styles/NotFound.scss';

const NotFoundProduct = () =>{

    const handleBtn = () =>{
        window.history.back();
    }


    return(
        <div className="not-found-container">
            <span>No product found</span>
            <div>
                <button onClick={() => handleBtn()}>Back</button>
            </div>
        </div>
    )
}

export default NotFoundProduct;