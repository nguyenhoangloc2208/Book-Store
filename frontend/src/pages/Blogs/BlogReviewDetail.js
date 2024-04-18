import React from "react";
import {useParams} from 'react-router-dom';
import api from '../../services/api.js';
import useSWR from 'swr';
import Loading from "../../components/ui/Loading.js";
import { formatDateTime, replaceLinksAndSplitLines } from "../../utils/utils.js";
import '../../assets/styles/BlogReviewDetail.scss';

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);

const BlogReviewDetail = () => {
    const {slug} = useParams();
    const {data, error, isLoading} = useSWR(`/api/blogs/posts/${slug}/`, fetcher, {refreshInterval: null, revalidateOnFocus: false});
    
    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>

    return(
        <>
            <img className="title-image" src={data.image_title} alt={data.title}/>
            <section className="blog-container">
                <h2 className="blog-title">{data.title}</h2>
                <div className="blog-date">{formatDateTime(data.created_at)}</div>
                {data && data.content && data.content.map((item, index) => {
                    return(
                        <div key={index}>
                            {item.content_title && <h2 className="blog-content-title">
                                {replaceLinksAndSplitLines(item.content_title).map((part, index) => (
                                    <React.Fragment key={index}>
                                        {part}
                                        <br />
                                    </React.Fragment>
                                ))}</h2>}
                            {item.image && <img className="blog-content-image" src={item.image} alt={item.image_alt}/>}
                            <p className="blog-content-paragraph">
                                {replaceLinksAndSplitLines(item.paragraph).map((part, index) => (
                                    <React.Fragment key={index}>
                                        {part}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                    )
                    }
                )}
            </section>
        </>
    )
}

export default BlogReviewDetail;