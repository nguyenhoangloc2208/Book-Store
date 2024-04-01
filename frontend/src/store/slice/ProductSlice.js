import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState ={
    books: [],
    categories: [],
    authors: [],
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setCategoriesFromRedux: (state, action) =>{
            state.categories = action.payload;
        },
        setProductsFromRedux: (state, action) =>{
            state.books = action.payload;
        },
        setAuthorsFromRedux: (state, action) =>{
            state.authors = action.payload;
        },
    },
})

export const {setCategoriesFromRedux, setProductsFromRedux, setAuthorsFromRedux} = productSlice.actions;
export default productSlice.reducer;

//Selector
export const selectProductState = state => state.products;
export const selectCategory = createSelector(
    selectProductState,
    productsState => productsState.categories
)
export const selectAuthor = createSelector(
    selectProductState,
    productsState => productsState.authors
)
export const selectCategoryBySlug = createSelector(
    [selectCategory, (_, slug) => slug],
    (categories, slug) => categories.find(categories => categories.slug === slug)
)
export const selectAuthorBySlug = createSelector(
    [selectAuthor, (_, slug) => slug],
    (authors, slug) => authors.find(authors => authors.slug === slug)
)
export const selectAuthorByName = createSelector(
    [selectAuthor, (_, name) => name],
    (authors, name) => authors.find(authors => authors.name === name)
)
export const selectProduct = createSelector(
    selectProductState,
    productsState => productsState.books
)
export const selectProductByName = createSelector(
    [selectProduct, (_, name) => name],
    (books, name) => books.find(books => books.name === name)
)
export const selectProductBySlug = createSelector(
    [selectProduct, (_, slug) => slug],
    (books, slug) => books.find(books => books.slug === slug)
)
export const selectProductByCategory = createSelector(
    [selectProduct, (_, category) => category],
    (books, category) => books.filter(books => books.category === category)
)

export const selectProductByAuthor = createSelector(
    [selectProduct, (_, author) => author],
    (books, author) => books.filter(books => books.author === author)
)

export const selectProductById = createSelector(
    [selectProduct, (_, order) => order],
    (products, orderItems) => {
        if (!products || !orderItems) {
            return [];
        }
        const productIds = orderItems?.map(item => item.product);
        return products.filter(product => productIds.includes(product.id));
    }
);

export const selectProductByProductId = createSelector(
    [selectProduct, (_, uniqueProductIds) => uniqueProductIds],
    (products, uniqueProductIds) => {
        if (!products || !uniqueProductIds) {
            return [];
        }
        return products.filter(product => uniqueProductIds.includes(product.id));
    }
);