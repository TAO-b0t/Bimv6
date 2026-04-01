import { createSlice } from '@reduxjs/toolkit';

const modelSlice = createSlice({
  name: 'models',
  initialState: {
    all: [],       // เก็บ model ทั้งหมดของโปรเจกต์
    selected: null // เก็บ model ที่ถูกเลือก
  },
  reducers: {
    setAllModels: (state, action) => {
      state.all = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setAllModels, setSelectedModel } = modelSlice.actions;
export default modelSlice.reducer;
