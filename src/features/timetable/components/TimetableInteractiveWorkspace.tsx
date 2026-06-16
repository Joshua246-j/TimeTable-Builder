"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import ActionToolbar from "@/features/timetable/components/ActionToolbar";
import TimetableGrid from "@/features/timetable/components/TimetableGrid";
import SubjectAllocationPanel from "@/features/timetable/components/SubjectAllocationPanel";
import ValidationFooter from "@/features/timetable/components/ValidationFooter";
import FloatingActionButton from "@/features/timetable/components/FloatingActionButton";
import SubjectClassCard from "@/features/timetable/components/SubjectClassCard";
import TimetableSlotCard from "@/features/timetable/components/TimetableSlotCard";
import ConflictDrawer from "@/features/timetable/components/ConflictDrawer";
import GridConfigPanel from "@/features/timetable/components/GridConfigPanel";
import type { SubjectCardData, TimetableData, TimetableCell as TimetableCellType, ScheduleEntry } from "@/types/timetable";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { store, RootState, AppDispatch } from "@/store/store";
import { setSubjects, updateSubject, addSubject } from "@/store/subjectSlice";
import { swapSubjectAssignments, assignSubject, updateTimeAllocation, removeSubjectAssignment, swapAssignmentSubject } from "@/store/syntheticActions";

import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { toast } from "sonner";
import { mergeEngine } from "@/lib/mergeEngine";
import { isOverlap } from "@/lib/timeEngine";
import { merge } from "@/store/timetableEngineSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const MobileFilters = dynamic(() => import("@/features/timetable/components/MobileFilters"), { ssr: false });
const MobileSubjectDrawer = dynamic(() => import("@/features/timetable/components/MobileSubjectDrawer"), { ssr: false });

interface TimetableInteractiveWorkspaceProps {
  initialData: TimetableData;
}

