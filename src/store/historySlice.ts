import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleEntry } from '@/types/timetable';

export interface HistoryState {
  past: Record<string, ScheduleEntry>[];
  future: Record<string, ScheduleEntry>[];
}

const initialState: HistoryState = {
  past: [],
  future: [],
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    recordSnapshot: (state, action: PayloadAction<Record<string, ScheduleEntry>>) => {
      // Don't record if it's identical to the last snapshot
      const lastSnapshot = state.past[state.past.length - 1];
      if (lastSnapshot && JSON.stringify(lastSnapshot) === JSON.stringify(action.payload)) {
        return;
      }
      
      state.past.push(action.payload);
      state.future = []; // Clear future on new action
      
      // Limit history size to prevent memory bloat
      if (state.past.length > 50) {
        state.past.shift();
      }
    },
    pushToFuture: (state, action: PayloadAction<Record<string, ScheduleEntry>>) => {
      state.future.push(action.payload);
    },
    popPast: (state) => {
      state.past.pop();
    },
    pushToPast: (state, action: PayloadAction<Record<string, ScheduleEntry>>) => {
      state.past.push(action.payload);
    },
    popFuture: (state) => {
      state.future.pop();
    },
    clearHistory: (state) => {
      state.past = [];
      state.future = [];
    },
  },
});

export const { recordSnapshot, pushToFuture, popPast, pushToPast, popFuture, clearHistory } = historySlice.actions;
export default historySlice.reducer;
