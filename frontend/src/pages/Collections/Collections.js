import React from "react";
import '../../assets/styles/Collections.scss';
import CollectionsCard from "../../components/ui/CollectionsCard";

import useSWR from 'swr';
import api from '../../services/api';
import Loading from "../../components/ui/Loading";

const fetcher = (url) => api.get(url, {requiresAuth: false}).then(res => res.results);

const Collections = () =>{
    const {data: categories, error, isLoading} = useSWR(`/api/products/categories/`, fetcher, {refreshInterval: 300000, revalidateOnFocus: false});

    if (error) return <div>failed to load</div>
    if (isLoading) return <div><Loading/></div>

    return(
        <section className="collections-container">
            <h1>Danh mục sách—Collections</h1>
            {categories && categories.length > 0 && categories.map((item, index) =>(
                <CollectionsCard item={item} index={index} key={index} />
            ))}
        </section>
    )
}

export default Collections;