export default function TimetableInteractiveWorkspace({
  initialData,
}: TimetableInteractiveWorkspaceProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isConflictDrawerOpen, setIsConflictDrawerOpen] = useState(false);
  const [timetableData] = useState<TimetableData>(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCellId, setSelectedCellId] = useState<string | undefined>();
  const [editingGroupId, setEditingGroup] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const subjectsRedux = useSelector((state: RootState) => state.subject.subjects || {});
  const { allocations } = useSelector((state: RootState) => state.timetableEngine);
  const validationState = useSelector((state: RootState) => state.validation);
  const gridConfig = useSelector((state: RootState) => state.gridConfig);
  const [activeDragData, setActiveDragData] = useState<Record<string, unknown> | null>(null);

  const [pendingTimeChange, setPendingTimeChange] = useState<{
    sourceCellId: string;
    sourceSubjectId: string;
    dayId: string;
    newStart: string;
    newEnd: string;
    targetCellId?: string;
    targetSubjectId?: string;
    isConflict: boolean;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if (initialData.subjects) {
      dispatch(setSubjects(initialData.subjects));
    }
  }, [initialData.subjects, dispatch]);

  const handleUpdateSubject = useCallback((updatedSubject: SubjectCardData) => {
    dispatch(updateSubject(updatedSubject));
  }, [dispatch]);

  const handleAddSubject = useCallback((newSubject: SubjectCardData) => {
    dispatch(addSubject({ ...newSubject, isEditable: true }));
  }, [dispatch]);

  const handleRemoveSlot = useCallback((cellId: string) => {
    dispatch(removeSubjectAssignment({ cellId }));
  }, [dispatch]);

  const handleAssignSlot = useCallback((cell: TimetableCellType, subjectId: string) => {
    dispatch(assignSubject({ cellId: cell.id, subjectId, dayId: cell.day, startTime: cell.startTime, endTime: cell.endTime }));
    setSelectedCellId(undefined);

    setTimeout(() => {
      // Small delay to let Redux update
      const latestState = store.getState();
      const latestAllocations = Object.values(latestState.timetableEngine.allocations);
      
      const newAlloc = latestAllocations.find(a => 
        (a.dayId === cell.day || a.dayId === cell.id.split('-')[0]) && 
        a.startTime === cell.startTime
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
          toast("Adjacent periods detected", {
            description: "Do you want to merge these periods together?",
            action: {
              label: "Merge",
              onClick: () => {
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
                const sorted = cellsToMerge.sort((a, b) => a.rowIndex - b.rowIndex);
                if (sorted.length > 0) {
                  const startCell = sorted[0];
                  const endCell = sorted[sorted.length - 1];
                  const mergeEntry: ScheduleEntry = {
                    id: `merge-${startCell.id}-${Date.now()}`,
                    subjectId,
                    dayId: startCell.dayId,
                    startTime: startCell.startTime,
                    endTime: endCell.endTime,
                    rowStart: startCell.rowIndex,
                    rowSpan: endCell.rowIndex - startCell.rowIndex + 1,
                    isEditable: true,
                    isLocked: false,
                  };
                  dispatch(merge(mergeEntry));
                  toast.success("Merged successfully");
                }
              }
            }
          });
        }
      }
    }, 100);
  }, [dispatch, timetableData.timeSlots]);

  const handleEditTime = useCallback((cell: TimetableCellType) => {
    if (!cell.isAssigned || !cell.assignment) return;
    const activeGroup = Object.values(allocations).find(a => 
      (a.dayId === cell.day || a.dayId === cell.dayId) && 
      isOverlap({ startTime: a.startTime, endTime: a.endTime }, { startTime: cell.startTime, endTime: cell.endTime })
    );
    
    if (activeGroup) {
      setEditingGroup(activeGroup.id);
    }
  }, [allocations]);

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
      const targetCell = targetData.cell as TimetableCellType;
      const targetCellId = targetCell.id;

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
    }

    if (sourceData?.type === "SUBJECT" && targetData?.type === "CELL") {
      const subjectId = (sourceData.subject as Record<string, unknown>)?.id as string || sourceData.subjectId as string;
      const targetCell = targetData.cell as TimetableCellType;
      const targetCellId = targetCell.id;

      if (targetCell.isAssigned) {
        // Instead of error, we can swap/replace the assignment
        dispatch(swapAssignmentSubject({ cellId: targetCellId, newSubjectId: subjectId, dayId: targetCell.day, startTime: targetCell.startTime, endTime: targetCell.endTime }));
        toast.success("Subject assignment replaced");
        return;
      }

      dispatch(assignSubject({ cellId: targetCellId, subjectId, dayId: targetCell.day, startTime: targetCell.startTime, endTime: targetCell.endTime }));
    }
  };

  const timetableSubjectsArr = useMemo(() => {
    return Object.values(subjectsRedux || {});
  }, [subjectsRedux]);

  const activeDays = useMemo(() => {
    return gridConfig.days.filter(d => d.enabled);
  }, [gridConfig.days]);

  const mappedCells = useMemo(() => {
    const baseCells = timetableData?.cells || [];
    return baseCells.map(c => {
      const alloc = allocations[c.id];
      if (alloc) {
        return { ...c, isAssigned: true, assignment: { subjectId: alloc.subjectId } };
      }
      return { ...c, isAssigned: false, assignment: undefined };
    });
  }, [timetableData.cells, allocations]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full flex-col bg-[#F8FAFC]">
        <div className="flex-1 flex overflow-hidden font-inter relative">
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="overflow-y-auto flex flex-col p-4 lg:p-6 lg:pl-8 h-full">
            <div className="flex-none">
              <ActionToolbar 
                onOpenConflicts={() => setIsConflictDrawerOpen(true)}
              />
              <div className="mt-4 lg:hidden">
                <MobileFilters />
              </div>
            </div>

            <div className="mt-4 lg:mt-6 flex flex-col pb-6">
              <div
                className="
                
                  bg-transparent lg:bg-white
                  relative
                "
              >
                <TimetableGrid
                  days={activeDays}
                  timeSlots={gridConfig.timeSlots || []}
                  cells={mappedCells}
                  subjects={subjectsRedux || {}}
                  selectedCellId={selectedCellId}
                  isGridEditMode={gridConfig.isGridEditMode}
                  breaks={gridConfig.breaks}
                  editingGroupId={editingGroupId}
                  onCancelEdit={() => setEditingGroup(null)}
                  onSaveEdit={(subj, updatedTime, swappedSubjId) => {
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
                           dispatch(updateTimeAllocation({
                              id: editingGroupId,
                              subjectId: targetSubjId,
                              dayId: entry.dayId,
                              startTime: updatedTime.startTime,
                              endTime: updatedTime.endTime
                           }));
                        } else {
                           dispatch(assignSubject({ cellId: editingGroupId, subjectId: targetSubjId, dayId: entry.dayId, startTime: originalStartTime, endTime: originalEndTime }));
                        }
                      }
                    }
                    setEditingGroup(null);
                    toast.success("Assignment updated");
                  }}
                  onCellClick={(cell) => setSelectedCellId(cell.id)}
                  onSubjectClick={(cell) => {
                    handleRemoveSlot(cell.id);
                  }}
                  onEditTime={handleEditTime}
                  onTimeChange={(cell, newStart, newEnd) => {
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
                          (g.dayId === dayId || g.dayId === targetCell.dayId) && 
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
                  }}
                  onAssignSlot={handleAssignSlot}
                />
              </div>
            </div>
            
            <div className="flex-none pt-4 lg:pt-6 border-t border-slate-200 bg-white">
            <ValidationFooter onOpenConflicts={() => setIsConflictDrawerOpen(true)} />
            </div>
          </div> 
        </div>

        <div
          className={`
            hidden
            lg:block
            shrink-0
            h-full
            overflow-y-auto
            border-l
            border-[#E5E7EB]
            bg-white
            transition-all duration-300
            ${sidebarOpen ? "w-[320px]" : "w-[0px] border-none"}
          `}
        >
          <div className="w-[320px] h-[80px] ">
            <SubjectAllocationPanel
              subjects={timetableSubjectsArr}
              onUpdateSubject={handleUpdateSubject}
              onAddSubject={handleAddSubject}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
        
        <GridConfigPanel />
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 items-start gap-1 rounded-l-xl bg-white border border-r-0 border-slate-200 p-4 shadow-lg hover:bg-slate-50 transition-all z-40 flex-col"
        >
          <span className="text-sm font-bold text-slate-700">Subject</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-slate-700">Allocation</span>
            <span className="text-[10px] text-slate-400">▶</span>
          </div>
        </button>
      )}

      <FloatingActionButton
        onOpenSubjectAllocation={() => setIsMobileDrawerOpen(true)}
      />

      <MobileSubjectDrawer
        open={isMobileDrawerOpen}
        onOpenChange={setIsMobileDrawerOpen}
        subjects={timetableSubjectsArr}
        onUpdateSubject={handleUpdateSubject}
        onAddSubject={handleAddSubject}
      />

      <ConflictDrawer 
        isOpen={isConflictDrawerOpen}
        onClose={() => setIsConflictDrawerOpen(false)}
        conflicts={validationState?.conflicts || []}
      />

      <Dialog open={!!pendingTimeChange} onOpenChange={(open) => !open && setPendingTimeChange(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-orange-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Time Conflict Detected
            </DialogTitle>
            <DialogDescription>
              The selected time slot already contains another subject ({pendingTimeChange?.targetSubjectId ? subjectsRedux[pendingTimeChange.targetSubjectId]?.subjectName : 'Unknown'}). What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setPendingTimeChange(null)}>Cancel</Button>
            <Button variant="secondary" onClick={() => {
              if (pendingTimeChange) {
                dispatch(removeSubjectAssignment({ cellId: pendingTimeChange.targetCellId! }));
                dispatch(updateTimeAllocation({
                  id: pendingTimeChange.sourceCellId,
                  subjectId: pendingTimeChange.sourceSubjectId,
                  dayId: pendingTimeChange.dayId,
                  startTime: pendingTimeChange.newStart,
                  endTime: pendingTimeChange.newEnd
                }));
                setPendingTimeChange(null);
                toast.success("Assignment moved successfully");
              }
            }}>
              Move Existing Subject
            </Button>
            <Button variant="default" onClick={() => {
              if (pendingTimeChange) {
                dispatch(swapSubjectAssignments({
                   sourceCellId: pendingTimeChange.sourceCellId,
                   targetCellId: pendingTimeChange.targetCellId!
                }));
                setPendingTimeChange(null);
                toast.success("Subjects swapped successfully");
              }
            }}>
              Swap Subjects
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragData?.type === "CELL_ITEM" && activeDragData.subjectId && subjectsRedux[activeDragData.subjectId as string] ? (
          <div className="opacity-95 shadow-2xl scale-[1.03] rotate-2 cursor-grabbing w-[280px] transition-transform">
            <TimetableSlotCard
              startTime={(activeDragData.startTime as string) || timetableData.timeSlots[0].startTime}
              endTime={(activeDragData.endTime as string) || timetableData.timeSlots[0].endTime}
              rowSpan={(activeDragData.rowSpan as number) || 1}
              isSelected={true}
              isLocked={false}
              isSelectionMode={false}
            >
                <SubjectClassCard 
                  data={subjectsRedux[activeDragData.subjectId as string]}
                  scheduleEntry={((activeDragData.rowSpan as number) || 1) > 1 ? { 
                    id: activeDragData.cellId as string, 
                    subjectId: activeDragData.subjectId as string,
                    dayId: "Monday", 
                    startTime: (activeDragData.startTime as string) || timetableData.timeSlots[0].startTime, 
                    endTime: (activeDragData.endTime as string) || timetableData.timeSlots[0].endTime, 
                    rowSpan: activeDragData.rowSpan as number,
                    rowStart: 0,
                    isEditable: true,
                    isLocked: false
                  } as ScheduleEntry : undefined} 
                />
            </TimetableSlotCard>
          </div>
        ) : activeDragData?.type === "SUBJECT" && ((activeDragData.subject as Record<string, unknown>)?.id || activeDragData.subjectId) && subjectsRedux[((activeDragData.subject as Record<string, unknown>)?.id as string || activeDragData.subjectId as string)] ? (
          <div className="opacity-95 shadow-2xl scale-[1.03] rotate-2 cursor-grabbing w-[280px] transition-transform">
            <TimetableSlotCard
              startTime={timetableData.timeSlots[0].startTime}
              endTime={timetableData.timeSlots[0].endTime}
              rowSpan={1}
              isSelected={true}
              isLocked={false}
              isSelectionMode={false}
            >
              <SubjectClassCard data={subjectsRedux[((activeDragData.subject as Record<string, unknown>)?.id as string || activeDragData.subjectId as string)]} />
            </TimetableSlotCard>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
