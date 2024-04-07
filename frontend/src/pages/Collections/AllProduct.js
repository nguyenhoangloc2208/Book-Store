import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";
import '../../assets/styles/CategoryDetail.scss';



const AllProduct = () => {
    const product = useSelector(state => state.products.books);
    const [filteredProducts, setFilteredProducts] = useState(product);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();


    return(
        <section>
            <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredProducts} setData={setFilteredProducts} _data={product}/>
            <div className="product-card-container">
                {filteredProducts && filteredProducts.length > 0 && filteredProducts.slice().sort(() => Math.random() - 0.5).map((item, index)=>(
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                ))}
            </div>
        </section>
    )
}

export default AllProduct;