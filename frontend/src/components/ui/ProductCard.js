import '../../assets/styles/ProductCard.scss';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { AddToCartBtn } from "../../utils/AddToCartBtn.js";
import { numberWithCommas } from "../../utils/utils.js";

const ProductCard = ({item, isBtn, orderId, updateData}) =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClickCard = () =>{
        navigate(`/products/${item.slug}`);
    }


    const handleAddtocart = async () => {
        await AddToCartBtn(item, orderId, dispatch);
        await updateData();
    }


    return(
        <>
            <div className={`product-card ${isBtn ? 'btn':'no-btn'}`} >
                <div onClick={handleClickCard} className={item.count_in_stock === 0 ? 'out-in-stock' : 'in-stock'}>Hết hàng</div>
                <div onClick={() => handleClickCard()} className="card-image-container">
                    <img className="card-image" src={item.image[0].image} alt="none"/>
                    <div className="discount">-{item.discount_percentage}%</div>
                </div>
                <h5 onClick={handleClickCard} className="card-name">{item.name} <i className="fa-solid fa-arrow-right-long"></i></h5>
                <div onClick={handleClickCard} className="card-price">
                    <div className="final_price">{numberWithCommas(item.final_price)}<span className="vnd">đ</span></div>    
                    <div className="price">{numberWithCommas(item.price)}<span className="vnd">đ</span></div>    
                </div>
                {isBtn && <button onClick={() => handleAddtocart()} className="card-btn">Add to cart</button>}
            </div>
        </>
    )
}

ProductCard.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isBtn: PropTypes.bool,
    orderId: PropTypes.string,
    updateData: PropTypes.func
};

export default ProductCard;