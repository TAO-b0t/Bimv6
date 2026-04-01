// store/sidebarModeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const sidebarModeSlice = createSlice({
  name: "sidebarMode",
  initialState: {
    mode: "default", // "default" | "model"
  },
  reducers: {
    setSidebarMode: (state, action) => {
      state.mode = action.payload; // "default" หรือ "model"
    },
    resetSidebarMode: (state) => {
      state.mode = "default";
    },
  },
});

export const { setSidebarMode, resetSidebarMode } = sidebarModeSlice.actions;
export default sidebarModeSlice.reducer;
