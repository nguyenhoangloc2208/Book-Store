import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectProductByAuthor, selectProductByCategory, selectProductBySlug } from "../../store/slice/ProductSlice";
import '../../assets/styles/ProductDetail.scss';
import RspItem from "../../components/ui/RspItem";
import ProductCard from "../../components/ui/ProductCard";

const ProductDetail = () =>{
    const {slug} = useParams();
    const item = useSelector(state => selectProductBySlug(state, slug));
    const authorBook = useSelector(state => selectProductByAuthor(state, item.author));
    const categoryBook = useSelector(state => selectProductByCategory(state, item.category));
    const shuffledCategoryBook = [...categoryBook].sort(() => Math.random() - 0.5);
    const [quantity, setQuantity] = useState(1);
    const [isComment, setIsComment] = useState(false);

    const handleClickMinus = () =>{
        if (quantity>1){
            setQuantity(quantity-1);
        } else{
            
        }
    }


    return(
        <section className="product-detail-container">
            <div className="product-detail row gutters-sm">
                <div className="image-container col-md-5">
                    <img src={item.image[0].image} alt="img"/>
                </div>
                <div className="content col-md-7">
                    <div className="title">{item.name}</div>
                    <hr/>
                    <div className="price">${item.price}<span className="vnd">đ</span></div>
                    <hr/>
                    <div>Tác giả : <span>{item.author}</span></div>
                    <div className="quantity">
                        <button onClick={()=>handleClickMinus()} className="quantity-button" name="minus" type="button">-</button>
                        <input className="quantity-input" type="number" name="quantity" min={1} value={quantity}/>
                        <button onClick={()=>setQuantity(quantity+1)} className="quantity-button" name="plus" type="button">+</button>
                    </div>
                    <button>Add to cart</button>
                    <button>Buy with</button>
                    <Link>More payment option</Link>
                </div>
                <section className="row gutters-sm">
                    <div className="review col-md-10">
                        <div>
                            <div>
                                <span onClick={()=> setIsComment(false)}>MÔ TẢ - ĐÁNH GIÁ</span>
                                <span onClick={()=> setIsComment(true)}>BÌNH LUẬN</span>
                            </div>
                            {isComment ? 'a' : <p>{item.description}</p>}
                        </div>
                        <div>
                            <div>Đánh giá sản phẩm</div>
                            bla bla
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div>SÁCH CÙNG TÁC GIẢ</div>
                        <div className="rsp-item">
                            {authorBook && authorBook.length > 0 && authorBook.slice(0,5).map((item, index) => (
                                <RspItem item={item} index={index} key={index}/>
                            ))}
                        </div>
                        <button>Xem thêm</button>
                    </div>
                </section>
                <section>
                    <div>Sách cùng thể loại</div>
                    <div>
                    {shuffledCategoryBook && shuffledCategoryBook.length > 0 && shuffledCategoryBook.slice(0,5).map((item, index)=>(
                        <ProductCard item={item} index={index} key={index} isBtn={false}/>
                        ))}
                    </div>
                </section>
                <section>
                    <div>Sản phẩm đã xem</div>
                </section>
            </div>
        </section>
    )
}

export default ProductDetail;