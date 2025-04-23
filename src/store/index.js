import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    categories: categoryReducer,
  },
});