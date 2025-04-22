import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    resetAuth() {
      return { user: null };
    },    
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
