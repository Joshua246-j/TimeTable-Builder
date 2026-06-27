import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { RootState, AppDispatch } from './store';
import { assign, remove, move, swap, merge, split, updateTime, lock, unlock, clearSelection, clearAllocations, setAllocations } from './timetableEngineSlice';
import { updateSinglePeriodDurationByStartTime, updateTimeSlots, setBreaks, updatePeriodStructure, GridTimeSlot, GridBreak, updateBreakDurationAndRecalculate, removeBreakAndRecalculate } from './gridConfigSlice';
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
    
    if (state.timetableEngine.status === 'PUBLISHED') {
      dispatch(setValidationResults([]));
      return;
    }
    
    const context: ValidationContext = {
      allocations: state.timetableEngine.allocations,
      subjects: state.subject.subjects,
      faculty: state.faculty.faculty,
      rooms: state.room.rooms,
      timeSlots: state.gridConfig.timeSlots,
      breaks: state.gridConfig.breaks,
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
      
      if (source && source.rowSpan > 1) {
        const durationMins = parseTime(source.endTime) - parseTime(source.startTime);
        newEndTime = formatTime(parseTime(targetStartTime) + durationMins);
      }

      dispatch(move({
          id: sourceCellId,
          targetId: targetCellId,
          newDayId: targetDayId,
          newStartTime: targetStartTime,
          newEndTime: newEndTime
        }));
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
    const { breaks, timeSlots } = state.gridConfig;

    if (selectedCells.length < 2) return; 

    const { entry: mergedEntry, error } = mergeEngine.createMergeEntry(selectedCells, payload.subjectId, breaks, timeSlots);
    if (!mergedEntry) {
      toast.error(error || "Invalid merge selection based on strict validation rules.");
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
    const timeSlots = state.gridConfig.timeSlots;
    const startIndex = timeSlots.findIndex(t => t.startTime === merged.startTime);
    
    if (startIndex !== -1) {
      for (let i = 0; i < merged.rowSpan; i++) {
          const timeSlot = timeSlots[startIndex + i];
          if (timeSlot) {
              const allocationId = `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              dispatch(assign({
                  id: allocationId,
                  subjectId: merged.subjectId,
                  dayId: merged.dayId,
                  startTime: timeSlot.startTime,
                  endTime: timeSlot.endTime,
                  rowSpan: 1,
                  rowStart: 0,
                  isEditable: true,
                  isLocked: false
              }));
          }
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

export const updatePeriodDurationAndSync = createAsyncThunk<
  void,
  { startTime: string; durationMinutes: number },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/updatePeriodDurationAndSync',
  async (payload, { dispatch, getState }) => {
    const { startTime, durationMinutes } = payload;
    const state = getState();
    
    // Snapshot of old state
    const oldTimeSlots = state.gridConfig.timeSlots;
    const oldAllocations = state.timetableEngine.allocations;
    
    dispatch(recordSnapshot(oldAllocations));
    
    // Dispatch grid update
    dispatch(updateSinglePeriodDurationByStartTime({ startTime, durationMinutes }));
    
    // Get new state after grid update
    const newState = getState();
    const newTimeSlots = newState.gridConfig.timeSlots;
    
    // Sync allocations to new time slots
    const newAllocations: Record<string, ScheduleEntry> = {};
    
    Object.values(oldAllocations).forEach(alloc => {
       const startSlotIdx = oldTimeSlots.findIndex(ts => ts.startTime === alloc.startTime);
       
       if (startSlotIdx !== -1) {
           const newStart = newTimeSlots[startSlotIdx].startTime;
           
           let spanCount = 1;
           let endSlotIdx = startSlotIdx;
           for (let i = startSlotIdx + 1; i < oldTimeSlots.length; i++) {
              if (parseTime(oldTimeSlots[i].startTime) < parseTime(alloc.endTime)) {
                 spanCount++;
                 endSlotIdx = i;
              } else {
                 break;
              }
           }
           
           const newEnd = newTimeSlots[endSlotIdx].endTime;
           
           newAllocations[alloc.id] = {
              ...alloc,
              startTime: newStart,
              endTime: newEnd,
              rowSpan: spanCount
           };
       } else {
           newAllocations[alloc.id] = alloc;
       }
    });
    
    dispatch(setAllocations(newAllocations));
    dispatch(runValidation());
  }
);

export const applyGridConfigurationAndSync = createAsyncThunk<
  void,
  { startTime: string; duration: number; newTimeSlots: GridTimeSlot[]; newBreaks: GridBreak[] },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/applyGridConfigurationAndSync',
  async (payload, { dispatch, getState }) => {
    const { startTime, duration, newTimeSlots, newBreaks } = payload;
    const state = getState();
    
    // Snapshot of old state
    const oldTimeSlots = state.gridConfig.timeSlots;
    const oldAllocations = state.timetableEngine.allocations;
    
    dispatch(recordSnapshot(oldAllocations));
    
    // Dispatch grid updates
    dispatch(updatePeriodStructure({ startTime, duration, count: newTimeSlots.length }));
    dispatch(updateTimeSlots(newTimeSlots));
    dispatch(setBreaks(newBreaks));
    
    // Sync allocations to new time slots
    const newAllocations: Record<string, ScheduleEntry> = {};
    
    Object.values(oldAllocations).forEach(alloc => {
       const startSlotIdx = oldTimeSlots.findIndex(ts => ts.startTime === alloc.startTime);
       
       if (startSlotIdx !== -1 && startSlotIdx < newTimeSlots.length) {
           const newStart = newTimeSlots[startSlotIdx].startTime;
           
           let endSlotIdx = startSlotIdx;
           for (let i = startSlotIdx + 1; i < oldTimeSlots.length; i++) {
              if (parseTime(oldTimeSlots[i].startTime) < parseTime(alloc.endTime)) {

                 endSlotIdx = i;
              } else {
                 break;
              }
           }
           
           // Cap the end slot to the available slots in the new configuration
           endSlotIdx = Math.min(endSlotIdx, newTimeSlots.length - 1);
           
           const newEnd = newTimeSlots[endSlotIdx].endTime;
           
           newAllocations[alloc.id] = {
              ...alloc,
              startTime: newStart,
              endTime: newEnd,
              rowSpan: (endSlotIdx - startSlotIdx) + 1
           };
       } else if (startSlotIdx === -1) {
           newAllocations[alloc.id] = alloc;
       }
       // If startSlotIdx >= newTimeSlots.length, the period was deleted, so we drop the allocation implicitly.
    });
    
    dispatch(setAllocations(newAllocations));
    dispatch(runValidation());
  }
);

export const updateBreakDurationAndSync = createAsyncThunk<
  void,
  { id: string; durationMinutes: number },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/updateBreakDurationAndSync',
  async (payload, { dispatch, getState }) => {
    const { id, durationMinutes } = payload;
    const state = getState();
    
    // Snapshot old state
    const oldTimeSlots = state.gridConfig.timeSlots;
    const oldAllocations = state.timetableEngine.allocations;
    dispatch(recordSnapshot(oldAllocations));
    
    // Dispatch grid update
    dispatch(updateBreakDurationAndRecalculate({ id, durationMinutes }));
    
    // Sync allocations
    const newState = getState();
    const newTimeSlots = newState.gridConfig.timeSlots;
    
    const newAllocations: Record<string, ScheduleEntry> = {};
    Object.values(oldAllocations).forEach(alloc => {
       const startSlotIdx = oldTimeSlots.findIndex(ts => ts.startTime === alloc.startTime);
       if (startSlotIdx !== -1 && startSlotIdx < newTimeSlots.length) {
           const newStart = newTimeSlots[startSlotIdx].startTime;
           let endSlotIdx = startSlotIdx;
           for (let i = startSlotIdx + 1; i < oldTimeSlots.length; i++) {
              if (parseTime(oldTimeSlots[i].startTime) < parseTime(alloc.endTime)) {

                 endSlotIdx = i;
              } else {
                 break;
              }
           }
           endSlotIdx = Math.min(endSlotIdx, newTimeSlots.length - 1);
           const newEnd = newTimeSlots[endSlotIdx].endTime;
           newAllocations[alloc.id] = {
              ...alloc,
              startTime: newStart,
              endTime: newEnd,
              rowSpan: (endSlotIdx - startSlotIdx) + 1
           };
       } else if (startSlotIdx === -1) {
           newAllocations[alloc.id] = alloc;
       }
    });
    
    dispatch(setAllocations(newAllocations));
    dispatch(runValidation());
  }
);

export const removeBreakAndSync = createAsyncThunk<
  void,
  { id: string },
  { state: RootState; dispatch: AppDispatch }
>(
  'actions/removeBreakAndSync',
  async (payload, { dispatch, getState }) => {
    const { id } = payload;
    const state = getState();
    
    const oldTimeSlots = state.gridConfig.timeSlots;
    const oldAllocations = state.timetableEngine.allocations;
    dispatch(recordSnapshot(oldAllocations));
    
    dispatch(removeBreakAndRecalculate(id));
    
    const newState = getState();
    const newTimeSlots = newState.gridConfig.timeSlots;
    
    const newAllocations: Record<string, ScheduleEntry> = {};
    Object.values(oldAllocations).forEach(alloc => {
       const startSlotIdx = oldTimeSlots.findIndex(ts => ts.startTime === alloc.startTime);
       if (startSlotIdx !== -1 && startSlotIdx < newTimeSlots.length) {
           const newStart = newTimeSlots[startSlotIdx].startTime;
           let endSlotIdx = startSlotIdx;
           for (let i = startSlotIdx + 1; i < oldTimeSlots.length; i++) {
              if (parseTime(oldTimeSlots[i].startTime) < parseTime(alloc.endTime)) {

                 endSlotIdx = i;
              } else {
                 break;
              }
           }
           endSlotIdx = Math.min(endSlotIdx, newTimeSlots.length - 1);
           const newEnd = newTimeSlots[endSlotIdx].endTime;
           newAllocations[alloc.id] = {
              ...alloc,
              startTime: newStart,
              endTime: newEnd,
              rowSpan: (endSlotIdx - startSlotIdx) + 1
           };
       } else if (startSlotIdx === -1) {
           newAllocations[alloc.id] = alloc;
       }
    });
    
    dispatch(setAllocations(newAllocations));
    dispatch(runValidation());
  }
);
