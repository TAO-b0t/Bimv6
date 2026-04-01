import { createSlice } from "@reduxjs/toolkit";

const titleSlice = createSlice({
    name: 'title',
    initialState: {
        name: 'เริ่มต้นโครงการ',
    },
    reducers: {
        setTitle: (state, action) => {
            state.name = action.payload;
        },
    }
});


export const { setTitle } = titleSlice.actions
export default titleSlice.reducer;
