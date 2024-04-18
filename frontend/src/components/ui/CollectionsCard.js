import React from "react";
import '../../assets/styles/CollectionsCard.scss';
import { useNavigate } from "react-router-dom";

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

export default CollectionsCard;