// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../store/postsSlice";
import usersReducer from "../store/usersSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;