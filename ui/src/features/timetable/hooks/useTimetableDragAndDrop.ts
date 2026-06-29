import { useState } from 'react';
import { DragStartEvent, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { swapSubjectAssignments, assignSubject, swapAssignmentSubject } from '@/store/syntheticActions';
import { TimetableCell } from '@/types/timetable';
import { toast } from 'sonner';

interface UseTimetableDragAndDropProps {
  checkMergeEligibility: (dayId: string, startTime: string, subjectId: string) => void;
}

export function useTimetableDragAndDrop({ checkMergeEligibility }: UseTimetableDragAndDropProps) {
  const [activeDragData, setActiveDragData] = useState<Record<string, unknown> | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const allocations = useSelector((state: RootState) => state.timetableEngine.allocations);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragData(event.active.data.current as Record<string, unknown>);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragData(null);
    if (!over) return;

    const sourceData = active.data.current as Record<string, unknown>;
    const targetData = over.data.current as Record<string, unknown>;

    if (sourceData?.type === "CELL_ITEM" && targetData?.type === "CELL") {
      const sourceCellId = sourceData.cellId as string;
      const targetCell = targetData.cell as TimetableCell;
      const targetCellId = targetCell.id;
      const sourceSubjectId = sourceData.subjectId as string;

      if (sourceCellId === targetCellId) return;

      if (allocations[sourceCellId]?.isLocked || allocations[targetCellId]?.isLocked) {
        toast.error("Cannot swap. One of the slots is locked.");
        return;
      }

      dispatch(swapSubjectAssignments({ 
        sourceCellId, 
        targetCellId,
        targetDayId: targetCell.day,
        targetStartTime: targetCell.startTime,
        targetEndTime: targetCell.endTime
      }));
      
      checkMergeEligibility(targetCell.day, targetCell.startTime, sourceSubjectId);
    }

    if (sourceData?.type === "SUBJECT" && targetData?.type === "CELL") {
      const subjectId = (sourceData.subject as Record<string, unknown>)?.id as string || sourceData.subjectId as string;
      const targetCell = targetData.cell as TimetableCell;
      const targetCellId = targetCell.id;

      if (targetCell.isAssigned) {
        // Instead of error, we can swap/replace the assignment
        dispatch(swapAssignmentSubject({ cellId: targetCellId, newSubjectId: subjectId, dayId: targetCell.day, startTime: targetCell.startTime, endTime: targetCell.endTime }));
        toast.success("Subject assignment replaced");
        checkMergeEligibility(targetCell.day, targetCell.startTime, subjectId);
        return;
      }

      dispatch(assignSubject({ cellId: targetCellId, subjectId, dayId: targetCell.day, startTime: targetCell.startTime, endTime: targetCell.endTime }));
      checkMergeEligibility(targetCell.day, targetCell.startTime, subjectId);
    }
  };

  return {
    sensors,
    activeDragData,
    handleDragStart,
    handleDragEnd,
  };
}
