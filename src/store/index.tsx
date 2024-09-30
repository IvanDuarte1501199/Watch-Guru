import { configureStore } from '@reduxjs/toolkit';
import genresReducer from '../slice/genres/genresSlice';

export const store = configureStore({
  reducer: {
    genres: genresReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;