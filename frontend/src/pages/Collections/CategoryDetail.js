import React, {useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import '../../assets/styles/CategoryDetail.scss';
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";
import {useLocation, useNavigate} from 'react-router-dom';

import useSWR from 'swr';
import api from '../../services/api';
import Loading from "../../components/ui/Loading";
import NotFoundProduct from "../../components/NotFoundProduct";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results[0]);
const _fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);

const CategoryDetail = () =>{
    const {slug} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const _isInStock  = params.get('in_stock');
    const _isOutOfStock  = params.get('out_of_stock');
    const [type, setType] = useState(null);
    const currentPage  = params.get('page') || '1';
    const url = `/api/products/product_by_category_slug/${slug}/` + 
    (currentPage === 1 ? '':`?page=${currentPage}`) +
    (type ? `&sort_by=${type}` : '') +
    ((_isInStock === 'true' && _isOutOfStock !== 'true') ? `&available=1` : '') +
    ((_isInStock !== 'true' && _isOutOfStock === 'true') ? `&available=0` : '');
    const {data, error, isLoading} = useSWR(url, _fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const {data:category, error:categoryError, isLoading: isCategoryLoading} = useSWR(`/api/products/productcategory_slug/${slug}/`, fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const orderId = useSelector(state => state.order.idPending);
    const [available, setAvailable] = useState(0);
    const [unAvailable, setUnavailable] = useState(0);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();
    const [isInStock, setIsInStock] = useState(_isInStock === 'true' ? true : false);
    const [isOutOfStock, setIsOutOfStock] = useState(_isOutOfStock === 'true' ? true : false);

    const totalPages = Math.ceil(data?.count / 16);

    useEffect(() => {
        if(available == 0 && data){
            const fetchApi = async () => {
                const res = await api.get(`/api/products/product_by_category_slug/${slug}/?available=0`);
                setUnavailable(res.count);
                setAvailable(data.count - res.count);
            }
            fetchApi();
        }
    }, [data])

    useEffect(() => {
        handlePaginationClick(currentPage);
    }, [type, isInStock, isOutOfStock])

    const handlePaginationClick = (page) => {
        window.scrollTo(0, 0);
        const baseUrl = `/collections/${slug}`;
        const queryParams = [];
        if (parseInt(page) !== 1) {
            queryParams.push(`page=${page}`);
        }
        if (isInStock && isOutOfStock) {
            queryParams.push(`in_stock=true`, `out_of_stock=true`);
        } else {
            if (isInStock) {
                queryParams.push(`in_stock=true`);
            }
            if (isOutOfStock) {
                queryParams.push(`out_of_stock=true`);
            }
        }
        if (type) {
            queryParams.push(`sort_by=${type}`);
        }
        const url = `${baseUrl}${queryParams.length > 0 ? `?${queryParams.join('&')}` : ''}`;
        navigate(url);
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
    if (error || categoryError) return <div>failed to load</div>
    if (isLoading || isCategoryLoading) return <div><Loading/></div>
    

    return(
        <section className="category-detail-container">
            <div className="category-detail row grid">
                <div className="col-sm-6">
                    <h1>{category.name}</h1>
                </div>
                <div className="col-sm-6">
                    <img src={category.image} alt="img"/>
                </div>
            </div>
            <SortSelect value={arrangeType} setValue={setArrangeType} data={data} setType={setType} 
                unAvailable={unAvailable} available={available}
                setIsInStock={setIsInStock} setIsOutOfStock={setIsOutOfStock}
                isInStock={isInStock} isOutOfStock={isOutOfStock}
            />
            <div className="product-card-container">
                {data && data.results && data.results.length > 0 && data.results.map((item, index)=>(
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

export default CategoryDetail;