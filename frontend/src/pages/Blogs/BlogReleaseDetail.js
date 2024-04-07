import React from "react";
import {useParams} from 'react-router-dom';
import api from '../../services/api';
import useSWR from 'swr';
import Loading from "../../components/ui/Loading";
import { formatDateTime } from "../../utils/utils";
import '../../assets/styles/BlogReleaseDetail.scss';

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);

const BlogReleaseDetail = () => {
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
                {data && data.content && data.content.map((item, index) => (
                    <div className="blog-content">
                        {item.content_title && <h2 className="blog-content-title">{item.content_title}</h2>}
                        {item.image && <img className="blog-content-image" src={item.image} alt={item.image_alt}/>}
                        <p className="blog-content-paragraph">{item.paragraph.split('\r\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                        </p>
                    </div>
                ))}
            </section>
        </>
    )
}

export default BlogReleaseDetail;