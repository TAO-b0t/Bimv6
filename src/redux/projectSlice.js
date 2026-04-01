import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../services/projectService';

// Async thunk to load projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const result = await projectService.getProjectsByCompany();
    return result;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    data: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default projectSlice.reducer;
