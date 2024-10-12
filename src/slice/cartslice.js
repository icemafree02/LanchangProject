import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    orderedItems: [],
    orderId: null,
  },
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => item.id === newItem.id && item.type === newItem.type
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload && i.type === state.items.find(item => item.id === action.payload)?.type);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload && i.type === state.items.find(item => item.id === action.payload)?.type);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeItemFromCart: (state, action) => {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (itemToRemove) {
        state.items = state.items.filter(item => !(item.id === action.payload && item.type === itemToRemove.type));
      }
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },

    clearCart: (state) => {
      state.orderedItems = [...state.items];
      state.items = [];
      // Note: We're not clearing the orderId here, as it should persist
    },
  },
});

export const { addItemToCart, increaseQuantity, decreaseQuantity, removeItemFromCart, clearCart,setOrderId } = cartSlice.actions;
export default cartSlice.reducer;
