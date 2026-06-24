import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  password: string;
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

// Стартовое состояние: никто не залогинен, пользователей нет (или можешь сюда добавить демо‑юзера)
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
    registerUser(state, action: PayloadAction<UserProfile>) {
      state.items.push(action.payload);
      saveUsers(state);
    },
    loginUser(
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) {
      const { username, password } = action.payload;
      const found = state.items.find(
        (u) => u.username === username && u.password === password
      );
      if (found) {
        state.currentUserId = found.id;
        state.isAuthenticated = true;
        saveUsers(state);
      }
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

export const { registerUser, loginUser, logout, updateProfile } =
  usersSlice.actions;
export default usersSlice.reducer;