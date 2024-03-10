import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../assets/styles/EmptyCart.scss';

const EmptyCart = () =>{
    const navigate = useNavigate();

    const handleContinueShopping = () =>{
        navigate("/collections/all");
    }

    return(
        <section className="empty-cart-container">
            <h2>Your cart is empty</h2>
            <button onClick={()=>handleContinueShopping()}>Continue shopping</button>
            <h3>Have an account?</h3>
            <div><Link to="/account/login">Log in</Link> to check out faster.</div>
        </section>
    )
}

export default EmptyCart;