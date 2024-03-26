import api from './api';

const PaymentList = () => {
    return api.get("/api/user/payments/")
    .then((response) => {
        return response.results
    })
    .catch((error)=>{
        throw error
    })
}

const PaymentCreate = (payment_option, order) => {
    return api.post("/api/user/payments/", {
        "payment_option": payment_option,
        "order": order
      })
    .catch((error) => {
        throw error
    })
}

const PaymentUpdate = (payment_option, order, id) => {
    return api.patch(`/api/user/payments/${id}/`, {
        "payment_option": payment_option,
        "order": order
    })
    .catch((error) => {
        throw error
    })
}

const Checkout = (payment_id, address_id, order_id) => {
    return api.put(`/api/user/payments/checkout/${order_id}/`,{
        "payment_id": payment_id,
        "address_id": address_id
    })
    .catch((error) => {
        throw error
    })
}

const StripePayment = (order_id) => {
    return api.post(`/api/user/payments/stripe/create-checkout-session/${order_id}/`)
    .catch((error) => {
        throw error
    })
}

const PaymentService = {
    PaymentList,
    PaymentCreate,
    PaymentUpdate,
    Checkout,
    StripePayment
}

export default PaymentService;