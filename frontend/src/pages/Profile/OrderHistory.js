import React from "react";
import '../../assets/styles/Profile.scss';
import useSWR from "swr";
import api from '../../services/api';
import { useSelector } from "react-redux";
import { selectProductByProductId } from "../../store/slice/ProductSlice";

const fetcher = (url) => api.get(url).then(res => res.results);

const OrderHistory = () =>{
    const {data, error, isLoading} = useSWR('/api/user/payments/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false})
    const {data: orderData, error: orderError, isLoading: orderLoading} = useSWR('/api/user/orders/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false})
    const orderItems = orderData ? orderData.flatMap(order => order.order_items) : [];
    const productIds = orderItems.map(orderItem => orderItem.product);
    const uniqueProductIds = productIds.filter((productId, index) => productIds.indexOf(productId) === index);

    const products = useSelector(state => selectProductByProductId(state, uniqueProductIds));

    if (error || orderError) return <div>failed to load...</div>
    if (isLoading || orderLoading) return <div>loading...</div>
    
    const handleFormatDate = (date) => {
        const createdAtDate = new Date(date);
        const day = createdAtDate.getDate();
        const month = createdAtDate.getMonth() + 1;
        const year = createdAtDate.getFullYear();
        const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
        return formattedDate
    }

    const handleFindProductName = (id) => {
        const product = products.find(products => products.id === id)
        return product ? product.name : 'Product not found';
    }

    const truncateProductName = (productName) => {
        if (productName.length <= 28) {
            return productName;
        } else {
            return productName.substring(0, 28) + '...';
        }
    }

    return(
        <>
            <ul className="order-history-container">
                <li className="table-header">
                    <div className="col col-1">Order ID</div>
                    <div className="col col-2">Customer</div>
                    <div className="col col-3">No.of products</div>
                    <div className="col col-4">Product info</div>
                    <div className="col col-5">Status</div>
                    <div className="col col-6">Total</div>
                    <div className="col col-7">Date Added</div>
                    <div className="col col-8">Action</div>
                </li>

                {orderData && orderData.length >0 &&
                orderData.map((item, index) => (
                        <li className="table-row" key={index}>
                            <div className="col col-1 " data-label="Order ID">{item.id}</div>
                            <div className="col col-2 " data-label="Customer">{item.buyer}</div>
                            <div className="col col-3 " data-label="No.of products">{item.total_quantity}</div>
                            <div className="col col-4" data-label="Product info">
                                {item.order_items.slice(0, 3).map((orderItem, index) => (
                                    <div key={index}>
                                        {truncateProductName(handleFindProductName(orderItem.product))}
                                    </div>
                                ))}
                                {item.order_items.length > 3 && <div>...</div>}
                            </div>
                            <div className="col col-5 " data-label="Status">
                                {item.status === 'C' ? 'Completed' : item.status === 'P' ? 'Pending' : item.status === 'D' ? 'Delete' : item.status === 'X' && 'Cancelled'}
                            </div>
                            <div className="col col-6 " data-label="Total">{item.total_cost}</div>
                            <div className="col col-7 " data-label="Date Added">{handleFormatDate(item.created_at)}</div>
                            <div className="col col-8 " data-label="Action"><i class="fa-regular fa-eye"></i></div>
                        </li>
                ))}
            </ul>
        </>
    )
}

export default OrderHistory;