import { useEffect, useState } from "react";
import {useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/ui/SearchBar.js";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ui/ProductCard.js";
import useDataMutation from "../../hooks/useDataMutation.js";
import SortSelect from "../../utils/SortSelect.js";
import { Helmet } from "react-helmet";

import useSWR from 'swr';
import api from '../../services/api.js';
import NotFoundProduct from "../../components/NotFoundProduct.js";
import Loading from "../../components/ui/Loading.js";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const _isInStock  = params.get('in_stock');
    const _isOutOfStock  = params.get('out_of_stock');
    const currentPage  = params.get('page') || '1';
    const [type, setType] = useState(null);
    const url = `/api/products/?name=${query}` + 
    (currentPage ? `&page=${currentPage}` : '') +
    (type ? `&sort_by=${type}` : '') +
    ((_isInStock === 'true' && _isOutOfStock !== 'true') ? `&available=1` : '') +
    ((_isInStock !== 'true' && _isOutOfStock === 'true') ? `&available=0` : '');
    const {data, error, isLoading} = useSWR(url, fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const [filteredProducts, setFilteredProducts] = useState([]);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();
    const [available, setAvailable] = useState(0);
    const [unAvailable, setUnavailable] = useState(0);
    const [isInStock, setIsInStock] = useState(_isInStock === 'true' ? true : false);
    const [isOutOfStock, setIsOutOfStock] = useState(_isOutOfStock === 'true' ? true : false);
    const [filtered, setFiltered] = useState('');

    const totalPages = Math.ceil(data?.count / 16);

    useEffect(() => {
        if (query) {
            const _filtered = data?.results?.filter(product => { //Multi Linear Regression
                const searchText = query.replace(/-/g, '–').toLowerCase();
                const searchTerms = searchText.split(' ').filter(term => term.trim() !== '');
                return searchTerms.every(term => product.name.toLowerCase().includes(term));
            });
            setFiltered(_filtered);
            setFilteredProducts(_filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [query, data]);

    const TITLE = `Search: ${filtered ? filtered.length : '0'} results found for "${query}"`;

    useEffect(() => {
        if(available == 0 && data){
            const fetchApi = async () => {
                const res = await api.get(`/api/products/?name=${query}&available=0`);
                setUnavailable(res.count);
                setAvailable(data.count - res.count);
            }
            fetchApi();
        }
    }, [data, query])

    useEffect(() => {
        handlePaginationClick(currentPage);
    }, [type, isInStock, isOutOfStock])

    const handlePaginationClick = (page) => {
        window.scrollTo(0, 0);
        const baseUrl = `/search?q=${query}`;
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
        const url = `${baseUrl}${queryParams.length > 0 ? `&${queryParams.join('&')}` : ''}`;
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
    if((error && error.response.status === 404) || data?.count === 0) return <div><NotFoundProduct/></div>
    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>


    return(
        <section>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <div className="search-section">
                <SearchBar query={query}/>
            </div>
            <SortSelect value={arrangeType} setValue={setArrangeType} data={data} setType={setType} 
                        unAvailable={unAvailable} available={available}
                        setIsInStock={setIsInStock} setIsOutOfStock={setIsOutOfStock}
                        isInStock={isInStock} isOutOfStock={isOutOfStock}
                    />
            {filteredProducts && filteredProducts.length > 0 ?
                filteredProducts.slice().sort(() => Math.random() - 0.5).map((item,index) => (
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                ))
                : <div>Không có</div>
            }
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

export default SearchResult;