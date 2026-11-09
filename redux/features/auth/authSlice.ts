import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/app/types";

export type UserItmes = IUser;

interface AuthState {
  token: string;
  user: IUser | null;
  isAuthLoading: boolean;
}

const initialState: AuthState = {
  token: "",
  user: null,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },

    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: UserItmes }>,
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthLoading = false;
    },

    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
      state.isAuthLoading = false;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isAuthLoading = action.payload;
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut, setAuthLoading } =
  authSlice.actions;

export default authSlice.reducer;
