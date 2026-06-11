"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import ActionToolbar from "@/features/timetable/components/ActionToolbar";
import TimetableGrid from "@/features/timetable/components/TimetableGrid";
import SubjectAllocationPanel from "@/features/timetable/components/SubjectAllocationPanel";
import ValidationFooter from "@/features/timetable/components/ValidationFooter";
import FloatingActionButton from "@/features/timetable/components/FloatingActionButton";
import SubjectClassCard from "@/features/timetable/components/SubjectClassCard";
import TimetableSlotCard from "@/features/timetable/components/TimetableSlotCard";
import MergedPeriodCard from "@/features/timetable/components/MergedPeriodCard";
import type { SubjectCardData, TimetableData, TimetableCell as TimetableCellType } from "@/types/timetable";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setSubjects } from "@/store/subjectSlice";
import { swapSubjectAssignments, assignSubject, updateTimeAllocation } from "@/store/syntheticActions";
import { removeAllocation } from "@/store/allocationSlice";
import { parseTime } from "@/lib/timeEngine";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { toast } from "sonner";
import { mergeEngine } from "@/lib/mergeEngine";

const MobileFilters = dynamic(() => import("@/features/timetable/components/MobileFilters"), { ssr: false });
const MobileSubjectDrawer = dynamic(() => import("@/features/timetable/components/MobileSubjectDrawer"), { ssr: false });

interface TimetableInteractiveWorkspaceProps {
  initialData: TimetableData;
}

