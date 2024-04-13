import api from './api';

const productsList = () => {
    return api.get("/api/products/",{
        requiresAuth: false,
    })
    .then((response) => {
        return response.results
    })
    .catch((error)=>{
        throw error
    })
}

const categoryList = () => {
    return api.get(`/api/products/categories`,{
        requiresAuth: false,
    })
    .then((response)=>{
        return response.results;
    })
    .catch((error)=>{
        throw error;
    })
}

const productsRead = (id) => {
    return api.get(`/api/products/${id}/`,{
        requiresAuth: false,
    })
    .catch((error)=>{
        throw error;
    })
}

const categoryRead = (id) => {
    return api.get(`/api/products/categories/${id}/`,{
        requiresAuth: false,
    })
}

const ProductService = {
    productsList,
    categoryList,
    productsRead,
    categoryRead
}

export default ProductService;