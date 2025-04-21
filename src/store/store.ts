import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slices/toastSlice";
import loaderReducer from "./slices/loaderSlice"
import notificationReducer  from "./slices/notificationSlice";

// Create the Redux store
const store = configureStore({
  reducer: {
    toast: toastReducer,
    loader: loaderReducer,
    notifications: notificationReducer,
  },
});

// Type definition for the root state
export type RootState = ReturnType<typeof store.getState>;

// Export the store for use in your app
export default store;
