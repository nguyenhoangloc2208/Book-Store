import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useSWR from 'swr';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";
import api from '../../services/api';
import Loading from "../../components/ui/Loading";
import NotFoundProduct from "../../components/NotFoundProduct";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results[0]);
const _fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);


const Author = () => {
    const {slug} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const currentPage  = params.get('page') || '1';
    const {data, error, isLoading} = useSWR(currentPage ? `/api/products/product_by_author_slug/${slug}?page=${currentPage}` : `/api/products/product_by_author_slug/${slug}/`, _fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const {data:author, error: authorError, isLoading: isLoadingAuthor} = useSWR(`/api/products/author_slug/${slug}/`, fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const [filteredAuthorBook, setFilteredAuthorBook] = useState();
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();

    const totalPages = Math.ceil(data?.count / 16);

    useEffect(() => {
        if(data){
            setFilteredAuthorBook(data.results)
        }
    }, [data])

    const handlePaginationClick = (page) => {
        // Chuyển đến trang được nhấp
        if(page === 1){
            window.scrollTo(0, 0);
            navigate(`/collections/${slug}`);
        }else{
            window.scrollTo(0, 0);
            navigate(`/collections/${slug}?page=${page}`);
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
    if (error || authorError) return <div>failed to load</div>
    if (isLoading || isLoadingAuthor) return <div><Loading/></div>

    return(
        <>
            <Helmet>
                <title>{author? author.name : null}</title>
            </Helmet>       
            <section className="author-container">
                <div>{author.name}</div>
                <hr/>
                <div>
                    <div>Tác phẩm của {author.name}</div>
                    <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredAuthorBook} setData={setFilteredAuthorBook} _data={data?.results}/>   
                </div>
                {filteredAuthorBook &&
                    filteredAuthorBook.map((item, index) => (
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                    ))
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
        </>
    )
}

export default Author;