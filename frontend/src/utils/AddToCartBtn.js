import { setOrderPending } from '../store/slice/OrderSlice';
import CartService from '../services/cart.service';
import { toast } from "react-toastify";


export const AddToCartBtn = async (item, orderId, dispatch, updateData) => {
    try {
        await CartService.CartCreate(item.id, 1);
        dispatch(setOrderPending({ total_quantity: 1, id: orderId }));
        toast.success('Tạo cart thành công');
    } catch (error) {
        console.error('Tạo cart thất bại: ', error);
        try {
            await CartService.CartUpdateItems(orderId, item.id, 1);
            toast.success('Thêm sản phẩm thành công');
        } catch (error) {
            try {
                const data = await CartService.GetPendingOrder();
                const orderItem = data[0].order_items.find(orderItem => orderItem.product === item.id);
                try{
                    await CartService.ItemUpdateQuantity(orderId, orderItem, orderItem.quantity + 1);
                    toast.success('+1 số lượng');
                } catch {
                    toast.warning('Hết hàng!');
                }
            } catch {
                toast.warning('Hết hàng!');
            }
        }
    }
    updateData();
};
