import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useSWR from 'swr';
import { selectAuthorBySlug } from "../../store/slice/ProductSlice";
import NotFound from "../../components/NotFound";
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";
import api from '../../services/api';
import Loading from "../../components/ui/Loading";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);


const Author = () => {
    const {slug} = useParams();
    const author = useSelector(state => selectAuthorBySlug(state, slug));
    const {data, error, isLoading} = useSWR(`/api/products/product_by_author_slug/${slug}/`, fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const [filteredAuthorBook, setFilteredAuthorBook] = useState(data);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();

    useEffect(() => {
        setFilteredAuthorBook(data)
    }, [data])

    if(!author) return(<NotFound/>)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>

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
                    <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredAuthorBook} setData={setFilteredAuthorBook} _data={data}/>   
                </div>
                {filteredAuthorBook &&
                    filteredAuthorBook.map((item, index) => (
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                    ))
                }
            </section>
        </>
    )
}

export default Author;