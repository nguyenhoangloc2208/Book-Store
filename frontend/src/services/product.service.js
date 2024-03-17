import api from './api';

const productsList = () => {
    return api.get("/api/products/")
    .then((response) => {
        return response.results
    })
    .catch((error)=>{
        throw error
    })
}

const categoryList = () => {
    return api.get(`/api/products/categories`)
    .then((response)=>{
        return response.results;
    })
    .catch((error)=>{
        throw error;
    })
}

const productsRead = (id) => {
    return api.get(`/api/products/${id}/`)
}

const categoryRead = (id) => {
    return api.get(`/api/products/categories/${id}/`)
}

const ProductService = {
    productsList,
    categoryList,
    productsRead,
    categoryRead
}

export default ProductService;