import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedCell } from '@/types/timetableSpan';
import { selectionEngine } from '@/lib/selectionEngine';

export interface SelectionState {
  selectionMode: boolean;
  selectedCells: SelectedCell[];
}

const initialState: SelectionState = {
  selectionMode: false,
  selectedCells: [],
};

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    enableSelectionMode: (state) => {
      state.selectionMode = true;
      state.selectedCells = [];
    },
    disableSelectionMode: (state) => {
      state.selectionMode = false;
      state.selectedCells = [];
    },
    toggleCellSelection: (state, action: PayloadAction<SelectedCell>) => {
      const cell = action.payload;
      const index = state.selectedCells.findIndex((c) => c.id === cell.id);
      
      if (index !== -1) {
        // Deselect
        state.selectedCells.splice(index, 1);
        // Re-validate remaining
        if (state.selectedCells.length > 0 && !selectionEngine.isAdjacent(state.selectedCells)) {
          // If removing breaks adjacency (e.g. removed middle cell), clear all
          state.selectedCells = [];
        }
      } else {
        // Select
        if (selectionEngine.validateSelection(cell, state.selectedCells)) {
          state.selectedCells.push(cell);
          state.selectedCells.sort((a, b) => a.rowIndex - b.rowIndex);
        } else {
          // If invalid selection (e.g. wrong day, not adjacent), start a new selection
          state.selectedCells = [cell];
        }
      }
    },
    clearSelection: (state) => {
      state.selectedCells = [];
    },
  },
});

export const {
  enableSelectionMode,
  disableSelectionMode,
  toggleCellSelection,
  clearSelection,
} = selectionSlice.actions;

export default selectionSlice.reducer;
