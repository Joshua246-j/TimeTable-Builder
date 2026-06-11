import { configureStore } from '@reduxjs/toolkit';
import timetableReducer from './timetableSlice';
import selectionReducer from './selectionSlice';
import mergeReducer from './mergeSlice';
import lockReducer from './lockSlice';
import allocationReducer from './allocationSlice';
import validationReducer from './validationSlice';
import subjectReducer from './subjectSlice';
import facultyReducer from './facultySlice';
import roomReducer from './roomSlice';
import uiReducer from './uiSlice';
import historyReducer from './historySlice';

export const store = configureStore({
  reducer: {
    timetable: timetableReducer,
    selection: selectionReducer,
    merge: mergeReducer,
    lock: lockReducer,
    allocation: allocationReducer,
    validation: validationReducer,
    subject: subjectReducer,
    faculty: facultyReducer,
    room: roomReducer,
    ui: uiReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
