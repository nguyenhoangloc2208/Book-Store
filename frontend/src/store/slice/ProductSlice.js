import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState ={
    books: [],
    categories: [],
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
        }
    },
})

export const {setCategoriesFromRedux, setProductsFromRedux} = productSlice.actions;
export default productSlice.reducer;

//Selector
export const selectProductState = state => state.products;
export const selectCategory = createSelector(
    selectProductState,
    productsState => productsState.categories
)
export const selectCategoryBySlug = createSelector(
    [selectCategory, (_, slug) => slug],
    (categories, slug) => categories.find(categories => categories.slug === slug)
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
