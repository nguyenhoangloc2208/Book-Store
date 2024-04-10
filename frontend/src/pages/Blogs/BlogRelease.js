import React from "react";
import api from '../../services/api';
import useSWR from 'swr';
import Loading from "../../components/ui/Loading";
import { formatDateTime } from "../../utils/utils";
import '../../assets/styles/BlogRelease.scss';
import {useNavigate, useLocation} from 'react-router-dom';

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);

const BlogRelease = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const currentPage  = params.get('page') || '1';
    const {data, error, isLoading} = useSWR(currentPage ? `/api/blogs/release/?page=${currentPage}`:'/api/blogs/release/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});

    const totalPages = Math.ceil(data?.count / 6);

    const truncateString = (str, maxLength) => {
        if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
        } else {
        return str;
        }
    }

    const handleClick = (item) => {
        navigate(`/blogs/tong-hop-tin-phat-hanh/${item.slug}`);
    }

    const handlePaginationClick = (page) => {
        // Chuyển đến trang được nhấp
        if(page === 1){
            window.scrollTo(0, 0);
            navigate(`/blogs/tong-hop-tin-phat-hanh`);
        }else{
            window.scrollTo(0, 0);
            navigate(`/blogs/tong-hop-tin-phat-hanh?page=${page}`);
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

    if(error)return<div>failed to load</div>
    if(isLoading)return<div><Loading/></div>

    return(
        <section>
            <h1>Tổng hợp tin phát hành| Publishing news</h1>
            {data.results && data.results.length > 0 ? 
                data.results.map((item) => (
                    <>
                        <div onClick={() => handleClick(item)} className="blogs-container">
                            <div className="image-container">
                                <img src={item.image_title} alt={item.title}/>
                            </div>
                            <div className="blogs-title">{truncateString(item.title, 50)}</div>
                            <div className="blogs-date">{formatDateTime(item.created_at)}</div>
                            <p className="blogs-paragraph">{item.post_paragraph}</p>
                        </div>
                    </>
                ))
            : <div>Không có data</div>}
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className={`page-item ${currentPage == 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePaginationClick(currentPage-1)}>&laquo;</button>
                    </li>
                    {renderPagination()}
                    <li className={`page-item ${currentPage == totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePaginationClick((totalPages - currentPage < 6) ? totalPages : (currentPage + 1))}>&raquo;</button>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default BlogRelease;