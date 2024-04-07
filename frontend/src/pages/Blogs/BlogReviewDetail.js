import React from "react";
import {useParams} from 'react-router-dom';
import api from '../../services/api';
import useSWR from 'swr';
import Loading from "../../components/ui/Loading";
import { formatDateTime } from "../../utils/utils";
import '../../assets/styles/BlogReviewDetail.scss';

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);

const BlogReviewDetail = () => {
    const {slug} = useParams();
    const {data, error, isLoading} = useSWR(`/api/blogs/posts/${slug}/`, fetcher, {refreshInterval: null, revalidateOnFocus: false});
    
    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>

    const replaceLinksAndSplitLines = (text) => {
        // Biểu thức chính quy để tìm các liên kết trong văn bản
        const linkRegex = /(https?:\/\/[^\s]+)/g;
    
        // Phân tích văn bản và thay thế các liên kết bằng thẻ a
        return text.split('\r\n').map((line, lineIndex) => {
            return (
                <React.Fragment key={lineIndex}>
                    {line.split(linkRegex).map((part, index) => {
                        if (index % 2 === 1) {
                            return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
                        } else {
                            return part;
                        }
                    })}
                </React.Fragment>
            );
        });
    };

    return(
        <>
            <img className="title-image" src={data.image_title} alt={data.title}/>
            <section className="blog-container">
                <h2 className="blog-title">{data.title}</h2>
                <div className="blog-date">{formatDateTime(data.created_at)}</div>
                {data && data.content && data.content.map((item, index) => {
                    return(
                        <div key={index}>
                            {item.content_title && <h2 className="blog-content-title">{item.content_title}</h2>}
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