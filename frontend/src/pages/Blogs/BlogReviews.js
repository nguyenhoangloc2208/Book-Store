import React from "react";
import api from '../../services/api';
import useSWR from 'swr';
import Loading from "../../components/ui/Loading";
import { formatDateTime } from "../../utils/utils";
import '../../assets/styles/BlogReivew.scss';
import {useNavigate} from 'react-router-dom';

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);

const BlogReview = () =>{
    const {data, error, isLoading} = useSWR('/api/blogs/reviews/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const navigate = useNavigate();

    const truncateString = (str, maxLength) => {
        if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
        } else {
        return str;
        }
    }

    const handleClick = (item) => {
        navigate(`/blogs/reviews/${item.slug}`);
    }

    if(error)return<div>failed to load</div>
    if(isLoading)return<div><Loading/></div>

    return(
        <section>
            <div className="blogs">
            <h1>Review sách và truyện tranh tiếng Việt</h1>
            {data && data.length > 0 ? 
                data.map((item, index) => {
                    let widthClass = '';
                    if (index === 0 || index === 3) {
                        widthClass = 'full-width'; // Phần tử đầu tiên và thứ 4 có width 100%
                    } else if (index === 1 || index === 2 || index === 4 || index === 5) {
                        widthClass = 'half-width'; // Phần tử 2, 3, 5, 6 có width 50%
                    }
                    return(
                        <>
                            <div onClick={() => handleClick(item)} className={`blogs-container ${widthClass}`} key={index}>
                                <div className="image-container">
                                    <img src={item.image_title} alt={item.title}/>
                                </div>
                                <div className="blogs-title">{truncateString(item.title, 50)}</div>
                                <div className="blogs-date">{formatDateTime(item.created_at)}</div>
                                <p>{item.post_paragraph}</p>
                            </div>
                        </>
                    )
                }
                )
                : <div>Không có data</div>}
                </div>
        </section>
    )
}

export default BlogReview;