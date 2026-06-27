import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleEntry, SelectedCellData } from '@/types/timetable';
import { selectionEngine } from '@/lib/selectionEngine';
import { parseTime, formatTime } from '@/lib/timeEngine';

export interface TimetableEngineState {
  allocations: Record<string, ScheduleEntry>;
  selectedCells: SelectedCellData[];
  selectionMode: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  isDirty: boolean;
  publishedAt: string | null;
  publishedSnapshot: {
    allocations: Record<string, ScheduleEntry>;
    gridConfig: any; // We'll store the entire grid config state here on publish
  } | null;
}

const initialState: TimetableEngineState = {
  allocations: {},
  selectedCells: [],
  selectionMode: false,
  status: 'DRAFT',
  isDirty: false,
  publishedAt: null,
  publishedSnapshot: null,
};

export const timetableEngineSlice = createSlice({
  name: 'timetableEngine',
  initialState,
  reducers: {
    assign: (state, action: PayloadAction<ScheduleEntry>) => {
      const entry = action.payload;
      if (state.allocations[entry.id]?.isLocked) return;
      state.allocations[entry.id] = entry;
      state.status = 'DRAFT';
      state.isDirty = true;
    },
    remove: (state, action: PayloadAction<string>) => {
      if (state.allocations[action.payload]?.isLocked) return;
      delete state.allocations[action.payload];
      state.status = 'DRAFT';
      state.isDirty = true;
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
      state.status = 'DRAFT';
      state.isDirty = true;
    },
    swap: (state, action: PayloadAction<{ sourceId: string; targetId: string }>) => {
      const { sourceId, targetId } = action.payload;
      const source = state.allocations[sourceId];
      const target = state.allocations[targetId];

      if (!source || source.isLocked) return;
      if (!target || target.isLocked) return;

      // Swap day and time metadata but recalculate endTime to preserve original durations
      const sourceDuration = parseTime(source.endTime) - parseTime(source.startTime);
      const targetDuration = parseTime(target.endTime) - parseTime(target.startTime);
      
      const tempDay = source.dayId;
      const tempStart = source.startTime;

      state.allocations[sourceId] = {
        ...source,
        dayId: target.dayId,
        startTime: target.startTime,
        endTime: formatTime(parseTime(target.startTime) + sourceDuration),
      };

      state.allocations[targetId] = {
        ...target,
        dayId: tempDay,
        startTime: tempStart,
        endTime: formatTime(parseTime(tempStart) + targetDuration),
      };
      state.status = 'DRAFT';
      state.isDirty = true;
    },
    merge: (state, action: PayloadAction<ScheduleEntry>) => {
      state.allocations[action.payload.id] = action.payload;
      state.status = 'DRAFT';
      state.isDirty = true;
    },
    split: (state, action: PayloadAction<string>) => {
      delete state.allocations[action.payload];
      state.status = 'DRAFT';
      state.isDirty = true;
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
      state.status = 'DRAFT';
      state.isDirty = true;
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
      let changed = false;
      Object.keys(state.allocations).forEach(key => {
        if (!state.allocations[key].isLocked) {
          delete state.allocations[key];
          changed = true;
        }
      });
      if (changed) {
        state.status = 'DRAFT';
        state.isDirty = true;
      }
    },
    setAllocations: (state, action: PayloadAction<Record<string, ScheduleEntry>>) => {
      state.allocations = action.payload;
      state.status = 'DRAFT';
      state.isDirty = true;
    },
    publishTimetable: (state, action: PayloadAction<{ gridConfig: any }>) => {
      // Must have at least one allocation to publish
      if (Object.keys(state.allocations).length === 0) return;

      state.status = 'PUBLISHED';
      state.isDirty = false;
      state.publishedAt = new Date().toISOString();
      state.publishedSnapshot = {
        allocations: { ...state.allocations },
        gridConfig: action.payload.gridConfig,
      };
    },
    markAsDraft: (state) => {
      state.status = 'DRAFT';
      state.isDirty = true;
    },
    restoreFromPublished: (state) => {
      if (state.publishedSnapshot) {
        state.allocations = { ...state.publishedSnapshot.allocations };
        state.status = 'PUBLISHED';
        state.isDirty = false;
      }
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
  publishTimetable,
  markAsDraft,
  restoreFromPublished,
} = timetableEngineSlice.actions;

export default timetableEngineSlice.reducer;
