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
      
      const existingItem = state.items.find(item =>
        item.id === newItem.id &&
        item.type === newItem.type &&
        item.homeDelivery === newItem.homeDelivery &&
        item.additionalInfo === newItem.additionalInfo
      );
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    increaseQuantity: (state, action) => {
      const { id, type, homeDelivery, additionalInfo } = action.payload;
      const item = state.items.find(i => 
        i.id === id &&
        i.type === type &&
        i.homeDelivery === homeDelivery &&
        i.additionalInfo === additionalInfo
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const { id, type, homeDelivery, additionalInfo } = action.payload;
      const item = state.items.find(i => 
        i.id === id &&
        i.type === type &&
        i.homeDelivery === homeDelivery &&
        i.additionalInfo === additionalInfo
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeItemFromCart: (state, action) => {
      const { id, type, homeDelivery, additionalInfo } = action.payload;
      state.items = state.items.filter(item =>
        !(item.id === id &&
          item.type === type &&
          item.homeDelivery === homeDelivery &&
          item.additionalInfo === additionalInfo)
      );
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    clearCart: (state) => {
      state.orderedItems = [...state.items];
      state.items = [];
    },
  },
});

export const { addItemToCart, increaseQuantity, decreaseQuantity, removeItemFromCart, clearCart, setOrderId } = cartSlice.actions;
export default cartSlice.reducer;
