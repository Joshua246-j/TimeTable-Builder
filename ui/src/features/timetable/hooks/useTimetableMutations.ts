import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { 
  assignSubject, 
  removeSubjectAssignment, 
  updateTimeAllocation, 
  swapSubjectAssignments, 
  swapAssignmentSubject 
} from '@/store/syntheticActions';
import { updateSubject } from '@/store/subjectSlice';
import { mergeEngine } from '@/lib/mergeEngine';
import { isOverlap, parseTime } from '@/lib/timeEngine';
import { TimetableData, TimetableCell, SubjectCardData } from '@/types/timetable';
import { toast } from 'sonner';
import { store } from '@/store/store';

interface UseTimetableMutationsProps {
  timetableData: TimetableData;
  setPendingMergeSuggestion: (suggestion: { subjectId: string; cellsToMerge: { id: string; rowIndex: number; dayId: string; startTime: string; endTime: string; subjectId: string }[] } | null) => void;
  setEditingGroup: (id: string | null) => void;
  setPendingTimeChange: (change: { sourceCellId: string; sourceSubjectId: string; dayId: string; newStart: string; newEnd: string; targetCellId?: string; targetSubjectId?: string; isConflict: boolean; } | null) => void;
  editingGroupId: string | null;
  setSelectedCellId: (id: string | undefined) => void;
}

