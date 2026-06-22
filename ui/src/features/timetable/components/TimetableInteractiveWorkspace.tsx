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
import { isOverlap, parseTime } from "@/lib/timeEngine";
import { merge, remove } from "@/store/timetableEngineSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [pendingMergeSuggestion, setPendingMergeSuggestion] = useState<{
    subjectId: string;
    cellsToMerge: { id: string; rowIndex: number; dayId: string; startTime: string; endTime: string; subjectId: string }[];
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
  }, [timetableData.timeSlots]);

  const handleAssignSlot = useCallback((cell: TimetableCellType, subjectId: string) => {
    dispatch(assignSubject({ cellId: cell.id, subjectId, dayId: cell.day, startTime: cell.startTime, endTime: cell.endTime }));
    setSelectedCellId(undefined);
    checkMergeEligibility(cell.day, cell.startTime, subjectId);
  }, [dispatch, checkMergeEligibility]);

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
      const targetCell = targetData.cell as TimetableCellType;
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

  const handlePublish = useCallback(() => {
    // Generate clean JSON payload
    const publishedData = {
      timestamp: new Date().toISOString(),
      gridConfig: gridConfig,
      allocations: Object.values(allocations).map(alloc => ({
        id: alloc.id,
        subjectId: alloc.subjectId,
        dayId: alloc.dayId,
        startTime: alloc.startTime,
        endTime: alloc.endTime,
        rowSpan: alloc.rowSpan,
        isLocked: alloc.isLocked || false
      }))
    };
    
    // Simulate API call
    console.log("PUBLISHED TIMETABLE DATA (Backend Ready Payload):");
    console.log(JSON.stringify(publishedData, null, 2));
    
    toast.success("Timetable published successfully! (Check console for payload)");
  }, [allocations, gridConfig]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full flex-col bg-[#F8FAFC]">
        <div className="flex-1 flex overflow-hidden font-inter relative">
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="overflow-y-auto flex flex-col p-4 lg:p-6 lg:pl-8 h-full">
            <div className="flex-none">
              <ActionToolbar 
                onOpenConflicts={() => setIsConflictDrawerOpen(true)}
                onPublish={handlePublish}
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
                                 (g.dayId === entry.dayId || g.dayId === targetCell.dayId) && 
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
        <DialogContent className="font-inter sm:max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="p-6 pb-4">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <DialogTitle className="text-[18px] font-bold text-slate-900 leading-tight">
                    Time Conflict Detected
                  </DialogTitle>
                  <DialogDescription className="text-[14px] text-slate-500 mt-1.5 leading-relaxed">
                    The selected time slot already contains another subject (<span className="font-semibold text-slate-700">{pendingTimeChange?.targetSubjectId ? subjectsRedux[pendingTimeChange.targetSubjectId]?.subjectName : 'Unknown'}</span>). How would you like to resolve this?
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          <div className="p-6 pt-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button 
              className="w-full sm:w-auto px-4 py-2.5 text-[14px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setPendingTimeChange(null)}
            >
              Cancel
            </button>
            <button 
              className="w-full sm:w-auto px-4 py-2.5 text-[14px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
              onClick={() => {
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
              Overwrite Slot
            </button>
            <button 
              className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-bold text-white bg-[#4F6BFF] hover:bg-[#4338CA] rounded-xl shadow-md shadow-[#4F6BFF]/20 transition-all"
              onClick={() => {
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
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingMergeSuggestion} onOpenChange={(open) => !open && setPendingMergeSuggestion(null)}>
        <DialogContent className="font-inter sm:max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="p-6 pb-4">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E0E7FF] flex items-center justify-center shrink-0">
                  <div className="w-6 h-6 text-[#4F6BFF] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 6 4-4 4 4"/><path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22"/><path d="m20 22-5-5"/></svg>
                  </div>
                </div>
                <div>
                  <DialogTitle className="text-[18px] font-bold text-slate-900 leading-tight">
                    Merge Adjacent Sessions?
                  </DialogTitle>
                  <DialogDescription className="text-[14px] text-slate-500 mt-1.5 leading-relaxed">
                    These adjacent sessions can be merged into a single timetable block. Do you want to merge them?
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          <div className="p-6 pt-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button 
              className="w-full sm:w-auto px-4 py-2.5 text-[14px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setPendingMergeSuggestion(null)}
            >
              Cancel
            </button>
            <button 
              className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-bold text-white bg-[#4F6BFF] hover:bg-[#4338CA] rounded-xl shadow-md shadow-[#4F6BFF]/20 transition-all"
              onClick={() => {
                if (pendingMergeSuggestion) {
                  const sorted = [...pendingMergeSuggestion.cellsToMerge].sort((a, b) => a.rowIndex - b.rowIndex);
                  const startCell = sorted[0];
                  const endCell = sorted[sorted.length - 1];
                  const mergeEntry: ScheduleEntry = {
                    id: `merge-${startCell.id}-${Date.now()}`,
                    subjectId: pendingMergeSuggestion.subjectId,
                    dayId: startCell.dayId,
                    startTime: startCell.startTime,
                    endTime: endCell.endTime,
                    rowStart: startCell.rowIndex,
                    rowSpan: endCell.rowIndex - startCell.rowIndex + 1,
                    isEditable: true,
                    isLocked: false,
                  };
                  
                  // Remove old allocations
                  pendingMergeSuggestion.cellsToMerge.forEach(cell => {
                    dispatch(remove(cell.id));
                  });
                  
                  dispatch(merge(mergeEntry));
                  toast.success("Merged successfully");
                  setPendingMergeSuggestion(null);
                }
              }}
            >
              Merge
            </button>
          </div>
        </DialogContent>
      </Dialog>

      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragData?.type === "CELL_ITEM" && activeDragData.subjectId && subjectsRedux[activeDragData.subjectId as string] ? (
          <div className="opacity-95 shadow-2xl scale-[1.03] rotate-2 cursor-grabbing w-[280px] transition-transform">
            <TimetableSlotCard
              startTime={(activeDragData.startTime as string) || timetableData.timeSlots[0].startTime}
              endTime={(activeDragData.endTime as string) || timetableData.timeSlots[0].endTime}
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
                  isSelected
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
