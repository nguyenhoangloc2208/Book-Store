import React, { useEffect, useState } from "react";
import EmptyCart from "../../components/ui/EmptyCart";
import '../../assets/styles/Cart.scss';
import { PayPalButtons } from "@paypal/react-paypal-js";
import api from '../../services/api';
import CartService from "../../services/cart.service";
import images from "../../assets/images/image";
import {Helmet} from 'react-helmet';
import PaymentService from "../../services/payment.service";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import { toast } from "react-hot-toast";
import useDataMutation from "../../hooks/useDataMutation";
import Cookies from "js-cookie";
import useSWR from 'swr';
import { capitalizeFirstLetter, numberWithCommas } from "../../utils/utils";

const TITLE = 'Your Shopping Cart';

const ExchangeRate = 0.000040;

const fetcher = (url) => api.get(url).then(res => res.results);


const Cart = () =>{
    const {data, error, isLoading, updateData} = useDataMutation();
    const [totalCostUSD, setTotalCostUSD] = useState();
    const [isEmpty, setIsEmpty] = useState(false);
    const { data:cartItems, error: cartItemsError, isLoading: isCartItemsLoading } = useSWR(data?.id ? `/api/user/orders/orders/cart/${data?.id}` : null, fetcher, { refreshInterval: null, revalidateOnFocus: false });
    const isLoggedInStr = Cookies.get('isLoggedIn');
    
    const navigate = useNavigate();

    useEffect(() => {
        if(error){
            setIsEmpty(true);
        }
        if(data){
            setIsEmpty(false);
        }
        if(data && data.total_cost){
            setTotalCostUSD((parseFloat(data.total_cost) * ExchangeRate).toFixed(2));
        }
        if (data && Array.isArray(data.order_items) && data.order_items.length === 0) {
            setIsEmpty(true);
        }else if(!data){
            setIsEmpty(true)
        }
        else {
            setIsEmpty(false);
        }
    }, [data, isLoading, error, cartItemsError])

    if (isLoading) return <div><Loading/></div>

    const handleMinusClick = async (index) => {
        const quantity = data.order_items[index]?.quantity;
        if (quantity > 1) {
            try{
                await CartService.ItemUpdateQuantity(data.id, data.order_items[index], quantity - 1);
                if(isLoggedInStr === 'true'){updateData();}
            }catch{
                console.error(error);
            }
        } else{
            toast.dismiss('Error!')
        }
    };

    const handleAddClick = async (index) => {
        const quantity = data.order_items[index]?.quantity;
            try{
                await CartService.ItemUpdateQuantity(data.id, data.order_items[index], quantity + 1);
                if(isLoggedInStr==='true'){updateData();}
            }catch(error){
                console.error(error);
                toast.error('Out of stock!')
            }
    };

    const handleDelete = async (index) => {
        try{
            await CartService.ItemDelete(data.id, data.order_items[index].id);
            if(isLoggedInStr==='true'){updateData();}
        }catch{
            toast.error('Error!')
        }
    }

    const handleCreatePayment = async (payment_option, order) => {
        const payment = await PaymentService.PaymentList();
        const filteredPayments = payment.filter(payment => payment.order === order);
        try{
            await PaymentService.PaymentCreate(payment_option, order);
        } catch(error){
            await PaymentService.PaymentUpdate(payment_option, order, filteredPayments[0].id)
        }
    }

    const handleCreateStripePayment = async () => {
        await handleCreatePayment("S", data.id);
        try {
            const response = await PaymentService.StripePayment(data.id)
            if(response.paymentUrl){
                window.location.href = response.paymentUrl;
            }
          } catch (error) {
            // Xử lý lỗi
            console.error('Error:', error);
          }
    }

    if (error || cartItemsError) return <div>failed to load</div>
    if (isLoading || isCartItemsLoading) return <div><Loading/></div>

    return(
        <>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            {console.log('isEmpty', isEmpty)}
            {isEmpty? 
                <EmptyCart/>
                : 
                <section>
                    {console.log('>>>',data)}
                    {console.log(`product`, cartItems)}
                    <ul className="responsive-table">
                        <li className="table-header">
                        <div className="col col-1">Product</div>
                        <div className="col col-2">Quantity</div>
                        <div className="col col-3">Total</div>
                        </li>
                        {cartItems && cartItems.map((item, index) =>(
                            <li className="table-row" key={index}>
                                {console.log('item', item)}
                                <div className="col col-1 product" data-label="Product">
                                    <div className="product-image">
                                        <img alt="" src={item?.product.image[0]?.image ? item.product.image[0]?.image : 'https://fakeimg.pl/300/'} />
                                        <div className="discount">-{item.product.discount_percentage}%</div>
                                    </div>
                                    <div className="product-content">
                                        <div>{capitalizeFirstLetter(item?.product.name)}</div>
                                        <div className="product-price">
                                            <div className="final_price">{numberWithCommas(item?.product.final_price)}<span className="vnd">đ</span></div>    
                                            <div className="price">{numberWithCommas(item?.product.price)}<span className="vnd">đ</span></div>    
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-2 quantity" data-label="Quantity">
                                    <div className="qty">
                                        <div className="qty-input">
                                            <button onClick={()=>handleMinusClick(index)} className="qty-count qty-count--minus" data-action="minus" type="button">-</button>
                                            <input className="product-qty" type="number" name="product-qty" min="0" max="10" value={data.order_items[index]?.quantity}/>
                                            <button onClick={()=>handleAddClick(index)} className="qty-count qty-count--add" data-action="add" type="button">+</button>
                                        </div>
                                        <i onClick={() => handleDelete(index)} className="fa-regular fa-trash-can delete"></i>
                                    </div>
                                </div>
                                <div className="col col-3 total" data-label="Total">{numberWithCommas(data.order_items[index]?.cost)}&nbsp;đ</div>
                            </li>
                            ))}
                            <hr/>
                    </ul>
                    <div className="payment">
                        <div>
                            <div>Subtotal: {numberWithCommas(data?.total_cost)}&nbsp;đ</div>
                            <div>Subtotal: {numberWithCommas(totalCostUSD)}&nbsp;$</div>
                        </div>
                        <div className="checkout">
                            <button onClick={() => navigate(`/checkouts/${data.buyer}`)}>Check out</button>
                        </div>
                        <div className="stripe">
                        {!data?.billing_address && !data?.shipping_address ? 
                            <button  className="no-address">Pay with <img src={images.Stripe} alt="Stripe"/></button>
                            : 
                            <button onClick={() => handleCreateStripePayment()}>Pay with <img src={images.Stripe} alt="Stripe"/></button>
                        }
                        </div>
                        <div>
                            {!data?.billing_address && !data?.shipping_address ? 
                            <div className="no-address" style={{ width: '400px' }}>
                                <PayPalButtons fundingSource="paypal" disabled={true} />
                            </div> :
                            <div style={{width : '400px'}}>
                                <PayPalButtons 
                                // fundingSource="paypal"
                                    // style={{ layout: "horizontal" }}
                                    createOrder={async (e, actions) => {
                                            const toastId = toast.loading("Running...", { duration: 0 });
                                            await handleCreatePayment("P", data.id);
                                            try {
                                                const response = await api.get(`/api/user/payments/paypal/create/order/${data.id}/`);
                                                const orderId = response.orderId;
                                                return orderId;
                                            }catch(error) {
                                                console.error('Error:', error);
                                            }
                                            toast.dismiss(toastId);
                                    }}
                                    onApprove={ (event, actions) => {
                                            actions.order.capture().then(async (details) => {
                                                const toastId = toast.loading("Running...", { duration: 0 });
                                                const name = details.payer.name.given_name;
                                                const id = details.id;
                                                try {
                                                    await api.post(`/api/user/payments/paypal/checkout/order/${data.id}/`, {
                                                        id: id,
                                                        orderId: data.id,
                                                    });
                                                    toast.success(`Transaction completed by ${name}`);
                                                    navigate(`/payment/success/`);

                                                } catch (error) {
                                                    console.error('Error:', error);
                                                }
                                                toast.dismiss(toastId);
                                            })
                                    }}
                                />
                            </div>
                            }
                                
                        </div>
                    </div>
                </section>
            }
        </>
    )
}

export default Cart;