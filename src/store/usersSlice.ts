// src/store/usersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  password?: string; // пароль из API можно не хранить обязательно
};

export type UsersState = {
  items: UserProfile[];
  currentUserId: string | null;
  isAuthenticated: boolean;
};

const USERS_STORAGE_KEY = "lmbq_users";

function loadUsers(): UsersState | null {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UsersState;
  } catch {
    return null;
  }
}

function saveUsers(state: UsersState) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // игнорируем ошибки записи
  }
}

const defaultState: UsersState = {
  items: [],
  currentUserId: null,
  isAuthenticated: false,
};

const initialState: UsersState = loadUsers() ?? defaultState;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // регистрируем/обновляем пользователя из бекенда
    upsertUser(state, action: PayloadAction<UserProfile>) {
      const user = action.payload;
      const idx = state.items.findIndex((u) => u.id === user.id);
      if (idx === -1) {
        state.items.push(user);
      } else {
        state.items[idx] = user;
      }
      saveUsers(state);
    },
    // логин по id пользователя (из API)
    setCurrentUser(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload;
      state.isAuthenticated = true;
      saveUsers(state);
    },
    logout(state) {
      state.currentUserId = null;
      state.isAuthenticated = false;
      saveUsers(state);
    },
    updateProfile(state, action: PayloadAction<UserProfile>) {
      const idx = state.items.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
        saveUsers(state);
      }
    },
  },
});

export const { upsertUser, setCurrentUser, logout, updateProfile } =
  usersSlice.actions;
export default usersSlice.reducer;