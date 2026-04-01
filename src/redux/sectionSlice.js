import { createSlice } from '@reduxjs/toolkit';

const sectionSlice = createSlice({
  name: 'section',
  initialState: {
    active: null,
  },
  reducers: {
    setActiveSection: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { setActiveSection } = sectionSlice.actions;
export default sectionSlice.reducer;
