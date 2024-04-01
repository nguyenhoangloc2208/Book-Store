import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";

const AllProduct = () => {
    const product = useSelector(state => state.products.books);
    const [filteredProducts, setFilteredProducts] = useState(product);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation(`/api/user/orders/pending_order`);
    const [arrangeType, setArrangeType] = useState();
    const isLogin = useSelector(state => state.auth.isLogin);


    return(
        <section>
            <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredProducts} setData={setFilteredProducts} _data={product}/>
            <div className="product-card-container">
                {filteredProducts && filteredProducts.length > 0 && filteredProducts.map((item, index)=>(
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData} isLogin={isLogin}/>
                ))}
            </div>
        </section>
    )
}

export default AllProduct;