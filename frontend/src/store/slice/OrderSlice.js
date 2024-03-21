import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total_quantity: 0,
  idPending: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderPending: (state, action) => {
        if(action.payload.total_quantity !== null & action.payload.total_quantity > 0){
            state.total_quantity = action.payload.total_quantity;
            state.idPending = action.payload.id;
        } else{
            state.total_quantity = 0;
            state.idPending = 0;
        }
    },
  },
});

export const { setOrderPending } = orderSlice.actions;
export default orderSlice.reducer;