export function useTimetableMutations({
  timetableData,
  setPendingMergeSuggestion,
  setEditingGroup,
  setPendingTimeChange,
  editingGroupId,
  setSelectedCellId
}: UseTimetableMutationsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const allocations = useSelector((state: RootState) => state.timetableEngine.allocations);

  const checkMergeEligibility = useCallback((dayId: string, startTime: string, subjectId: string) => {
    setTimeout(() => {
      const latestState = store.getState();
      const latestAllocations = Object.values(latestState.timetableEngine.allocations);
      
      const newAlloc = latestAllocations.find(a => 
        (a.dayId === dayId || a.dayId === dayId.split('-')[0]) && 
        a.startTime === startTime
      );

      if (newAlloc) {
        const simulatedCells = latestAllocations.map(a => ({
          id: a.id,
          rowIndex: timetableData.timeSlots.findIndex(t => t.startTime === a.startTime),
          day: a.dayId,
          assignment: { subjectId: a.subjectId }
        }));

        const timeSlotIndex = timetableData.timeSlots.findIndex(t => t.startTime === newAlloc.startTime);
        const suggestions = mergeEngine.suggestAutoMerge(timeSlotIndex, newAlloc.dayId, subjectId, simulatedCells);

        if (suggestions.length > 1) {
          const cellsToMerge = simulatedCells.filter(c => suggestions.includes(c.id)).map(c => {
             const matchingAlloc = latestAllocations.find(a => a.id === c.id);
             return {
               id: c.id,
               rowIndex: c.rowIndex,
               dayId: c.day,
               startTime: matchingAlloc?.startTime || "",
               endTime: matchingAlloc?.endTime || "",
               subjectId
             };
          });
          
          setPendingMergeSuggestion({ subjectId, cellsToMerge });
        }
      }
    }, 100);
  }, [timetableData.timeSlots, setPendingMergeSuggestion]);

  const handleUpdateSubject = useCallback((updatedSubject: SubjectCardData) => {
    dispatch(updateSubject(updatedSubject));
  }, [dispatch]);

  const handleRemoveSlot = useCallback((cellId: string) => {
    dispatch(removeSubjectAssignment({ cellId }));
  }, [dispatch]);

  const handleAssignSlot = useCallback((cell: TimetableCell, subjectId: string) => {
    dispatch(assignSubject({ cellId: cell.id, subjectId, dayId: cell.day, startTime: cell.startTime, endTime: cell.endTime }));
    setSelectedCellId(undefined);
    checkMergeEligibility(cell.day, cell.startTime, subjectId);
  }, [dispatch, checkMergeEligibility, setSelectedCellId]);

  const handleEditTime = useCallback((cell: TimetableCell) => {
    if (!cell.isAssigned || !cell.assignment) return;
    const activeGroup = Object.values(allocations).find(a => 
      (a.dayId === cell.day) && 
      isOverlap({ startTime: a.startTime, endTime: a.endTime }, { startTime: cell.startTime, endTime: cell.endTime })
    );
    
    if (activeGroup) {
      setEditingGroup(activeGroup.id);
    }
  }, [allocations, setEditingGroup]);

  const onSaveEdit = useCallback((subj: { id: string }, updatedTime: { startTime: string; endTime: string } | null, swappedSubjId: string | undefined) => {
    const targetSubjId = swappedSubjId || subj.id;
    if (!targetSubjId || targetSubjId.startsWith('assign-')) {
      toast.error("Please select a valid subject to assign.");
      return;
    }
    
    if (editingGroupId) {
      const entry = allocations[editingGroupId];
      if (entry) {
        const originalStartTime = entry.startTime;
        const originalEndTime = entry.endTime;
        
        if (updatedTime && (updatedTime.startTime !== originalStartTime || updatedTime.endTime !== originalEndTime)) {
           // Snap to nearest grid slot start time
           const snappedSlot = timetableData.timeSlots.reduce((prev, curr) => {
              const diffPrev = Math.abs(parseTime(curr.startTime) - parseTime(updatedTime.startTime));
              const diffCurr = Math.abs(parseTime(prev.startTime) - parseTime(updatedTime.startTime));
              return diffPrev < diffCurr ? curr : prev;
           }, timetableData.timeSlots[0]);
           
           const finalStartTime = snappedSlot.startTime;
           
           // Check for conflicts
           const targetSlots = timetableData.timeSlots.filter(t => {
             return isOverlap({ startTime: t.startTime, endTime: t.endTime }, { startTime: finalStartTime, endTime: updatedTime.endTime });
           });

           let conflictCellId = null;

           for (const slot of targetSlots) {
             const targetCell = timetableData.cells.find(c => c.day === entry.dayId && c.startTime === slot.startTime);
             if (targetCell) {
               const targetAlloc = Object.values(allocations).find(g => 
                 (g.dayId === entry.dayId || g.dayId === targetCell.day) && 
                 isOverlap({ startTime: g.startTime, endTime: g.endTime }, { startTime: slot.startTime, endTime: slot.endTime })
               );
               if (targetAlloc && targetAlloc.id !== editingGroupId) {
                 conflictCellId = targetAlloc.id;
                 break;
               }
             }
           }

           if (conflictCellId) {
              dispatch(swapSubjectAssignments({
                 sourceCellId: editingGroupId,
                 targetCellId: conflictCellId
              }));
              toast.success("Assignments swapped successfully");
           } else {
              dispatch(updateTimeAllocation({
                id: editingGroupId,
                subjectId: targetSubjId,
                dayId: entry.dayId,
                startTime: finalStartTime,
                endTime: updatedTime.endTime
              }));
              if (targetSubjId !== entry.subjectId) {
                 dispatch(swapAssignmentSubject({ cellId: editingGroupId, newSubjectId: targetSubjId }));
              }
              toast.success("Time and subject updated");
           }
        } else {
           dispatch(swapAssignmentSubject({ cellId: editingGroupId, newSubjectId: targetSubjId }));
           toast.success("Subject updated");
        }
      }
    }
    setEditingGroup(null);
    toast.success("Assignment updated");
  }, [allocations, editingGroupId, timetableData, dispatch, setEditingGroup]);

  const onTimeChange = useCallback((cell: TimetableCell, newStart: string, newEnd: string) => {
    if (!cell.assignment?.subjectId) return;
    const dayId = cell.day;
    const targetSlots = timetableData.timeSlots.filter(t => {
      return isOverlap({ startTime: t.startTime, endTime: t.endTime }, { startTime: newStart, endTime: newEnd });
    });
    
    let conflictCellId = null;
    let conflictSubjectId = null;

    for (const slot of targetSlots) {
      const targetCell = timetableData.cells.find(c => c.day === dayId && c.startTime === slot.startTime);
      if (targetCell) {
        const targetAlloc = Object.values(allocations).find(g => 
          (g.dayId === dayId || g.dayId === targetCell.day) && 
          isOverlap({ startTime: g.startTime, endTime: g.endTime }, { startTime: slot.startTime, endTime: slot.endTime })
        );
        if (targetAlloc && targetAlloc.id !== cell.id) {
          conflictCellId = targetAlloc.id;
          conflictSubjectId = targetAlloc.subjectId;
          break;
        }
      }
    }

    if (conflictCellId && conflictSubjectId) {
      setPendingTimeChange({
        sourceCellId: cell.id,
        sourceSubjectId: cell.assignment.subjectId,
        dayId,
        newStart,
        newEnd,
        targetCellId: conflictCellId,
        targetSubjectId: conflictSubjectId,
        isConflict: true
      });
    } else {
      dispatch(updateTimeAllocation({
        id: cell.id,
        subjectId: cell.assignment.subjectId,
        dayId,
        startTime: newStart,
        endTime: newEnd
      }));
      toast.success("Time updated successfully");
    }
  }, [allocations, timetableData, dispatch, setPendingTimeChange]);

  return {
    handleUpdateSubject,
    handleRemoveSlot,
    handleAssignSlot,
    handleEditTime,
    onSaveEdit,
    onTimeChange,
    checkMergeEligibility
  };
}
