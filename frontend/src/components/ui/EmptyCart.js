import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../assets/styles/EmptyCart.scss';
import { useSelector } from "react-redux";


const EmptyCart = () =>{
    const navigate = useNavigate();
    const isLogin = useSelector(state => state.auth.isLogin);

    const handleContinueShopping = () =>{
        navigate("/collections/all");
    }

    return(
        <section className="empty-cart-container">
            <h2>Your cart is empty</h2>
            <button onClick={()=>handleContinueShopping()}>Continue shopping</button>
            {!isLogin && 
                <>
                    <h3>Have an account?</h3>
                    <div><Link to="/account/login">Log in</Link> to check out faster.</div>
                </> 
            }
        </section>
    )
}

export default EmptyCart;