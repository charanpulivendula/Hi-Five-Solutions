import todoSlice from './reducer';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({ reducer: { todo: todoSlice.reducer } });