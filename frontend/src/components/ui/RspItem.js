import '../../assets/styles/RspItem.scss';
import { numberWithCommas } from "../../utils/utils.js";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';


const RspItem = ({item}) =>{
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/products/${item.slug}`)
    }

    return(
        <div onClick={() => handleClick()} className='rsp-item-container'>
            <div className="image-container">
                <img src={item.image[0].image} width={50} alt="alt"/>
            </div>
            <div className='right-content'>
                <div className='name'>{item.name}</div>
                <div className="price-container">
                    <div className="final_price">{numberWithCommas(item.final_price)}đ</div>
                    <div className="price">{numberWithCommas(item.price)}đ</div>
                </div>
            </div>
        </div>
    )
}

RspItem.propTypes = {
    item: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        image: PropTypes.arrayOf(PropTypes.shape({
            image: PropTypes.string.isRequired
        })).isRequired,
        name: PropTypes.string.isRequired,
        final_price: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired
    }).isRequired
};

export default RspItem;