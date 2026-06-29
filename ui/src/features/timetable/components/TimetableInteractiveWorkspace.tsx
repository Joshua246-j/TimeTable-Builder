"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import TimetableDatePicker from "@/features/timetable/components/TimetableDatePicker";
import type { SubjectCardData, TimetableData, TimetableCell as TimetableCellType, ScheduleEntry } from "@/types/timetable";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { store, RootState, AppDispatch } from "@/store/store";
import { setSubjects, updateSubject } from "@/store/subjectSlice";
import { swapSubjectAssignments, assignSubject, updateTimeAllocation, removeSubjectAssignment, swapAssignmentSubject } from "@/store/syntheticActions";
import { setActiveDraftId } from "@/store/timetableDraftSlice";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { toast } from "sonner";
import { mergeEngine } from "@/lib/mergeEngine";
import { isOverlap, parseTime } from "@/lib/timeEngine";
import { merge, remove, setAllocations } from "@/store/timetableEngineSlice";
import { fetchDrafts, publishActiveDraft, saveActiveDraft } from "@/store/timetableDraftSlice";
import DraftManagerToolbar from "@/features/timetable/components/DraftManagerToolbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, LayoutGrid, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock } from "lucide-react";

const MobileFilters = dynamic(() => import("@/features/timetable/components/MobileFilters"), { ssr: false });
const MobileSubjectDrawer = dynamic(() => import("@/features/timetable/components/MobileSubjectDrawer"), { ssr: false });

interface TimetableInteractiveWorkspaceProps {
  initialData: TimetableData;
  isEditable?: boolean;
}

