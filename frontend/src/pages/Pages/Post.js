import React  from "react";
import useSWR from 'swr';
import '../../assets/styles/Pages.scss';
import api from '../../services/api';
import Loading from "../../components/ui/Loading";
import {useParams} from "react-router-dom";
import { replaceLinksAndSplitLines } from "../../utils/utils";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res);


const Post = () => {
    const {slug} = useParams();
    const {data, error, isLoading} = useSWR(`/api/blogs/posts/${slug}/`, fetcher, {refreshInterval: null, revalidateOnFocus: false});

    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>

    return (
    <section className="pages-container">
        <h2>{data.title}</h2>
        {data.content.map((item) => (
            <>
                <p className="blog-content-paragraph">
                    {replaceLinksAndSplitLines(item.paragraph).map((part, index) => (
                        <React.Fragment key={index}>
                            {part}
                            <br />
                        </React.Fragment>
                    ))}
                </p>
                {item.image && 
                <div className="image-container">
                    <img src={item.image} alt={item.image_alt} width={!item.image_alt && 150}/>
                    <div>{item.image_alt}</div>
                </div>
                }
            </>
        ))}
    </section>
    );
};

export default Post;