import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCategoryBySlug, selectProductByCategory } from "../../store/slice/ProductSlice";
import '../../assets/styles/CategoryDetail.scss';
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";

const CategoryDetail = () =>{
    const {slug} = useParams();
    const category = useSelector(state => selectCategoryBySlug(state, slug));
    const products = useSelector(state => selectProductByCategory(state, category.name));
    const [filteredroducts, setFilteredProducts] = useState(products);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();

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
            <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredroducts} setData={setFilteredProducts} _data={products}/>
            <div className="product-card-container">
                {filteredroducts && filteredroducts.length > 0 && filteredroducts.slice().sort(() => Math.random() - 0.5).map((item, index)=>(
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                ))}
            </div>
        </section>
    )
}

export default CategoryDetail;