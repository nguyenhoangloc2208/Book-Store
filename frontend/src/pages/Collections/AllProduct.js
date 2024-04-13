import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";
import '../../assets/styles/CategoryDetail.scss';
import useSWR from 'swr';
import api from '../../services/api';
import Loading from "../../components/ui/Loading";
import { useLocation, useNavigate } from 'react-router-dom';
import NotFoundProduct from "../../components/NotFoundProduct";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);

const AllProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const currentPage  = params.get('page') || '1';
    const [type, setType] = useState(null);
    const {data, error, isLoading} = useSWR(
        type ? 
        (currentPage  ? `/api/products/products/${type}?page=${currentPage}`: `/api/products/products/${type}`) :
        (currentPage  ? `/api/products/?page=${currentPage}`: `/api/products/`)
        , fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const [filteredProducts, setFilteredProducts] = useState();
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();

    const totalPages = Math.ceil(data?.count / 16);

    useEffect(() => {
        if(data){
            setFilteredProducts(data.results);
        }
    }, [data])

    const handlePaginationClick = (page) => {
        // Chuyển đến trang được nhấp
        if(page === 1){
            window.scrollTo(0, 0);
            navigate(`/collections/all`);
        }else{
            window.scrollTo(0, 0);
            navigate(`/collections/all?page=${page}`);
        }
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePaginationClick(i)}>{i}</button>
                </li>
            );
        }
        return pages;
    };

    if(error && error.response.status === 404) return <div><NotFoundProduct/></div>
    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>

    return(
        <section>
            <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredProducts} setData={setFilteredProducts} _data={data.results} setType={setType}/>
            <div className="product-card-container">
                {filteredProducts && filteredProducts.length > 0 && filteredProducts.map((item, index)=>(
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                ))}
            </div>
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className={`page-item ${currentPage == 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePaginationClick(currentPage-1)}>&laquo;</button>
                    </li>
                    {renderPagination()}
                    <li className={`page-item ${currentPage == totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePaginationClick((totalPages - currentPage < 10) ? totalPages : (currentPage + 1))}>&raquo;</button>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default AllProduct;