export default function TimetableInteractiveWorkspace({
  initialData,
}: TimetableInteractiveWorkspaceProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [timetableData] = useState<TimetableData>(initialData);
  const [includeSaturday, setIncludeSaturday] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCellId, setSelectedCellId] = useState<string | undefined>();
  const [editingGroupId, setEditingGroup] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const mergedAllocations = useSelector((state: RootState) => state.merge.mergedAllocations || {});
  const subjectsRedux = useSelector((state: RootState) => state.subject.subjects || {});
  const allocations = useSelector((state: RootState) => state.allocation.allocations || {});
  const [activeDragData, setActiveDragData] = useState<Record<string, unknown> | null>(null);

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
    dispatch(removeAllocation(cellId));
  }, [dispatch]);

  const handleAssignSlot = useCallback((cell: TimetableCellType, subjectId: string) => {
    dispatch(assignSubject({ cellId: cell.id, subjectId }));
    setSelectedCellId(undefined);

    // After assigning, check for auto-merge
    setTimeout(() => {
      // Need to find the rowIndex and dayId of this cell
      const assignedCell = timetableData.cells.find(c => c.id === cell.id);
      if (assignedCell) {
        // We use state from Redux since local state is behind by one render, but we just dispatched it.
        // It's easier to simulate what it would be:
        const simulatedCells = timetableData.cells.map(c => {
          if (c.id === cell.id) return { ...c, assignment: { subjectId } };
          const existing = allocations[c.id];
          if (existing) return { ...c, assignment: { subjectId: existing.subjectId } };
          return c;
        });

        // Find rowIndex
        const timeSlotIndex = timetableData.timeSlots.findIndex(t => t.startTime === assignedCell.startTime);
        
        const suggestions = mergeEngine.suggestAutoMerge(timeSlotIndex, assignedCell.day, subjectId, simulatedCells.map(c => ({
          id: c.id,
          rowIndex: timetableData.timeSlots.findIndex(t => t.startTime === c.startTime),
          day: c.day,
          assignment: c.assignment,
        })));

        if (suggestions.length > 1) {
          toast("Adjacent periods detected", {
            description: "Do you want to merge these periods together?",
            action: {
              label: "Merge",
              onClick: () => {
                // Create the merge entry
                const cellsToMerge = simulatedCells.filter(c => suggestions.includes(c.id)).map(c => ({
                  id: c.id,
                  rowIndex: timetableData.timeSlots.findIndex(t => t.startTime === c.startTime),
                  dayId: c.day,
                  startTime: c.startTime,
                  endTime: c.endTime,
                  subjectId
                }));
                const sorted = cellsToMerge.sort((a, b) => a.rowIndex - b.rowIndex);
                if (sorted.length > 0) {
                  const startCell = sorted[0];
                  const endCell = sorted[sorted.length - 1];
                  const mergeEntry = {
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
                  dispatch({ type: 'merge/createMergedAllocation', payload: mergeEntry });
                  toast.success("Merged successfully");
                }
              }
            }
          });
        }
      }
    }, 100);
  }, [dispatch, timetableData.cells, timetableData.timeSlots, allocations]);

  const handleEditTime = useCallback((cell: TimetableCellType) => {
    if (!cell.isAssigned || !cell.assignment) return;
    const timeSlotIndex = timetableData.timeSlots.findIndex(t => t.startTime === cell.startTime);
    const activeGroup = Object.values(mergedAllocations).find(g => (g.dayId === cell.day || g.dayId === cell.dayId) && timeSlotIndex >= g.rowStart && timeSlotIndex < g.rowStart + g.rowSpan);
    
    if (activeGroup) {
      setEditingGroup(activeGroup.id);
    } else {
      const fakeEntry = {
        id: cell.id,
        subjectId: cell.assignment.subjectId,
        dayId: cell.day,
        startTime: cell.startTime,
        endTime: cell.endTime,
        rowSpan: 1,
        rowStart: timeSlotIndex,
        isEditable: true,
        isLocked: !!allocations[cell.id]?.isLocked,
      };
      setEditingGroup(fakeEntry.id);
      // Wait, setEditingGroup expects string | null. The code previously did `setEditingGroup(fakeEntry)` which was assigning an object to a string id! 
    }
  }, [mergedAllocations, allocations, timetableData.timeSlots]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragData(event.active.data.current as Record<string, unknown>);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragData(null);
    if (!over) return;

    const sourceData = active.data.current as Record<string, unknown>;
    const targetData = over.data.current as Record<string, unknown>;

    // Moving an assignment from one cell to another
    if (sourceData?.type === "CELL_ITEM" && targetData?.type === "CELL") {
      const sourceCellId = sourceData.cellId as string;
      const targetCell = targetData.cell as TimetableCellType;
      const targetCellId = targetCell.id;

      if (sourceCellId === targetCellId) return; // Same cell

      if (lockedSlots[sourceCellId] || lockedSlots[targetCellId] || mergedAllocations[sourceCellId]?.isLocked || mergedAllocations[targetCellId]?.isLocked) {
        toast.error("Cannot swap. One of the slots is locked.");
        return;
      }

      // We don't actually need startMins or endMins right here because swapSubjectAssignments takes source/target cell ids directly
      // However, calculating for the side-effect check. 

      // We will now handle swap logic inside syntheticActions
      // It will validate contiguous slots and locks before completing the swap
      dispatch(swapSubjectAssignments({ sourceCellId, targetCellId }));
    }

    // Assigning from sidebar
    if (sourceData?.type === "SUBJECT" && targetData?.type === "CELL") {
      const subjectId = (sourceData.subject as Record<string, unknown>)?.id as string || sourceData.subjectId as string;
      const targetCellId = targetData.cell.id;

      // Check if target is already occupied
      if (targetData.cell.isAssigned) {
        toast.error("Cannot assign to an already occupied slot. Remove the existing subject first.");
        return;
      }

      dispatch(assignSubject({ cellId: targetCellId, subjectId }));
    }
  };

  const timetableSubjectsArr = useMemo(() => {
    return Object.values(subjectsRedux || {});
  }, [subjectsRedux]);

  const activeDays = useMemo(() => {
    const days = timetableData?.days || [];
    if (includeSaturday) {
      if (!days.find(d => d.name.toLowerCase() === "saturday")) {
        return [...days, { id: "6", name: "Saturday", shortName: "Sat" }];
      }
    } else {
      return days.filter(d => d.name.toLowerCase() !== "saturday");
    }
    return days;
  }, [timetableData.days, includeSaturday]);

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
        <div className="flex-1 flex overflow-hidden font-inter">
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="flex-1 overflow-y-auto flex flex-col p-4 lg:p-6 lg:pl-8">
            {/* Toolbar & Filters */}
            <div className="flex-none">
              <ActionToolbar 
                includeSaturday={includeSaturday}
                onToggleSaturday={setIncludeSaturday}
              />
              <div className="mt-4 lg:hidden">
                <MobileFilters />
              </div>
            </div>

            {/* Workspace / Grid */}
            <div className="flex-1 mt-4 lg:mt-6 min-h-0 flex flex-col pb-6">
              <div
                className="
                  flex-1
                  overflow-auto
                  bg-transparent lg:bg-white
                "
              >
                <TimetableGrid
                  days={activeDays}
                  timeSlots={timetableData?.timeSlots || []}
                  cells={mappedCells}
                  subjects={subjectsRedux || {}}
                  selectedCellId={selectedCellId}
                  lunchBreakIndex={3}
                  lunchBreakLabel="LUNCH BREAK"
                  editingGroupId={editingGroupId}
                  onCancelEdit={() => setEditingGroup(null)}
                  onSaveEdit={(subj, updatedTime, swappedSubjId) => {
                    const targetSubjId = swappedSubjId || subj.id;
                    if (!targetSubjId || targetSubjId.startsWith('assign-')) {
                      toast.error("Please select a valid subject to assign.");
                      return;
                    }
                    
                    if (editingGroupId) {
                      const entry = Object.values(mergedAllocations).find(g => g.id === editingGroupId) || timetableData.cells.find((c: TimetableCellType) => c.id === editingGroupId);
                      if (entry) {
                        const originalStartTime = 'startTime' in entry ? entry.startTime : '';
                        const originalEndTime = 'endTime' in entry ? entry.endTime : '';
                        
                        if (updatedTime && (updatedTime.startTime !== originalStartTime || updatedTime.endTime !== originalEndTime)) {
                           dispatch(updateTimeAllocation({
                              id: editingGroupId,
                              subjectId: targetSubjId,
                              dayId: 'day' in entry ? entry.day : ('dayId' in entry ? entry.dayId : ''),
                              startTime: updatedTime.startTime,
                              endTime: updatedTime.endTime
                           }));
                        } else {
                           dispatch(assignSubject({ cellId: editingGroupId, subjectId: targetSubjId }));
                        }
                      }
                    }
                    setEditingGroup(null);
                    toast.success("Assignment updated");
                  }}
                  onCellClick={(cell) => setSelectedCellId(cell.id)}
                  onSubjectClick={(cell) => {
                    if (confirm("Remove this subject from the timetable?")) {
                      handleRemoveSlot(cell.id);
                    }
                  }}
                  onEditTime={handleEditTime}
                  onAssignSlot={handleAssignSlot}
                />
              </div>
            </div>
          </div>
          
          {/* Validation Footer Fixed at Bottom */}
          <div className="flex-none p-4 lg:p-6 lg:pl-8 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-20">
            <ValidationFooter />
          </div>
        </div>

        {/* Right Sidebar (Subject Allocation) */}
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
          <div className="w-[320px] h-full">
            <SubjectAllocationPanel
              subjects={timetableSubjectsArr}
              onUpdateSubject={handleUpdateSubject}
              onAddSubject={handleAddSubject}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Floating Toggle Button for Desktop Sidebar */}
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

      {/* Mobile Elements */}
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


      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragData?.type === "CELL_ITEM" && activeDragData.subjectId && subjectsRedux[activeDragData.subjectId] ? (
          <div className="opacity-95 shadow-2xl scale-[1.03] rotate-2 cursor-grabbing w-[280px] transition-transform">
            <TimetableSlotCard
              startTime={activeDragData.startTime || timetableData.timeSlots[0].startTime}
              endTime={activeDragData.endTime || timetableData.timeSlots[0].endTime}
              rowSpan={activeDragData.rowSpan || 1}
              isSelected={true}
              isLocked={false}
              isSelectionMode={false}
            >
              {(activeDragData.rowSpan || 1) > 1 ? (
                <MergedPeriodCard 
                  group={{ 
                    id: activeDragData.cellId, 
                    subjectId: activeDragData.subjectId,
                    dayId: "Monday", 
                    startTime: activeDragData.startTime || timetableData.timeSlots[0].startTime, 
                    endTime: activeDragData.endTime || timetableData.timeSlots[0].endTime, 
                    rowSpan: activeDragData.rowSpan 
                  } as ScheduleEntry} 
                  subject={subjectsRedux[activeDragData.subjectId]} 
                />
              ) : (
                <SubjectClassCard data={subjectsRedux[activeDragData.subjectId]} />
              )}
            </TimetableSlotCard>
          </div>
        ) : activeDragData?.type === "SUBJECT" && (activeDragData.subject?.id || activeDragData.subjectId) && subjectsRedux[(activeDragData.subject?.id || activeDragData.subjectId)] ? (
          <div className="opacity-95 shadow-2xl scale-[1.03] rotate-2 cursor-grabbing w-[280px] transition-transform">
            <TimetableSlotCard
              startTime={timetableData.timeSlots[0].startTime}
              endTime={timetableData.timeSlots[0].endTime}
              rowSpan={1}
              isSelected={true}
              isLocked={false}
              isSelectionMode={false}
            >
              <SubjectClassCard data={subjectsRedux[(activeDragData.subject?.id || activeDragData.subjectId)]} />
            </TimetableSlotCard>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
