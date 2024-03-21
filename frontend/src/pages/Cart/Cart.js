import React, { useEffect, useState } from "react";
import EmptyCart from "../../components/ui/EmptyCart";
import { useSelector } from "react-redux";
import '../../assets/styles/Cart.scss';
import { selectProductById } from "../../store/slice/ProductSlice";
import { PayPalButtons } from "@paypal/react-paypal-js";
import useSWR, {mutate} from "swr";
import api from '../../services/api';
import CartService from "../../services/cart.service";

import {Helmet} from 'react-helmet';
const TITLE = 'Your Shopping Cart';

const ExchangeRate = 0.000040;

const fetcher = (url) => api.get(url).then(res => res[0]);


const Cart = () =>{
    const {data, error, isLoading} = useSWR('/api/user/orders/pending_order', fetcher, {refreshInterval: null, revalidateOnFocus: false});
    const [totalCostUSD, setTotalCostUSD] = useState();
    const cartItems = useSelector(state => selectProductById(state, data?.order_items));
    

    useEffect(() => {
        if(data && data.total_cost){
            setTotalCostUSD((parseFloat(data.total_cost) * ExchangeRate).toFixed(2));
        }

    }, [data])

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    const handleMinusClick = async (index) => {
        const quantity = data.order_items[index]?.quantity;
        if (quantity > 1) {
            try{
                await CartService.ItemUpdateQuantity(data.id, data.order_items[index], quantity - 1)
                mutate('/api/user/orders/pending_order');
            }catch{
                console.error(error);
            }
        } else{
            alert('Không thể trừ thêm');
        }
    };

    const handleAddClick = async (index) => {
        const quantity = data.order_items[index]?.quantity;
            try{
                await CartService.ItemUpdateQuantity(data.id, data.order_items[index], quantity + 1);
                mutate('/api/user/orders/pending_order');
            }catch(error){
                console.error(error);
                alert('Hết hàng');
            }
    };

    const handleDelete = async (index) => {
        try{
            await CartService.ItemDelete(data.id, data.order_items[index].id);
            mutate('/api/user/orders/pending_order');
        }catch{
            alert('Lỗi khi xóa');
        }
    }

    return(
        <>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            {Object.keys(data).length === 0 ? 
                <EmptyCart/>
                : 
                <section>
                    <ul class="responsive-table">
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
                                <div class="col col-2 quantity" data-label="Quantity">
                                    <div className="qty">
                                        <div class="qty-input">
                                            <button onClick={()=>handleMinusClick(index)} class="qty-count qty-count--minus" data-action="minus" type="button">-</button>
                                            <input class="product-qty" type="number" name="product-qty" min="0" max="10" value={data.order_items[index]?.quantity}/>
                                            <button onClick={()=>handleAddClick(index)} class="qty-count qty-count--add" data-action="add" type="button">+</button>
                                        </div>
                                        <i onClick={() => handleDelete(index)} class="fa-regular fa-trash-can delete"></i>
                                    </div>
                                </div>
                                <div class="col col-3 total" data-label="Total">{data.order_items[index]?.cost}</div>
                            </li>
                            ))}
                            <hr/>
                    </ul>
                    <div>
                        <div>Subtotal {data?.total_cost}</div>
                        <div>Subtotal {totalCostUSD}</div>
                    </div>
                    <div>
                        <PayPalButtons 
                            createOrder={async () => {
                                return await api.get(`/api/user/payments/paypal/create/order/${data.id}/`)
                                    .then(response => {
                                        // const linkForPayment = response.linkForPayment;
                                        // window.location.href = linkForPayment;
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                            }}
                            // createOrder={(data, actions) => {
                            //     return actions.order.create({
                            //         purchase_units: [
                            //             {
                            //                 amount: {
                            //                     currency_code: 'USD',
                            //                     value: totalCostUSD.toString(),
                            //                 },
                            //             },
                            //         ],
                            //     });
                            // }}
                            // onApprove={(data, actions) => {
                            //     return actions.order.capture().then((details) => {
                            //         const name = details.payer.name.given_name;
                            //         alert(`Transaction completed by ${name}`)
                            //     })
                            // }}
                        />
                    </div>
                </section>
            }
        </>
    )
}

export default Cart;