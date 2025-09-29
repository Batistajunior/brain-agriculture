import { configureStore } from "@reduxjs/toolkit";
import producerReducer from "./producerSlice";  // 👈 mudou o caminho

export const store = configureStore({
  reducer: {
    producer: producerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
