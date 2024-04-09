import React, {useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCategoryBySlug } from "../../store/slice/ProductSlice";
import '../../assets/styles/CategoryDetail.scss';
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";

import useSWR from 'swr';
import api from '../../services/api';
import Loading from "../../components/ui/Loading";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);

const CategoryDetail = () =>{
    const {slug} = useParams();
    const category = useSelector(state => selectCategoryBySlug(state, slug));
    const {data, error, isLoading} = useSWR(`/api/products/product_by_category_slug/${slug}/`, fetcher, {refreshInterval: 300000, revalidateOnFocus: false});
    const [filteredroducts, setFilteredProducts] = useState(data);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();
    
    useEffect(() => {
        setFilteredProducts(data)
    }, [data])

    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>
    

    return(
        <section className="category-detail-container">
            <div className="category-detail row grid">
                <div className="col-sm-6">
                    <h1>{category.name}</h1>
                </div>
                <div className="col-sm-6">
                    <img src={category.image} alt="img"/>
                </div>
            </div>
            <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredroducts} setData={setFilteredProducts} _data={data}/>
            <div className="product-card-container">
                {filteredroducts && filteredroducts.length > 0 && filteredroducts.map((item, index)=>(
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                ))}
            </div>
        </section>
    )
}

export default CategoryDetail;