import { setOrderPending } from '../store/slice/OrderSlice.js';
import CartService from '../services/cart.service.js';
import { toast } from "react-hot-toast";



export const AddToCartBtn = async (item, orderId, dispatch) => {
    if(item.count_in_stock === 0){
        toast.error("Out of stock!")
    } else{

        try {
            await CartService.CartCreate(item.id, 1);
            dispatch(setOrderPending({ total_quantity: 1, id: orderId }));
            toast.success('Created cart successfully');
        } catch (error) {
            if(error.response.status === 401){
            toast.error('Need to login first!');
            }
            console.error('Cart creation failed: ', error);
            try {
                await CartService.CartUpdateItems(orderId, item.id, 1);
                toast.success('Added product successfully');
            } catch (error) {
                try {
                    const data = await CartService.GetPendingOrder();
                    const orderItem = data[0].order_items.find(orderItem => orderItem.product === item.id);
                    try{
                        await CartService.ItemUpdateQuantity(orderId, orderItem, orderItem.quantity + 1);
                        toast.success('+1 quantity');
                    } catch {
                        toast.error('Out of stock!');
                    }
                } catch (error){
                    if(error.response && error.response.status !== 401){
                        toast.error('Error!');
                    }
                }
            }
        }
    }
};
