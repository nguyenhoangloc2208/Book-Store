import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectAuthorByName, selectProductByAuthor, selectProductByCategory, selectProductBySlug } from "../../store/slice/ProductSlice";
import '../../assets/styles/ProductDetail.scss';
import RspItem from "../../components/ui/RspItem";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import Fancybox from "../../components/ui/FancyBox";
import AutoPlaySlider from "../../components/ui/AutoPlaySlider";
import { numberWithCommas } from "../../utils/utils";
import { addViewedProduct, selectRandomViewedProducts } from "../../store/slice/ViewedProductsSlice";
import { AddToCartBtn } from "../../utils/AddToCartBtn";
import toast from "react-hot-toast";

const ProductDetail = () =>{
    const {slug} = useParams();
    const item = useSelector(state => selectProductBySlug(state, slug));
    const authorBook = useSelector(state => selectProductByAuthor(state, item.author));
    const author = useSelector(state => selectAuthorByName(state, item.author));
    const categoryBook = useSelector(state => selectProductByCategory(state, item.category));
    const shuffledCategoryBook = item ? [...categoryBook.filter(product => product.id !== item.id)].sort(() => Math.random() - 0.5) : [];
    const [quantity, setQuantity] = useState(1);
    const [isComment, setIsComment] = useState(false);
    const orderId = useSelector(state => state.order.idPending);
    const [thumbsSwiper, setThumbsSwiper] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const viewedProducts = useSelector(state => selectRandomViewedProducts(state, item));

    useEffect(() => {
        dispatch(addViewedProduct({ item: item }));
    }, [item, dispatch]);


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

    const handleAddToCart = async () => {
        await AddToCartBtn(item, orderId ? orderId : null, dispatch);
    }

    const handleAuthorClick = () => {
        if(author){
            navigate(`/collections/author/${author.slug}`);
        }else{
            toast.error('Error!');
        }
    }


    return(
        <section className="product-detail-container">
            <div className="product-detail row gutters-sm">

                <div className="image-container col-md-8">
                    <div className="image-thumbs-container">
                        <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={true}
                        spaceBetween={10}
                        slidesPerView={5}
                        modules={[Navigation, Thumbs]}
                        className='product-images-slider-thumbs'
                        >
                            {item && 
                            item.image.map((item, index) =>{
                                return(
                                    <>
                                        <SwiperSlide key={index}>
                                            <div className='product-images-slider-thumbs-wrapper'>
                                                <img src={item.image} alt=''/>
                                            </div>
                                        </SwiperSlide>
                                    </>
                            )
                        })}
                        </Swiper>
                    </div>
                    <div className="fancybox-container">
                        <Fancybox
                            options={{
                                Carousel: {
                                infinite: false,
                            },
                            }}
                            >
                            <Swiper
                            loop={true}
                            navigation={true}
                            modules={[Navigation, Thumbs]}
                            grabCursor={true}
                            thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
                            className='product-images-slider'
                            >
                                {item && 
                                item.image.map((item, index) =>{
                                return(
                                    <>
                                    <SwiperSlide key={index}>
                                        <a href={item.image} data-fancybox="gallery" data-caption={item.caption}>
                                        {(<img src={item.image} alt=''/>)}
                                        </a>
                                    </SwiperSlide>
                                    </>
                                )
                            })}
                            </Swiper>
                        </Fancybox>
                    </div>
                </div>


                <div className="content col-md-4">
                    <div className="author" onClick={() => handleAuthorClick()}>{item.author}</div>
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
                        <button onClick={() => handleAddToCart()} className="add-to-cart-btn">Add to cart</button>
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
                                {isComment ? 'a' : 
                                    <p>{item.description.split('\n').map((paragraph, index) => (
                                        <span key={index}>
                                            {paragraph}
                                            <br/>
                                        </span>
                                    ))}</p>
                                }    
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
                {viewedProducts && viewedProducts.length > 5 ? 
                <section className="viewed-container">
                    <div className="viewed-title clearfixx">
                        <h2>Sản phẩm đã xem</h2>
                    </div>
                    <div className="auto-play">
                        <AutoPlaySlider item={viewedProducts}/>
                    </div>
                </section> : null
                }
            </div>
                
        </section>
    )
}

export default ProductDetail;