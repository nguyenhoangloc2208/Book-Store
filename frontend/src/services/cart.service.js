import api from './api';

const CartList = () => {
    return api.get("/api/user/orders/")
    .then((response) => {
        return response.results
    })
    .catch((error)=>{
        throw error
    })
}

const CartCreate = (order_items, quantity) => {
    return api.post("/api/user/orders/", {
        "status": "P",
        "order_items": [
            {
            "product": order_items,
            "quantity": quantity
            }
        ]
    })
    .catch((error) => {
        throw error
    })
}

const CartRead = (id) =>{
    return api.get(`/api/user/orders/${id}`)
    .then((response) => {
        return response.results
    })
    .catch((error) => {
        throw error
    })
}

const CartDelete = (id) => {
    return api.delete(`/api/user/orders/${id}`)
    .catch((error) => {
        throw error
    })
}

const CartReadItems = (order_id) => {
    return api.get(`/api/user/orders/${order_id}/order-items/`)
    .then((response) => {
        return response.results
    })
    .catch((error) => {
        throw error
    })
}

const CartUpdateItems = (order_id, product_id, quantity) =>{
    return api.post(`/api/user/orders/${order_id}/order-items/`, {
        "product": product_id,
        "quantity": quantity
    })
    .catch((error) => {
        throw error
    })
}

const ItemRead = (order_id, id) => {
    return api.get(`/api/user/orders/${order_id}/order-items/${id}`)
    .then((response) =>{
        return response.results
    })
    .catch((error) => {
        throw error
    })
}

const ItemUpdateQuantity = (order_id, id, quantity) => {
    return api.patch(`/api/user/orders/${order_id}/order-items/${id}`,{
        "quantity": quantity
    })
    .catch((error) => {
        throw error
    })
}

const ItemDelete = (order_id, id) => {
    return api.delete(`/api/user/orders/${order_id}/order-items/${id}`)
    .catch((error) => {
        throw error
    })
}

const CartService = {
    CartList,
    CartCreate,
    CartRead,
    CartDelete,
    CartReadItems,
    CartUpdateItems,
    ItemRead,
    ItemUpdateQuantity,
    ItemDelete,
}

export default CartService;