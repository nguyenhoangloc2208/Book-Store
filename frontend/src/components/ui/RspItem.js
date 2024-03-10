import React from "react";

const RspItem = ({item, index}) =>{

    return(
        <>
            <img src={item.image[0].image} width={50} alt="alt"/>
            <div>{item.name}</div>
        </>
    )
}

export default RspItem;