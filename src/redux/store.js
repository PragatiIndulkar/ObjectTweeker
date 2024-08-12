import { configureStore } from '@reduxjs/toolkit';
import slice from './slice';

const store = configureStore({
  reducer: {
    image: slice,
  },
});

export default store;
