import { configureStore } from '@reduxjs/toolkit';
import timetableEngineReducer from './timetableEngineSlice';
import validationReducer from './validationSlice';
import subjectReducer from './subjectSlice';
import facultyReducer from './facultySlice';
import roomReducer from './roomSlice';
import uiReducer from './uiSlice';
import historyReducer from './historySlice';
import gridConfigReducer from './gridConfigSlice';
import timetableDraftReducer from './timetableDraftSlice';

/**
 * Global Redux Store Configuration.
 * Combines all feature slices (timetable engine, validation, entities, UI state)
 * into a single unified state tree for the application.
 */
export const store = configureStore({
  reducer: {
    timetableEngine: timetableEngineReducer,
    validation: validationReducer,
    subject: subjectReducer,
    faculty: facultyReducer,
    room: roomReducer,
    ui: uiReducer,
    history: historyReducer,
    gridConfig: gridConfigReducer,
    timetableDrafts: timetableDraftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
