import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNoodleData = createAsyncThunk(
  'noodle/fetchNoodleData',
  async () => {
    const response = await fetch('http://localhost:5000/api/noodle');
    if (!response.ok) throw new Error('Failed to fetch noodle data');
    return response.json();
  }
);

export const fetchNoodleItemDetail = createAsyncThunk(
  'noodle/fetchNoodleItemDetail',
  async (noodleId) => {
    const response = await fetch(`http://localhost:5000/api/noodle/${noodleId}`);
    if (!response.ok) throw new Error('Failed to fetch noodle item detail');
    return response.json();
  }
);

const noodleSlice = createSlice({
  name: 'noodle',
  initialState: {
    items: [],
    selectedItem: null,
    status: 'idle',
    error: null
  },
  reducers: {
    setSelectedNoodle: (state, action) => {
      state.selectedItem = action.payload;
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNoodleData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNoodleData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNoodleData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchNoodleItemDetail.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      });
  },
} })   ; 

export default noodleSlice.reducer;
export const { setSelectedNoodle } = noodleSlice.actions;