import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectProductByAuthor, selectProductByCategory, selectProductBySlug } from "../../store/slice/ProductSlice";
import '../../assets/styles/ProductDetail.scss';
import RspItem from "../../components/ui/RspItem";

import AutoPlaySlider from "../../components/ui/AutoPlaySlider";
import { numberWithCommas } from "../../utils/utils";

const ProductDetail = () =>{
    const {slug} = useParams();
    const item = useSelector(state => selectProductBySlug(state, slug));
    const authorBook = useSelector(state => selectProductByAuthor(state, item.author));
    const categoryBook = useSelector(state => selectProductByCategory(state, item.category));
    const shuffledCategoryBook = [...categoryBook].sort(() => Math.random() - 0.5);
    const [quantity, setQuantity] = useState(1);
    const [isComment, setIsComment] = useState(false);

    const [thumbsSwiper, setThumbsSwiper] = useState();

    const handleMinusClick = () =>{
        if (quantity>1){
            setQuantity(quantity-1);
        } else{
            
        }
    }
    const handleAddClick = () =>{
        if (quantity){
            setQuantity(quantity+1);
        }
    }

    return(
        <section className="product-detail-container">
            <div className="product-detail row gutters-sm">
                <div className="image-container col-md-8">
                    <img src={item.image[0].image} alt="img"/>
                </div>
                <div className="content col-md-4">
                    <div className="author">{item.author}</div>
                    <div className="title">{item.name}</div>
                    <hr/>
                    <div className="price-content">
                    <span className="final-price">{numberWithCommas(item.final_price)}đ</span>
                        <span className="price">{numberWithCommas(item.price)}</span>
                        {item.discount_percentage > 0 && 
                            <span className="save">
                            (Bạn đã tiết kiệm được {numberWithCommas(item.price - item.final_price)}đ)
                            </span> }
                    </div>
                    <hr/>
                    <div className="quantity">
                        <div>Quantity:</div>
                        <div class="qty-input">
                            <button onClick={()=>handleMinusClick()} class="qty-count qty-count--minus" data-action="minus" type="button">-</button>
                            <input class="product-qty" type="number" name="product-qty" min="0" max="10" value={quantity}/>
                            <button onClick={()=>handleAddClick()} class="qty-count qty-count--add" data-action="add" type="button">+</button>
                        </div>
                    </div>
                    <div className="payment-btn">
                        <button className="add-to-cart-btn">Add to cart</button>
                        <button className="buy-btn">Buy with</button>
                    </div>
                </div>
                <section className="row gutters-sm">
                    <div className=" col-md-9">
                        <div className="review-container">
                            <div className="review">
                                <span className={!isComment ? 'review-title' : 'review-hide'} onClick={()=> setIsComment(false)}>MÔ TẢ - ĐÁNH GIÁ</span>
                                <span className={isComment ? 'review-title' : 'review-hide'} onClick={()=> setIsComment(true)}>BÌNH LUẬN</span>
                            </div>
                            <div className="review-content">
                                {isComment ? 'a' : <p>{item.description}</p>}    
                            </div>
                        </div>
                        <div className="rating-container">
                            <div>Đánh giá sản phẩm</div>
                            bla bla
                        </div>
                    </div>
                    <div className="same-author col-md-3">
                        <div className="title">SÁCH CÙNG TÁC GIẢ</div>
                        <div className="rsp-item">
                            {authorBook && authorBook.length > 0 && authorBook.sort(() => Math.random() - 0.5).slice(0, 5).map((item, index) => (
                                <RspItem item={item} index={index} key={index} />
                            ))}
                        </div>
                        {authorBook && authorBook.length > 5 && <div className="watch-more">
                            <button className="watch-more-btn">Xem thêm</button>
                        </div>}
                    </div>
                </section>
                <section className="same-container">
                    <div className="same-kind clearfixx">
                        <h2 >Sách cùng thể loại</h2>
                    </div>
                    <div className="auto-play">
                        <AutoPlaySlider item={shuffledCategoryBook}/>
                    </div>
                </section>
                <section className="viewed-container">
                    <div className="viewed-title clearfixx">
                        <h2>Sản phẩm đã xem</h2>
                    </div>
                </section>
            </div>
                
        </section>
    )
}

export default ProductDetail;