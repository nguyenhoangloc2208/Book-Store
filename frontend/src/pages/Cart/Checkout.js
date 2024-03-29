import React, { useState } from "react";
import '../../assets/styles/Checkouts.scss';
import useSWR, { mutate } from "swr";
import { selectProductById } from "../../store/slice/ProductSlice";
import { useSelector } from "react-redux";
import api from '../../services/api';
import AddressContainer from "../../components/ui/AddressContainer";
import PaymentService from "../../services/payment.service";
import { useNavigate } from "react-router-dom";

const fetcher = (url) => api.get(url).then(res => res[0]);
const fetcherAddress = (url) => api.get(url).then(res => res.results);


const Checkout = ({order}) => {
    const {data, error, isLoading} = useSWR('/api/user/orders/pending_order', fetcher, {refreshInterval: null, revalidateOnFocus: false});
    const {data: address, error: addressError, isLoading: addressLoading} = useSWR('/api/user/profile/address/', fetcherAddress, {refreshInterval: null, revalidateOnFocus: false});
    const [totalCostUSD, setTotalCostUSD] = useState();
    const cartItems = useSelector(state => selectProductById(state, data?.order_items));
    const [selectedAddress, setSelectedAddress] = useState(null);
    const navigate = useNavigate();

    if(error || addressError)return(<div>failed to load...</div>)
    if(isLoading || addressLoading)return(<div>loading...</div>)

    const handleCheckout = async () => {
        try{
            const response = await PaymentService.PaymentList();
            const payment = response.find(response => response.order = data.id);
            await PaymentService.Checkout(payment.id, selectedAddress, data.id);
            alert('Checkout success');

        }catch{
            await PaymentService.PaymentCreate('P', data.id);
            const response = await PaymentService.PaymentList();
            const payment = response.find(response => response.order = data.id);
            await PaymentService.Checkout(payment.id, selectedAddress, data.id);
        }
        await mutate('api/user/orders/pending_order');
        navigate('/cart');
    }

    return(
        <div className="checkout-container">
            <div className="div1">
                <div>
                    <div>Buyer</div>
                    <div>{data.buyer}</div>
                </div>
                <hr/>

                <div>
                    <AddressContainer
                        address={address}
                        checkout={true}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                    />
                </div>
                <div>
                    <button onClick={() => handleCheckout()} className="submit-btn">Submit</button>
                </div>
            </div>
            <div className="div2">
                {cartItems && cartItems.length > 0 &&
                    cartItems.map((item, index) => (
                        <div key={index} className="items">
                            <div className="img-container">
                                <img src={item.image[0]?.image} alt={item.name}/>
                                <span className="quantity">{data.order_items[index]?.quantity}</span>
                            </div>
                            <div className="name">
                                <div>{item.name}</div>
                            </div>
                            <div className="cost">{data.order_items[index]?.cost}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Checkout;