export default function TimetableInteractiveWorkspace({
  initialData,
  isEditable = true,
}: TimetableInteractiveWorkspaceProps) {
  const router = useRouter();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isConflictDrawerOpen, setIsConflictDrawerOpen] = useState(false);
  const [timetableData] = useState<TimetableData>(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCellId, setSelectedCellId] = useState<string | undefined>();
  const [editingGroupId, setEditingGroup] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const subjectsRedux = useSelector((state: RootState) => state.subject.subjects || {});
  const validationState = useSelector((state: RootState) => state.validation);
  const { allocations, isDirty } = useSelector((state: RootState) => state.timetableEngine);
  const { drafts, activeDraftId, publishedDraftId } = useSelector((state: RootState) => state.timetableDrafts);
  
  // Local state for calendar navigation (cosmetic in this new architecture)
  const [selectedDate, setSelectedDate] = useState("2026-06-29");
  const [selectedWeek, setSelectedWeek] = useState("2026-W27");
  
  const handleNavigateDate = useCallback((action: 'PREV_DAY' | 'NEXT_DAY' | 'PREV_WEEK' | 'NEXT_WEEK' | 'TODAY') => {
    // Basic stub for now to keep the UI working without errors
    console.log('Navigate', action);
  }, []);

  const handleSelectDate = useCallback((date: Date | undefined) => {
    if (date) {
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  }, []);
  const activeDraft = drafts.find(d => d.id === activeDraftId);
  const searchParams = useSearchParams();
  const isEditingPublished = searchParams.get('edit') === 'published';

  // Use the prop instead of internal state
  const isEditMode = isEditable;

  // Initial load
  useEffect(() => {
    dispatch(fetchDrafts()).then((res) => {
      const payload = res.payload as { publishedDraftId: string | null };
      if (isEditingPublished && payload.publishedDraftId) {
        dispatch(setActiveDraftId(payload.publishedDraftId));
        // Remove the query param to prevent re-triggering
        router.replace('/dashboard/timetable/builder');
      } else if (!activeDraftId && payload.publishedDraftId) {
        dispatch(setActiveDraftId(payload.publishedDraftId));
      }
    });
  }, [dispatch, isEditingPublished, router]);

  // Handle active draft changes
  useEffect(() => {
    if (activeDraft && activeDraft.id === activeDraftId) {
      dispatch(setAllocations(activeDraft.allocations));
    }
  }, [activeDraftId, activeDraft]); // Trigger when ID changes, or when draft is first loaded

  const activeVersionForWeek = null;
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

  const handleAddSubject = useCallback(() => {
    router.push('/dashboard/academic-modules/new?from=/dashboard/timetable/builder');
  }, [router]);

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
    
    // In ReadOnly mode, always show the currently published global timetable
    // If not loaded yet, we could use a selector, but since this runs on mount, 
    // we'll just check `drafts.find(d => d.id === publishedDraftId)`
    let sourceAllocations = allocations;
    
    if (!isEditable) {
      const liveTimetable = drafts.find(d => d.id === publishedDraftId);
      sourceAllocations = liveTimetable ? liveTimetable.allocations : {};
    }

    return baseCells.map(c => {
      const alloc = sourceAllocations[c.id];
      if (!isEditable && alloc && alloc.subjectId === "2" && (selectedDate.endsWith("Wednesday") || selectedDate.includes("03") || selectedDate.endsWith("-01"))) {
        return { ...c, isAssigned: true, assignment: { subjectId: "3" } };
      }
      if (alloc) {
        return { ...c, isAssigned: true, assignment: { subjectId: alloc.subjectId } };
      }
      return { ...c, isAssigned: false, assignment: undefined };
    });
  }, [timetableData.cells, allocations, drafts, publishedDraftId, isEditable, selectedDate]);

  const handlePublishClick = useCallback(async () => {
    if (Object.keys(allocations).length === 0) {
      toast.error("Allocate at least one timetable slot before publishing.");
      return;
    }
    if (!activeDraftId) return;

    try {
      // Auto-save the draft first, then publish it
      await dispatch(saveActiveDraft({ id: activeDraftId, allocations })).unwrap();
      await dispatch(publishActiveDraft(activeDraftId)).unwrap();
      toast.success("Timetable published successfully!");
      router.push('/dashboard/timetable/');
    } catch (e) {
      toast.error("Failed to publish timetable.");
    }
  }, [allocations, activeDraftId, dispatch, router]);

  const handleCancelEdit = useCallback(() => {
    router.push('/dashboard/timetable/');
  }, [router]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full flex-col bg-[#F8FAFC]">
        <div className="flex-1 flex overflow-hidden font-inter relative">
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="overflow-y-auto flex flex-col p-4 lg:p-6 lg:pl-8 h-full">
            <div className="flex-none">
              {!isEditMode ? (
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex w-full flex-wrap items-center justify-between gap-4">
                    {/* Left: Selected Unit & Version History */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm">
                          <LayoutGrid className="h-4 w-4" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400 tracking-wider">SELECTED UNIT</span>
                          <select className="bg-transparent text-[13px] font-bold text-slate-800 outline-none cursor-pointer border-none">
                            <option>Section CSE V A</option>
                            <option>Section CSE V B</option>
                          </select>
                        </div>
                      </div>

                    </div>

                    {/* Center: New Calendar Date Picker */}
                    <TimetableDatePicker 
                      selectedDate={selectedDate}
                      selectedWeek={selectedWeek}
                      onNavigate={handleNavigateDate}
                      onSelectDate={handleSelectDate}
                      publishedVersions={[]}
                    />

                    {/* Right: Legend */}
                    <div className="flex items-center gap-4 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Theory</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-400"></div>Lab</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Tutorial</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Elective</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Seminar</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <DraftManagerToolbar onPublishClick={handlePublishClick} />
                  <div className="mt-4 lg:hidden">
                    <MobileFilters />
                  </div>
                </>
              )}
            </div>

            <div className={`flex flex-col pb-6 ${!isEditMode ? 'bg-white rounded-[24px] border border-slate-100 shadow-sm p-6' : 'mt-4 lg:mt-6'}`}>
              
              {!isEditMode && (
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => router.push('/dashboard/timetable/builder/?edit=published')}
                    className="flex items-center gap-2 rounded-full bg-white border border-slate-200 text-[#5A67D8] px-5 py-2 text-[13px] font-bold transition-all hover:bg-slate-50 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    Edit Timetable
                  </button>
                </div>
              )}

              <div className="relative h-full min-h-[400px]">
                {(!isEditMode && !publishedDraftId) ? (
                  <div className="flex flex-col items-center justify-center h-full pt-16">
                    <p className="text-slate-500 font-semibold mb-4">No Timetable Published.</p>
                    <button 
                      onClick={() => router.push('/dashboard/timetable/builder/?edit=published')}
                      className="px-6 py-2 bg-[#5A67D8] text-white rounded-xl font-bold"
                    >
                      Go to Builder
                    </button>
                  </div>
                ) : (
                  <TimetableGrid
                    days={activeDays}
                    timeSlots={gridConfig.timeSlots || []}
                    cells={mappedCells}
                    subjects={subjectsRedux || {}}
                    selectedCellId={selectedCellId}
                    isGridEditMode={gridConfig.isGridEditMode}
                    isReadOnly={!isEditMode}
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
                )}
              </div>
            </div>
            
            {isEditMode && (
              <div className="flex-none pt-4 lg:pt-6 border-t border-slate-200 bg-white">
                <ValidationFooter onOpenConflicts={() => setIsConflictDrawerOpen(true)} />
              </div>
            )}
          </div> 
        </div>

        {isEditMode && (
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
        )}
        
        {isEditMode && <GridConfigPanel />}
      </div>

      {isEditMode && !sidebarOpen && (
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

      {isEditMode && (
        <FloatingActionButton
          onOpenSubjectAllocation={() => setIsMobileDrawerOpen(true)}
        />
      )}

      {isEditMode && (
        <MobileSubjectDrawer
          open={isMobileDrawerOpen}
          onOpenChange={setIsMobileDrawerOpen}
          subjects={timetableSubjectsArr}
          onUpdateSubject={handleUpdateSubject}
          onAddSubject={handleAddSubject}
        />
      )}

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
