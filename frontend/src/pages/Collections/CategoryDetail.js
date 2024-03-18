import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCategoryBySlug, selectProductByCategory } from "../../store/slice/ProductSlice";
import '../../assets/styles/CategoryDetail.scss';
import ProductCard from "../../components/ui/ProductCard";

const CategoryDetail = () =>{
    const {slug} = useParams();
    const category = useSelector(state => selectCategoryBySlug(state, slug));
    const products = useSelector(state => selectProductByCategory(state, category.name));
    const orderId = useSelector(state => state.order.orderPending.id);

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
            <div className="product-card-container">
                {products && products.length > 0 && products.map((item, index)=>(
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null}/>
                ))}
            </div>
        </section>
    )
}

export default CategoryDetail;