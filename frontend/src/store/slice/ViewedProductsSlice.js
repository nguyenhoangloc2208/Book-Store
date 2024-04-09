import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  viewedProducts: [],
};

export const viewedProductsSlice = createSlice({
  name: 'viewedProducts',
  initialState,
  reducers: {
    addViewedProduct: (state, action) => {
      const { item } = action.payload;
      if (item && state.viewedProducts && !state.viewedProducts.some((p) => p.id === item.id)) {
        state.viewedProducts.unshift(item);
        if (state.viewedProducts.length > 10) {
          state.viewedProducts.pop();
        }
      }
    },
  },
});

export const { addViewedProduct } = viewedProductsSlice.actions;

export const selectRandomViewedProducts = (state, currentItem) => {
  if(currentItem && currentItem.id){
    const viewedProducts = [...(state.viewedProducts.viewedProducts || [])];
    const filteredProducts = viewedProducts.filter(product => product.id !== currentItem.id);
    const shuffledProducts = filteredProducts.sort(() => Math.random() - 0.5);
    return shuffledProducts.slice(0, 10);
  }
};  

export default viewedProductsSlice.reducer;