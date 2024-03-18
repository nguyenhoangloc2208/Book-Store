import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderPending: {},
  orderCompleted: [],
  total_quantity: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderPending: (state, action) => {
        state.orderPending = action.payload;
        console.log('action:', action.payload);
        if(action.payload.total_quantity > 0){
            state.total_quantity = action.payload.total_quantity;
        } else{
            state.total_quantity = 0;
        }
    },
    setOrderCompleted: (state, action) => {
        state.orderCompleted = action.payload;
    }
  },
});

export const { setOrderPending, setOrderCompleted } = orderSlice.actions;
export default orderSlice.reducer;
