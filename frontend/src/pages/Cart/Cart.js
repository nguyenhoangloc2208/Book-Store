import React, { useEffect, useState } from "react";
import EmptyCart from "../../components/ui/EmptyCart";
import { useSelector } from "react-redux";
import '../../assets/styles/Cart.scss';
import { selectProductById } from "../../store/slice/ProductSlice";
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
const TITLE = 'Your Shopping Cart';

const ExchangeRate = 0.000040;


const Cart = () =>{
    const {data, error, isLoading, updateData} = useDataMutation();
    const [totalCostUSD, setTotalCostUSD] = useState();
    const cartItems = useSelector(state => selectProductById(state, data?.order_items));
    const [isEmpty, setIsEmpty] = useState(true);
    const isLoggedInStr = Cookies.get('isLoggedIn');
    
    const navigate = useNavigate();

    useEffect(() => {
        if(error){
            setIsEmpty(true);
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
    }, [isLoading, error])

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

    return(
        <>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            {isEmpty? 
                <EmptyCart/>
                : 
                <section>
                    {console.log(data)}
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
                    <div className="payment">
                        <div>
                            <div>Subtotal {data?.total_cost}</div>
                            <div>Subtotal {totalCostUSD}</div>
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