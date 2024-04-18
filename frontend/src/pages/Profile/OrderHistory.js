import { useState } from "react";
import '../../assets/styles/Profile.scss';
import useSWR from "swr";
import api from '../../services/api.js';
import Loading from "../../components/ui/Loading.js";

const fetcher = (url) => api.get(url).then(res => res.results);

const OrderHistory = () =>{
    const {data, error, isLoading} = useSWR('/api/user/payments/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false})
    const {data: orderData, error: orderError, isLoading: orderLoading} = useSWR('/api/user/orders/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false})
    const [ordersPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);


    if (error || orderError) return <div>failed to load...</div>
    if (isLoading || orderLoading) return <div><Loading/></div>
    
    const handleFormatDate = (date) => {
        const createdAtDate = new Date(date);
        const day = createdAtDate.getDate();
        const month = createdAtDate.getMonth() + 1;
        const year = createdAtDate.getFullYear();
        const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
        return formattedDate
    }

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orderData.slice(indexOfFirstOrder, indexOfLastOrder);

    // Tạo một mảng chứa số trang có sẵn
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(orderData.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }


    return(
        <>
        {console.log(data)}
            {currentOrders && currentOrders.length > 0 ? <ul className="order-history-container">
                <li className="table-header">
                    <div className="col col-1">Order ID</div>
                    <div className="col col-2">Customer</div>
                    <div className="col col-3">No.of products</div>
                    <div className="col col-4">Status</div>
                    <div className="col col-5">Total</div>
                    <div className="col col-6">Date Added</div>
                    <div className="col col-7">Action</div>
                </li>

                {currentOrders && currentOrders.length >0 &&
                currentOrders.map((item, index) => (
                        <li className="table-row" key={index}>
                            <div className="col col-1 " data-label="Order ID">{item.id}</div>
                            <div className="col col-2 " data-label="Customer">{item.buyer}</div>
                            <div className="col col-3 " data-label="No.of products">{item.total_quantity}</div>
                            <div className="col col-4 " data-label="Status">
                                {item.status === 'C' ? 'Completed' : item.status === 'P' ? 'Pending' : item.status === 'D' ? 'Delete' : item.status === 'X' && 'Cancelled'}
                            </div>
                            <div className="col col-5 " data-label="Total">{item.total_cost}</div>
                            <div className="col col-6 " data-label="Date Added">{handleFormatDate(item.created_at)}</div>
                            <div className="col col-7 " data-label="Action"><i className="fa-regular fa-eye"></i></div>
                        </li>
                ))}
            </ul> 
            :
            <div>No Order Yet</div>
}
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={() => setCurrentPage(number)} className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default OrderHistory;