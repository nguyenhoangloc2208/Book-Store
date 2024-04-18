import '../../assets/styles/SliderCard.scss';
import { numberWithCommas } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const SliderCard = ({item}) => {
    const navigate = useNavigate();
    const handleClickCard = () =>{
        navigate(`/products/${item.slug}`);
    }

    return(
        <>
            {item && item.image && item.image.length > 0 &&
                <div onClick={handleClickCard} className="slider-card-container">
                <div className="slider-card">
                    <div className="image-container">
                        <img src={item.image[0].image} alt="a"/>
                        <div className="discount">-{item.discount_percentage}%</div>
                    </div>
                    <div className="name">{item.name}</div>
                    <div className="price-container">
                        <div className="final_price">{numberWithCommas(item.final_price)}đ</div>
                        <div className="price">{numberWithCommas(item.price)}đ</div>
                    </div>
                </div>
            </div>}
        </>
    )
}

SliderCard.propTypes = {
    item: PropTypes.object.isRequired
};

export default SliderCard;