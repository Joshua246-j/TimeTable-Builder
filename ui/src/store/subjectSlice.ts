import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SubjectCardData } from '@/types/timetable';

export interface SubjectState {
  subjects: Record<string, SubjectCardData>;
  activeSubjectId: string | null;
}

const initialState: SubjectState = {
  subjects: {},
  activeSubjectId: null,
};

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    setSubjects: (state, action: PayloadAction<Record<string, SubjectCardData>>) => {
      state.subjects = action.payload;
    },
    addSubject: (state, action: PayloadAction<SubjectCardData>) => {
      state.subjects[action.payload.id] = action.payload;
    },
    updateSubject: (state, action: PayloadAction<SubjectCardData>) => {
      if (state.subjects[action.payload.id]?.isEditable === false) return;
      state.subjects[action.payload.id] = action.payload;
    },
    deleteSubject: (state, action: PayloadAction<string>) => {
      if (state.subjects[action.payload]?.isEditable === false) return;
      delete state.subjects[action.payload];
    },
    setActiveSubjectId: (state, action: PayloadAction<string | null>) => {
      state.activeSubjectId = action.payload;
    },
  },
});

export const { setSubjects, addSubject, updateSubject, deleteSubject, setActiveSubjectId } = subjectSlice.actions;
export default subjectSlice.reducer;
