import '../../assets/styles/CollectionsCard.scss';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const CollectionsCard = ({item, index}) =>{
    const navigate = useNavigate();

    const handleClickCategory = () =>{
        navigate(`/collections/${item.slug}`);
    }

    return(
        <div onClick={() => handleClickCategory()} className="card" key={index}>
            <div className="card-image-container">
                <img className="card-image" src={item.image} alt={item.name}/>
            </div>
                <h2 className="card-name">{item.name} <i className="fa-solid fa-arrow-right-long"></i></h2>
        </div>
    )
}

CollectionsCard.propTypes = {
    item: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired
};

export default CollectionsCard;