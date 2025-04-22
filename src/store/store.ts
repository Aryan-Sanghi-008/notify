import { combineReducers, configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slices/toastSlice";
import loaderReducer from "./slices/loaderSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authslice";
import notificationReducer from "./slices/notificationSlice";

const rootReducer = combineReducers({
  toast: toastReducer,
  loader: loaderReducer,
  notifications: notificationReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "notifications"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export default store;
