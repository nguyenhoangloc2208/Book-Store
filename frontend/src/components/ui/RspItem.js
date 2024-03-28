import React from "react";
import '../../assets/styles/RspItem.scss';
import { numberWithCommas } from "../../utils/utils";


const RspItem = ({item, index}) =>{

    return(
        <div className='rsp-item-container'>
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

export default RspItem;