// src/slices/menuItemsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define an initial state for the menu items
const initialState = {
  noodles: [],
  menu: [],
  status: 'idle',
  error: null,
};

// Define asynchronous thunks for fetching data
export const fetchNoodles = createAsyncThunk('menuItems/fetchNoodles', async () => {
  const response = await fetch('http://localhost:5000/api/noodle');
  if (!response.ok) throw new Error('Failed to fetch noodles');
  return response.json();
});

export const fetchMenu = createAsyncThunk('menuItems/fetchMenu', async () => {
  const response = await fetch('http://localhost:5000/api/menu');
  if (!response.ok) throw new Error('Failed to fetch menu');
  return response.json();
});

// Create a slice for the menu items
const menuItemsSlice = createSlice({
  name: 'menuItems',
  initialState,
  reducers: {
    // Define any additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNoodles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNoodles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.noodles = action.payload;
      })
      .addCase(fetchNoodles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMenu.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.menu = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default menuItemsSlice.reducer;

// Export any actions if needed
export const {} = menuItemsSlice.actions;

// Selectors
export const selectNoodles = (state) => state.menuItems.noodles;
export const selectMenu = (state) => state.menuItems.menu;
export const selectMenuStatus = (state) => state.menuItems.status;
export const selectMenuError = (state) => state.menuItems.error;
