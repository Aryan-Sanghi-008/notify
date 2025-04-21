import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  visible: boolean;
  count: number;
}

const initialState: LoaderState = {
  visible: false,
  count: 0,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader(state) {
      state.count += 1;
      state.visible = true;
    },
    hideLoader(state) {
      state.count = Math.max(0, state.count - 1);
      state.visible = state.count > 0;
    },
    resetLoader(state) {
      state.count = 0;
      state.visible = false;
    },
  },
});

export const { showLoader, hideLoader, resetLoader } = loaderSlice.actions;
export default loaderSlice.reducer;