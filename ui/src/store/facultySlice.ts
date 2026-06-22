import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FacultyData } from '@/services/facultyService';

export interface FacultyState {
  faculty: Record<string, FacultyData>;
}

const initialState: FacultyState = {
  faculty: {},
};

export const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    setFaculty: (state, action: PayloadAction<Record<string, FacultyData>>) => {
      state.faculty = action.payload;
    },
    addFaculty: (state, action: PayloadAction<FacultyData>) => {
      state.faculty[action.payload.id] = action.payload;
    },
    updateFaculty: (state, action: PayloadAction<FacultyData>) => {
      if (state.faculty[action.payload.id]?.isEditable === false) return;
      state.faculty[action.payload.id] = action.payload;
    },
    deleteFaculty: (state, action: PayloadAction<string>) => {
      if (state.faculty[action.payload]?.isEditable === false) return;
      delete state.faculty[action.payload];
    },
  },
});

export const { setFaculty, addFaculty, updateFaculty, deleteFaculty } = facultySlice.actions;
export default facultySlice.reducer;
