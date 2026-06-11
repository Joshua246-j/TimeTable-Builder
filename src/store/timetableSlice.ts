import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleEntry, TimetableCell } from '@/types/timetable';

export interface SelectedCellData {
  id: string;
  dayId: string;
  rowIndex: number;
  startTime: string;
  endTime: string;
  subjectId?: string;
}

export interface OccupancyRecord {
  occupied: boolean;
  allocationId?: string;
  mergedGroupId?: string;
}

export interface TimetableState {
  timetable: Record<string, TimetableCell>;
  mergedGroups: Record<string, ScheduleEntry>;
  selectedCells: SelectedCellData[];
  occupancyMap: Record<string, OccupancyRecord>; // key: dayId-timeSlotId OR dayId-rowIndex
  lockedSlots: Record<string, boolean>;
  selectionMode: boolean;
  editingMode: boolean;
}

const initialState: TimetableState = {
  timetable: {},
  mergedGroups: {},
  selectedCells: [],
  occupancyMap: {},
  lockedSlots: {},
  selectionMode: false,
  editingMode: false,
};

export const timetableSlice = createSlice({
  name: 'timetable',
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
    toggleCellSelection: (state, action: PayloadAction<SelectedCellData>) => {
      const cell = action.payload;
      const index = state.selectedCells.findIndex((c) => c.id === cell.id);
      if (index !== -1) {
        state.selectedCells.splice(index, 1);
      } else {
        state.selectedCells.push(cell);
        state.selectedCells.sort((a, b) => a.rowIndex - b.rowIndex);
      }
    },
    updateOccupancy: (state, action: PayloadAction<{ key: string; record: OccupancyRecord }>) => {
      state.occupancyMap[action.payload.key] = action.payload.record;
    },
    clearOccupancy: (state, action: PayloadAction<string>) => {
      delete state.occupancyMap[action.payload];
    },
    // Keep backward compat methods
    mergeSelectedCells: (state, action: PayloadAction<ScheduleEntry>) => {
      const entry = action.payload;
      state.mergedGroups[entry.id] = entry;
      state.selectedCells = [];
      state.selectionMode = false;
    },
    splitMergedGroup: (state, action: PayloadAction<string>) => {
      delete state.mergedGroups[action.payload];
    },
    lockAllocation: (state, action: PayloadAction<string>) => {
      if (state.mergedGroups[action.payload]) {
        state.mergedGroups[action.payload].isLocked = true;
      }
    },
    unlockAllocation: (state, action: PayloadAction<string>) => {
      if (state.mergedGroups[action.payload]) {
        state.mergedGroups[action.payload].isLocked = false;
      }
    },
    updateAllocation: (state, action: PayloadAction<{id: string; updates: Partial<ScheduleEntry>}>) => {
      const { id, updates } = action.payload;
      if (state.mergedGroups[id]) {
        state.mergedGroups[id] = { ...state.mergedGroups[id], ...updates };
      }
    },
    deleteAllocation: (state, action: PayloadAction<string>) => {
      delete state.mergedGroups[action.payload];
    },
    createAllocation: (state, action: PayloadAction<ScheduleEntry>) => {
      state.mergedGroups[action.payload.id] = action.payload;
    },
  },
});

export const {
  enableSelectionMode,
  disableSelectionMode,
  toggleCellSelection,
  updateOccupancy,
  clearOccupancy,
  mergeSelectedCells,
  splitMergedGroup,
  lockAllocation,
  unlockAllocation,
  updateAllocation,
  deleteAllocation,
  createAllocation,
} = timetableSlice.actions;

export default timetableSlice.reducer;
