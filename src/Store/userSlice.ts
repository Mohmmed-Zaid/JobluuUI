// Store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getItem, removeItem, setItem } from "../Services/LocalStorageService";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  // Add more user properties as needed
}

interface UserState {
  profile: UserProfile | null;
  isProfileLoaded: boolean;
}

const initialState: UserState = {
  profile: getItem("user") || null,
  isProfileLoaded: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isProfileLoaded = true;
      setItem("user", action.payload);
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        setItem("user", state.profile);
      }
    },
    removeUser: (state) => {
      state.profile = null;
      state.isProfileLoaded = false;
      removeItem("user");
    },
    setProfileLoaded: (state, action: PayloadAction<boolean>) => {
      state.isProfileLoaded = action.payload;
    }
  }
});

// Export the actions
export const { setUser, updateUser, removeUser, setProfileLoaded } = userSlice.actions;

// Export the reducer as default
export default userSlice.reducer;