import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from './store';
import { assign, remove, move, swap, merge, split, updateTime, lock, unlock, clearSelection, clearAllocations, setAllocations } from './timetableEngineSlice';
import { recordSnapshot, pushToFuture, pushToPast, popPast, popFuture } from './historySlice';
import { ScheduleEntry } from '@/types/timetable';
import { validationEngine, ValidationContext } from '@/lib/validationEngine';
import { mergeEngine } from '@/lib/mergeEngine';
import { setValidationResults } from './validationSlice';
import { parseTime, formatTime, calculateDurationMinutes } from '@/lib/timeEngine';
import { deleteSubject } from './subjectSlice';

// Centralized Synthetic Actions

export const runValidation = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/runValidation',
  async (_, { dispatch, getState }) => {
    const state = getState();
    
    const context: ValidationContext = {
      allocations: state.timetableEngine.allocations,
      subjects: state.subject.subjects,
      faculty: state.faculty.faculty,
      rooms: state.room.rooms,
    };
    
    const results = validationEngine.validateAll(context);
    dispatch(setValidationResults(results));
  }
);

export const undoAction = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/undoAction',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const { past } = state.history;
    
    if (past.length === 0) return;
    
    const previousState = past[past.length - 1];
    const currentState = state.timetableEngine.allocations;
    
    dispatch(pushToFuture(currentState));
    dispatch(popPast());
    dispatch(setAllocations(previousState));
    dispatch(runValidation());
  }
);

export const redoAction = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/redoAction',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const { future } = state.history;
    
    if (future.length === 0) return;
    
    const nextState = future[future.length - 1];
    const currentState = state.timetableEngine.allocations;
    
    dispatch(pushToPast(currentState));
    dispatch(popFuture());
    dispatch(setAllocations(nextState));
    dispatch(runValidation());
  }
);

export const clearAllAllocations = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/clearAllAllocations',
  async (_, { dispatch, getState }) => {
    const state = getState();
    dispatch(recordSnapshot(state.timetableEngine.allocations));
    dispatch(clearAllocations());
    dispatch(runValidation());
  }
);

export const assignSubject = createAsyncThunk<
  void,
  { cellId: string; subjectId: string; dayId: string; startTime: string; endTime: string; isLocked?: boolean },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/assignSubject',
  async (payload, { dispatch, getState }) => {
    const { cellId, subjectId, dayId, startTime, endTime, isLocked = false } = payload;
    const state = getState();

    // Check if locked
    if (state.timetableEngine.allocations[cellId]?.isLocked) {
      return; 
    }

    dispatch(recordSnapshot(state.timetableEngine.allocations));

    // Generate unique ID for allocation
    const allocationId = `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const allocation: ScheduleEntry = {
      id: allocationId,
      subjectId,
      dayId,
      startTime,
      endTime,
      rowSpan: 1,
      rowStart: 0,
      isEditable: true,
      isLocked,
    };

    dispatch(assign(allocation));
    dispatch(runValidation());
  }
);

export const removeSubjectAssignment = createAsyncThunk<
  void,
  { cellId: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/removeSubjectAssignment',
  async (payload, { dispatch, getState }) => {
    const { cellId } = payload;
    const state = getState();

    const previousAllocation = state.timetableEngine.allocations[cellId];
    if (previousAllocation && !previousAllocation.isLocked) {
      dispatch(recordSnapshot(state.timetableEngine.allocations));
      dispatch(remove(cellId));
      dispatch(runValidation());
    }
  }
);

export const swapSubjectAssignments = createAsyncThunk<
  void,
  { sourceCellId: string; targetCellId: string; targetDayId?: string; targetStartTime?: string; targetEndTime?: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/swapSubjectAssignments',
  async (payload, { dispatch, getState }) => {
    const { sourceCellId, targetCellId, targetDayId, targetStartTime, targetEndTime } = payload;
    const state = getState();

    const source = state.timetableEngine.allocations[sourceCellId];
    const target = state.timetableEngine.allocations[targetCellId];
    
    if (source?.isLocked || target?.isLocked) return;
    if (!source && !target) return;

    dispatch(recordSnapshot(state.timetableEngine.allocations));

    if (source && target) {
      dispatch(swap({ sourceId: sourceCellId, targetId: targetCellId }));
    } else if (source && !target && targetDayId && targetStartTime) {
      // Just a move to an empty slot
      let newEndTime = targetEndTime || targetStartTime;
      const timeSlots = state.gridConfig.timeSlots;
      const slotIndex = timeSlots.findIndex(t => t.startTime === targetStartTime);
      
      if (slotIndex !== -1) {
        if (source && source.rowSpan > 1) {
          const endSlotIndex = slotIndex + source.rowSpan - 1;
          if (endSlotIndex < timeSlots.length) {
             newEndTime = timeSlots[endSlotIndex].endTime;
          }
        }

        dispatch(move({
          id: sourceCellId,
          targetId: targetCellId,
          newDayId: targetDayId,
          newStartTime: targetStartTime,
          newEndTime: newEndTime
        }));
      }
    }
    
    dispatch(runValidation());
  }
);

export const mergeSelectedPeriods = createAsyncThunk<
  void,
  { subjectId: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/mergeSelectedPeriods',
  async (payload, { dispatch, getState }) => {
    const state = getState();
    const { selectedCells } = state.timetableEngine;

    if (selectedCells.length < 2) return; 

    const mergedEntry = mergeEngine.createMergeEntry(selectedCells, payload.subjectId);
    if (!mergedEntry) {
      alert("Invalid merge selection based on strict validation rules.");
      return;
    }

    dispatch(recordSnapshot(state.timetableEngine.allocations));

    // Remove old single allocations that are being merged
    selectedCells.forEach(cell => dispatch(remove(cell.id)));

    dispatch(merge(mergedEntry));
    dispatch(clearSelection());
    dispatch(runValidation());
  }
);

export const splitMergedPeriod = createAsyncThunk<
  void,
  { mergedId: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/splitMergedPeriod',
  async (payload, { dispatch, getState }) => {
    const state = getState();
    const merged = state.timetableEngine.allocations[payload.mergedId];

    if (!merged || merged.isLocked) return;

    dispatch(recordSnapshot(state.timetableEngine.allocations));
    dispatch(split(payload.mergedId));

    // Recreate single entries
    const startMins = parseTime(merged.startTime);
    for (let i = 0; i < merged.rowSpan; i++) {
        const slotStart = startMins + (i * 60);
        const slotEnd = slotStart + 60;
        const timeSlot = state.gridConfig.timeSlots.find(t => t.startTime === formatTime(slotStart));
        if (timeSlot) {
            const allocationId = `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            dispatch(assign({
                id: allocationId,
                subjectId: merged.subjectId,
                dayId: merged.dayId,
                startTime: formatTime(slotStart),
                endTime: formatTime(slotEnd),
                rowSpan: 1,
                rowStart: 0,
                isEditable: true,
                isLocked: false
            }));
        }
    }
    
    dispatch(runValidation());
  }
);

