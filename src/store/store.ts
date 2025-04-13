import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slices/toastSlice";

// Create the Redux store
const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
});

// Type definition for the root state
export type RootState = ReturnType<typeof store.getState>;

// Export the store for use in your app
export default store;
