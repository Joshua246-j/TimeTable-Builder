import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// A generic action structure for undo/redo
export interface ActionRecord {
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface HistoryState {
  past: ActionRecord[];
  future: ActionRecord[];
}

const initialState: HistoryState = {
  past: [],
  future: [],
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    recordAction: (state, action: PayloadAction<ActionRecord>) => {
      state.past.push(action.payload);
      state.future = []; // Clear future on new action
      // Optional: limit history size to prevent memory bloat
      if (state.past.length > 50) {
        state.past.shift();
      }
    },
    undoHistory: (state) => {
      if (state.past.length > 0) {
        const lastAction = state.past.pop();
        if (lastAction) {
          state.future.push(lastAction);
        }
      }
    },
    redoHistory: (state) => {
      if (state.future.length > 0) {
        const nextAction = state.future.pop();
        if (nextAction) {
          state.past.push(nextAction);
        }
      }
    },
    clearHistory: (state) => {
      state.past = [];
      state.future = [];
    },
  },
});

export const { recordAction, undoHistory, redoHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
