import { createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    uri: null,
  },
  reducers: {
    setImageUri(state, action) {
      state.uri = action.payload;
    },
  },
});

export const { setImageUri } = imageSlice.actions;
export default imageSlice.reducer;
