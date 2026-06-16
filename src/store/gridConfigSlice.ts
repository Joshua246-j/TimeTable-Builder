import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIME_SLOTS, WEEK_DAYS } from '@/constants/timetable';
import { recalculateSequentialTimes } from '@/lib/timeEngine';

export interface GridTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  durationMinutes?: number;
}

export interface GridDay {
  id: string;
  name: string;
  shortName: string;
  enabled: boolean;
}

export interface GridBreak {
  id: string;
  afterPeriodId: string; // The break comes after this period ID
  durationMinutes: number;
  label: string;
  type: 'Lunch Break' | 'Tea Break' | 'Assembly Break' | 'Custom Break';
}

export interface GridConfigState {
  isGridEditMode: boolean;
  days: GridDay[];
  timeSlots: GridTimeSlot[];
  breaks: GridBreak[];
  
  // Period Structure settings
  startTime: string; // e.g., '09:00 AM'
  defaultPeriodDuration: number;
  numberOfPeriods: number;
}

const initialDays = WEEK_DAYS.map((d, i) => ({
  id: `day-${i}`,
  name: d,
  shortName: d.substring(0, 3),
  enabled: d !== 'Saturday'
}));

const initialState: GridConfigState = {
  isGridEditMode: false,
  days: initialDays,
  timeSlots: [...TIME_SLOTS].map(t => ({...t, durationMinutes: 60})),
  breaks: [{
    id: 'lunch-break',
    afterPeriodId: TIME_SLOTS[3]?.id || '4',
    durationMinutes: 60,
    label: 'Lunch Break',
    type: 'Lunch Break'
  }],
  startTime: '09:00 AM',
  defaultPeriodDuration: 60,
  numberOfPeriods: 8
};

export const gridConfigSlice = createSlice({
  name: 'gridConfig',
  initialState,
  reducers: {
    toggleGridEditMode: (state) => {
      state.isGridEditMode = !state.isGridEditMode;
    },
    toggleDay: (state, action: PayloadAction<{ name: string; enabled: boolean }>) => {
      const day = state.days.find(d => d.name === action.payload.name);
      if (day) {
        day.enabled = action.payload.enabled;
      }
    },
    reorderDays: (state, action: PayloadAction<GridDay[]>) => {
      state.days = action.payload;
    },
    updateTimeSlots: (state, action: PayloadAction<GridTimeSlot[]>) => {
      state.timeSlots = action.payload;
    },
    addBreak: (state, action: PayloadAction<GridBreak>) => {
      state.breaks.push(action.payload);
    },
    removeBreak: (state, action: PayloadAction<string>) => {
      state.breaks = state.breaks.filter(b => b.id !== action.payload);
    },
    setBreaks: (state, action: PayloadAction<GridBreak[]>) => {
      state.breaks = action.payload;
    },
    updateBreak: (state, action: PayloadAction<{id: string; updates: Partial<GridBreak>}>) => {
      const idx = state.breaks.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) {
        state.breaks[idx] = { ...state.breaks[idx], ...action.payload.updates };
      }
    },
    updatePeriodStructure: (state, action: PayloadAction<{ startTime: string; duration: number; count: number }>) => {
      state.startTime = action.payload.startTime;
      state.defaultPeriodDuration = action.payload.duration;
      state.numberOfPeriods = action.payload.count;
      
      // Regenerate time slots
      const items = [];
      for (let i = 1; i <= state.numberOfPeriods; i++) {
        items.push({ id: `${i}`, durationMinutes: state.defaultPeriodDuration });
      }
      
      const newTimes = recalculateSequentialTimes(state.startTime, items);
      state.timeSlots = newTimes.map((t, idx) => ({
        id: t.id,
        startTime: t.startTime,
        endTime: t.endTime,
        label: `Period ${idx + 1}`,
        durationMinutes: t.durationMinutes
      }));
    }
  }
});

export const {
  toggleGridEditMode,
  toggleDay,
  reorderDays,
  updateTimeSlots,
  addBreak,
  removeBreak,
  updateBreak,
  setBreaks,
  updatePeriodStructure
} = gridConfigSlice.actions;

export default gridConfigSlice.reducer;
