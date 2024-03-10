import React, { useState } from "react";
import EmptyCart from "../../components/ui/EmptyCart";
const Cart = () =>{
    const [cartItem, setCartItem] = useState([]);

    return(
        <>
            {console.log(cartItem.length)}
            {cartItem.length === 0 ? 
                <EmptyCart/>
                : 
                <div>axxxxxxxxxxxxxxxxxxxxxxxxx</div>
            }
        </>
    )
}

export default Cart;