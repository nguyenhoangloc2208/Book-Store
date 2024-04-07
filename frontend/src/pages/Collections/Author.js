import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectAuthorBySlug, selectProductByAuthor } from "../../store/slice/ProductSlice";
import NotFound from "../../components/NotFound";
import ProductCard from "../../components/ui/ProductCard";
import useDataMutation from "../../hooks/useDataMutation";
import SortSelect from "../../utils/SortSelect";

const Author = () => {
    const {slug} = useParams();
    const author = useSelector(state => selectAuthorBySlug(state, slug));
    const authorBook = useSelector(state => selectProductByAuthor(state, author.name));
    const [filteredAuthorBook, setFilteredAuthorBook] = useState(authorBook);
    const orderId = useSelector(state => state.order.idPending);
    const {updateData} = useDataMutation();
    const [arrangeType, setArrangeType] = useState();


    if(!author) return(<NotFound/>)

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
                    <SortSelect value={arrangeType} setValue={setArrangeType} data={filteredAuthorBook} setData={setFilteredAuthorBook} _data={authorBook}/>   
                </div>
                {filteredAuthorBook && filteredAuthorBook.length > 0 &&
                    filteredAuthorBook.slice().sort(() => Math.random() - 0.5).map((item, index) => (
                    <ProductCard item={item} index={index} key={index} isBtn={true} orderId={orderId ? orderId : null} updateData={updateData}/>
                    ))
                }
            </section>
        </>
    )
}

export default Author;