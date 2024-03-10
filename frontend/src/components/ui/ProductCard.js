import React, { useState } from "react";
import '../../assets/styles/ProductCard.scss';
import { useNavigate } from "react-router-dom";

const ProductCard = ({item, index, isBtn}) =>{
    const navigate = useNavigate();

    const handleClickCard = () =>{
        navigate(`/products/${item.slug}`);
    }

    const handleAddtocart = () =>{
        alert('Chưa có giỏ hàng');
    }

    return(
        <>
            <div className={`product-card ${isBtn ? 'btn':'no-btn'}`} >
                <div onClick={() => handleClickCard()} className="card-image-container">
                    <img className="card-image" src={item.image[0].image} alt="none"/>
                </div>
                <h5 className="card-name">{item.name} <i class="fa-solid fa-arrow-right-long"></i></h5>
                <div className="card-price">{item.price}<span className="vnd">đ</span></div>
                {isBtn && <button onClick={() => handleAddtocart()} className="card-btn">Add to cart</button>}
            </div>
        </>
    )
}

export default ProductCard;