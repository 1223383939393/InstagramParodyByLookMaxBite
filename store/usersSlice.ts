// src/store/usersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProfileFormValues } from "../schemas/profileSchema";
import { loadUsers, saveUsers } from "../utils/storage";

export type UserProfile = ProfileFormValues & {
  password: string;
};

type UsersState = {
  items: UserProfile[];
  currentUserId: string | null;
  isAuthenticated: boolean;
};

const demoUsers: UserProfile[] = [
  {
    id: "marat",
    username: "race_master",
    fullName: "Marat Safarov",
    avatarUrl:
      "https://images.unsplash.com/photo-1502767089025-6572583495b4",
    bio: "F1, симрейсинг и код. Ищу быстрый круг.",
    password: "test123",
  },
];

const initialUsers = loadUsers<UserProfile[]>(demoUsers);

const initialState: UsersState = {
  items: initialUsers,
  currentUserId: initialUsers[0]?.id ?? null,
  isAuthenticated: initialUsers[0] ? true : false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    registerUser(state, action: PayloadAction<UserProfile>) {
      state.items.push(action.payload);
      saveUsers(state.items);
    },
    loginUser(
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) {
      const user = state.items.find(
        (u) =>
          u.username === action.payload.username &&
          u.password === action.payload.password
      );
      if (user) {
        state.currentUserId = user.id;
        state.isAuthenticated = true;
      }
    },
    logout(state) {
      state.currentUserId = null;
      state.isAuthenticated = false;
    },
    updateProfile(state, action: PayloadAction<UserProfile>) {
      const idx = state.items.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
        saveUsers(state.items);
      }
    },
  },
});

export const { registerUser, loginUser, logout, updateProfile } =
  usersSlice.actions;
export default usersSlice.reducer;