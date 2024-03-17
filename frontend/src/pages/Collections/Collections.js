import React, { useEffect, useState } from "react";
import '../../assets/styles/Collections.scss';
import CollectionsCard from "../../components/ui/CollectionsCard";
import { useSelector } from "react-redux";

const Collections = () =>{
    const categories = useSelector(state => state.products.categories);

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