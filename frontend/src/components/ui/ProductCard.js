import React, { useState } from "react";
import '../../assets/styles/ProductCard.scss';
import { useNavigate } from "react-router-dom";
import CartService from "../../services/cart.service";
import {mutate} from 'swr';
import { useDispatch } from "react-redux";
import { setOrderPending } from "../../store/slice/OrderSlice";

const ProductCard = ({item, index, isBtn, orderId}) =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClickCard = () =>{
        navigate(`/products/${item.slug}`);
    }

    const handleAddtocart = async () =>{
        try {
            await CartService.CartCreate(item.id, 1);
            mutate(`/api/user/orders/${orderId}/order_items/`);
            dispatch(setOrderPending({ total_quantity: 1, id: orderId }));
            alert('Tạo cart thành công');
        } catch (error) {
            console.error('Tạo cart thất bại: ', error);
            try {
                await CartService.CartUpdateItems(orderId, item.id, 1);
                mutate(`/api/user/orders/${orderId}/order_items/`);
            } catch (error) {
                try{

                    const data = await CartService.GetPendingOrder();
                    const orderItem = data[0].order_items.find(orderItem => orderItem.product === item.id);
                    try{
                        await CartService.ItemUpdateQuantity(orderId, orderItem, orderItem.quantity + 1);
                        alert('+1 số lượng');
                    } catch{
                        alert('Hết hàng!');
                    }
                }catch{
                    alert('Hết hàng!')
                }
            }
        }
        mutate('/api/user/orders/pending_order');
    }

    return(
        <>
            <div className={`product-card ${isBtn ? 'btn':'no-btn'}`} >
                <div className={item.count_in_stock === 0 ? 'out-in-stock' : 'in-stock'}>Hết hàng</div>
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