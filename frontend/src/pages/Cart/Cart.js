import React, { useEffect, useState } from "react";
import EmptyCart from "../../components/ui/EmptyCart";
import {Helmet} from 'react-helmet';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import '../../assets/styles/Cart.scss';
import { selectProductById } from "../../store/slice/ProductSlice";

const TITLE = 'Your Shopping Cart';

const Cart = () =>{
    const cartItem = useSelector(state => state.order.orderPending);
    const cartItems = useSelector(state => selectProductById(state, cartItem));
    

    return(
        <>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            {Object.keys(cartItem).length === 0 ? 
                <EmptyCart/>
                : 
                <section>
                    <ul class="responsive-table">
                        {console.log('>', cartItem)}
                        {console.log('>>>>>', cartItems)}
                        <li class="table-header">
                        <div class="col col-1">Product</div>
                        <div class="col col-2">Quantity</div>
                        <div class="col col-3">Total</div>
                        </li>
                        {cartItems && Object.keys(cartItems).length > 0 && cartItems.map((item, index) =>(
                            <li class="table-row" key={index}>
                                <div class="col col-1 product" data-label="Product">
                                    <div className="product-image">
                                        <img alt="" src={item?.image[0]?.image ? item.image[0].image : 'https://fakeimg.pl/300/'} />
                                    </div>
                                    <div className="product-content">
                                        <div>{item?.name}</div>
                                        <div>{item?.price}</div>
                                    </div>
                                </div>
                                <div class="col col-2 quantity" data-label="Quantity">{cartItem.order_items[index]?.quantity}</div>
                                <div class="col col-3 total" data-label="Total">{cartItem.order_items[index]?.cost}</div>
                            </li>
                            ))}
                    </ul>
                    <div>
                        <div>Subtotal {cartItem?.total_cost}</div>
                    </div>
                </section>
            }
        </>
    )
}

export default Cart;