export const toggleLockSlot = createAsyncThunk<
  void,
  { id: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/toggleLockSlot',
  async (payload, { dispatch, getState }) => {
    const state = getState();
    const alloc = state.timetableEngine.allocations[payload.id];
    
    if (!alloc) return;

    dispatch(recordSnapshot(state.timetableEngine.allocations));

    if (alloc.isLocked) {
      dispatch(unlock(payload.id));
    } else {
      dispatch(lock(payload.id));
    }
  }
);

export const updateTimeAllocation = createAsyncThunk<
  void,
  { id: string; subjectId: string; dayId: string; startTime: string; endTime: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/updateTimeAllocation',
  async (payload, { dispatch, getState }) => {
    const { id, dayId, startTime, endTime } = payload;
    const state = getState();
    
    const durationMins = calculateDurationMinutes(startTime, endTime);
    const defaultDuration = state.gridConfig.defaultPeriodDuration || 60;
    const rowSpan = Math.max(1, Math.round(durationMins / defaultDuration));

    dispatch(recordSnapshot(state.timetableEngine.allocations));

    dispatch(updateTime({
        id,
        newStartTime: startTime,
        newEndTime: endTime,
        newRowSpan: rowSpan
    }));

    // If day changed, we need a full move
    const alloc = state.timetableEngine.allocations[id];
    if (alloc && alloc.dayId !== dayId) {
        dispatch(move({
            id,
            newDayId: dayId,
            newStartTime: startTime,
            newEndTime: endTime
        }));
    }

    dispatch(runValidation());
  }
);

export const deleteSubjectGlobal = createAsyncThunk<
  void,
  { subjectId: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/deleteSubjectGlobal',
  async (payload, { dispatch, getState }) => {
    const { subjectId } = payload;
    const state = getState();
    
    dispatch(recordSnapshot(state.timetableEngine.allocations));

    Object.values(state.timetableEngine.allocations).forEach(alloc => {
      if (alloc.subjectId === subjectId) {
        dispatch(remove(alloc.id));
      }
    });

    dispatch(deleteSubject(subjectId));
    dispatch(runValidation());
  }
);

export const swapAssignmentSubject = createAsyncThunk<
  void,
  { cellId: string; newSubjectId: string; dayId?: string; startTime?: string; endTime?: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/swapAssignmentSubject',
  async (payload, { dispatch, getState }) => {
    const { cellId, newSubjectId, dayId, startTime, endTime } = payload;
    const state = getState();
    const alloc = state.timetableEngine.allocations[cellId];

    dispatch(recordSnapshot(state.timetableEngine.allocations));

    if (alloc && !alloc.isLocked) {
        // Just update the subject ID inline
        dispatch(assign({
            ...alloc,
            subjectId: newSubjectId
        }));
    } else if (!alloc && dayId && startTime && endTime) {
        dispatch(assignSubject({ cellId, subjectId: newSubjectId, dayId, startTime, endTime }));
    }
    
    dispatch(runValidation());
  }
);

export const autoAllocate = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/autoAllocate',
  async (_, { dispatch }) => {
    alert("Auto Allocate Engine initiated. (Integration point for future heuristic solver)");
    dispatch(runValidation());
  }
);
