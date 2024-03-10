import React, { useEffect, useState } from "react";
import '../../assets/styles/Collections.scss';
import CollectionsCard from "../../components/ui/CollectionsCard";
import { useDispatch } from "react-redux";
import { setCategoriesFromRedux, setProductsFromRedux } from "../../store/slice/ProductSlice";
import ProductService from "../../services/product.service";

const Collections = () =>{
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();

    useEffect (() => {
        const fetchData = async () =>{
            const res = await ProductService.categoryList();
            setCategories(res);
            dispatch(setCategoriesFromRedux(res));
        }
        const fetchProduct = async () =>{
            const res = await ProductService.productsList();
            dispatch(setProductsFromRedux(res));
        }
        fetchData();
        fetchProduct();
    }, [dispatch]);


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