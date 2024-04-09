import React from "react";
import api from '../../services/api';
import useSWR from 'swr';
import Loading from "../../components/ui/Loading";
import { formatDateTime } from "../../utils/utils";
import '../../assets/styles/BlogRelease.scss';
import {useNavigate} from 'react-router-dom';

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);

const BlogRelease = () =>{
    const {data, error, isLoading} = useSWR('/api/blogs/release/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const navigate = useNavigate();

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

    if(error)return<div>failed to load</div>
    if(isLoading)return<div><Loading/></div>

    return(
        <section>
            <h1>Tổng hợp tin phát hành| Publishing news</h1>
            {data && data.length > 0 ? 
                data.map((item) => (
                    <>
                        <div onClick={() => handleClick(item)} className="blogs-container">
                            <div className="image-container">
                                <img src={item.image_title} alt={item.title}/>
                            </div>
                            <div className="blogs-title">{truncateString(item.title, 50)}</div>
                            <div className="blogs-date">{formatDateTime(item.created_at)}</div>
                            <p>{item.post_paragraph}</p>
                        </div>
                    </>
                ))
            : <div>Không có data</div>}
        </section>
    )
}

export default BlogRelease;