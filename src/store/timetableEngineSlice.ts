import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleEntry, SelectedCellData } from '@/types/timetable';
import { selectionEngine } from '@/lib/selectionEngine';

export interface TimetableEngineState {
  allocations: Record<string, ScheduleEntry>;
  selectedCells: SelectedCellData[];
  selectionMode: boolean;
}

const initialState: TimetableEngineState = {
  allocations: {},
  selectedCells: [],
  selectionMode: false,
};

export const timetableEngineSlice = createSlice({
  name: 'timetableEngine',
  initialState,
  reducers: {
    assign: (state, action: PayloadAction<ScheduleEntry>) => {
      const entry = action.payload;
      if (state.allocations[entry.id]?.isLocked) return;
      state.allocations[entry.id] = entry;
    },
    remove: (state, action: PayloadAction<string>) => {
      if (state.allocations[action.payload]?.isLocked) return;
      delete state.allocations[action.payload];
    },
    move: (state, action: PayloadAction<{ id: string; targetId?: string; newDayId: string; newStartTime: string; newEndTime: string }>) => {
      const { id, newDayId, newStartTime, newEndTime } = action.payload;
      const entry = state.allocations[id];
      if (!entry || entry.isLocked) return;

      state.allocations[id] = {
        ...entry,
        dayId: newDayId,
        startTime: newStartTime,
        endTime: newEndTime,
      };
    },
    swap: (state, action: PayloadAction<{ sourceId: string; targetId: string }>) => {
      const { sourceId, targetId } = action.payload;
      const source = state.allocations[sourceId];
      const target = state.allocations[targetId];

      if (!source || source.isLocked) return;
      if (!target || target.isLocked) return;

      // Swap day and time metadata but keep everything else identical
      const tempDay = source.dayId;
      const tempStart = source.startTime;
      const tempEnd = source.endTime;

      state.allocations[sourceId] = {
        ...source,
        dayId: target.dayId,
        startTime: target.startTime,
        endTime: target.endTime,
      };

      state.allocations[targetId] = {
        ...target,
        dayId: tempDay,
        startTime: tempStart,
        endTime: tempEnd,
      };
    },
    merge: (state, action: PayloadAction<ScheduleEntry>) => {
      state.allocations[action.payload.id] = action.payload;
    },
    split: (state, action: PayloadAction<string>) => {
      delete state.allocations[action.payload];
    },
    updateTime: (state, action: PayloadAction<{ id: string; newStartTime: string; newEndTime: string; newRowSpan: number }>) => {
      const { id, newStartTime, newEndTime, newRowSpan } = action.payload;
      const entry = state.allocations[id];
      if (!entry || entry.isLocked) return;

      state.allocations[id] = {
        ...entry,
        startTime: newStartTime,
        endTime: newEndTime,
        rowSpan: newRowSpan,
      };
    },
    lock: (state, action: PayloadAction<string>) => {
      if (state.allocations[action.payload]) {
        state.allocations[action.payload].isLocked = true;
      }
    },
    unlock: (state, action: PayloadAction<string>) => {
      if (state.allocations[action.payload]) {
        state.allocations[action.payload].isLocked = false;
      }
    },
    // Selection mode
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
        // Re-validate remaining adjacency (basic check since selectionEngine is imported elsewhere or we can just clear if not adjacent)
        // Since we can't easily import selectionEngine here due to circular deps maybe, wait, let's see if we can.
        // Actually, let's just do a simple check. If they are not adjacent, clear.
        if (state.selectedCells.length > 0) {
          if (!selectionEngine.isAdjacent(state.selectedCells)) {
            state.selectedCells = [];
          }
        }
      } else {
        // Validation: must be same day
        if (state.selectedCells.length > 0 && state.selectedCells[0].day !== cell.day) {
          state.selectedCells = [cell];
        } else {
          // Check adjacency
          state.selectedCells.push(cell);
          if (!selectionEngine.isAdjacent(state.selectedCells)) {
            // Start new selection if not adjacent
            state.selectedCells = [cell];
          }
        }
      }
    },
    clearSelection: (state) => {
      state.selectedCells = [];
    },
    clearAllocations: (state) => {
      Object.keys(state.allocations).forEach(key => {
        if (!state.allocations[key].isLocked) {
          delete state.allocations[key];
        }
      });
    },
    setAllocations: (state, action: PayloadAction<Record<string, ScheduleEntry>>) => {
      state.allocations = action.payload;
    }
  },
});

export const {
  assign,
  remove,
  move,
  swap,
  merge,
  split,
  updateTime,
  lock,
  unlock,
  enableSelectionMode,
  disableSelectionMode,
  toggleCellSelection,
  clearSelection,
  clearAllocations,
  setAllocations,
} = timetableEngineSlice.actions;

export default timetableEngineSlice.reducer;
