import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  selectedSemester: string;
  selectedDepartment: string;
  selectedSection: string;
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: 'light',
  selectedSemester: 'Odd Sem 2024-25',
  selectedDepartment: 'CSE Department',
  selectedSection: 'Section V A',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setSemester: (state, action: PayloadAction<string>) => {
      state.selectedSemester = action.payload;
    },
    setDepartment: (state, action: PayloadAction<string>) => {
      state.selectedDepartment = action.payload;
    },
    setSection: (state, action: PayloadAction<string>) => {
      state.selectedSection = action.payload;
    },
  },
});

export const { 
  setSidebarOpen, 
  toggleSidebar, 
  setTheme,
  setSemester,
  setDepartment,
  setSection
} = uiSlice.actions;
export default uiSlice.reducer;
