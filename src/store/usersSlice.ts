import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProfileFormValues } from "../schemas/profileSchema";
import { loadUsers, saveUsers } from "../utils/storage";

export type UserProfile = ProfileFormValues;

type UsersState = {
  items: UserProfile[];
  currentUserId: string;
};

const demoUsers: UserProfile[] = [
  {
    id: "user1",
    username: "race_master",
    fullName: "Marat Safarov",
    avatarUrl: "https://images.unsplash.com/photo-1502767089025-6572583495b4",
    bio: "F1, симрейсинг и код. Дальше меньше.",
  },
  {
    id: "user2",
    username: "night_driver",
    fullName: "Night Driver",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    bio: "Люблю ночные заезды.",
  },
];

const initialState: UsersState = {
  items: loadUsers<UserProfile[]>(demoUsers),
  currentUserId: "user1",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<UserProfile>) {
      const idx = state.items.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
        saveUsers(state.items);
      }
    },
    setCurrentUser(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload;
    },
  },
});

export const { updateProfile, setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;