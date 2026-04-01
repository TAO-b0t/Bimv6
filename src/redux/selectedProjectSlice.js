import { createSlice } from "@reduxjs/toolkit";

const selectedProjectSlice = createSlice({
  name: "selectedProject",
  initialState: {
    id: null,
  },
  reducers: {
    setSelectedProjectId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setSelectedProjectId } = selectedProjectSlice.actions;
export default selectedProjectSlice.reducer;
