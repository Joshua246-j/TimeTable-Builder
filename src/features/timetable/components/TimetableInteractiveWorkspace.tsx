"use client";

import { useState, useCallback, useMemo } from "react";
import ActionToolbar from "@/features/timetable/components/ActionToolbar";
import TimetableGrid from "@/features/timetable/components/TimetableGrid";
import SubjectAllocationPanel from "@/features/timetable/components/SubjectAllocationPanel";
import ValidationFooter from "@/features/timetable/components/ValidationFooter";
import FloatingActionButton from "@/features/timetable/components/FloatingActionButton";
import type { SubjectCardData, TimetableData, TimetableCell } from "@/types/timetable";
import dynamic from "next/dynamic";

const MobileFilters = dynamic(() => import("@/features/timetable/components/MobileFilters"), { ssr: false });
const MobileSubjectDrawer = dynamic(() => import("@/features/timetable/components/MobileSubjectDrawer"), { ssr: false });

interface TimetableInteractiveWorkspaceProps {
  initialData: TimetableData;
}

export default function TimetableInteractiveWorkspace({
  initialData,
}: TimetableInteractiveWorkspaceProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [timetableData, setTimetableData] = useState<TimetableData>(initialData);
  const [selectedCellId, setSelectedCellId] = useState<string | undefined>();

  const handleUpdateSubject = useCallback((updatedSubject: SubjectCardData) => {
    setTimetableData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subjects: {
          ...prev.subjects,
          [updatedSubject.id]: updatedSubject,
        },
      };
    });
  }, []);

  const handleAddSubject = useCallback((newSubject: SubjectCardData) => {
    setTimetableData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subjects: {
          ...prev.subjects,
          [newSubject.id]: newSubject,
        },
      };
    });
  }, []);

  const handleRemoveSlot = useCallback((cellId: string) => {
    setTimetableData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cells: prev.cells.map((c: TimetableCell) =>
          c.id === cellId
            ? { ...c, isAssigned: false, assignment: undefined }
            : c
        ),
      };
    });
  }, []);

  const handleAssignSlot = useCallback((cell: TimetableCell, subjectId: string) => {
    setTimetableData((prev) => {
      if (!prev) return prev;
      
      const cellExists = prev.cells.some((c: TimetableCell) => c.id === cell.id);
      
      let newCells = [...prev.cells];
      if (cellExists) {
        newCells = newCells.map((c: TimetableCell) =>
          c.id === cell.id
            ? { ...c, isAssigned: true, assignment: { subjectId } }
            : c
        );
      } else {
        newCells.push({ ...cell, isAssigned: true, assignment: { subjectId } });
      }

      return {
        ...prev,
        cells: newCells,
      };
    });
    setSelectedCellId(undefined);
  }, []);

  const timetableSubjectsArr = useMemo(() => {
    return Object.values(timetableData?.subjects || {});
  }, [timetableData?.subjects]);

  return (
    <>
      <div className="flex-1 flex overflow-hidden">
        {/* Left Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col p-4 lg:p-6">
          {/* Toolbar & Filters */}
          <div className="flex-none">
            <ActionToolbar />
            <div className="mt-4 lg:hidden">
              <MobileFilters />
            </div>
          </div>

          {/* Workspace / Grid */}
          <div className="flex-1 mt-4 lg:mt-6 min-h-0 flex flex-col">
            <div
              className="
                flex-1
                overflow-auto
                lg:rounded-xl
                lg:border
                lg:border-[#E5E7EB]
                bg-transparent lg:bg-white
              "
            >
              <TimetableGrid
                days={timetableData?.days || []}
                timeSlots={timetableData?.timeSlots || []}
                cells={timetableData?.cells || []}
                subjects={timetableData?.subjects || {}}
                selectedCellId={selectedCellId}
                lunchBreakIndex={3}
                lunchBreakLabel="LUNCH BREAK"
                onCellClick={(cell) => setSelectedCellId(cell.id)}
                onSubjectClick={(cell) => {
                  if (confirm("Remove this subject from the timetable?")) {
                    handleRemoveSlot(cell.id);
                  }
                }}
                onAssignSlot={handleAssignSlot}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex-none mt-4 lg:mt-6 pb-24 lg:pb-0">
            <ValidationFooter conflictCount={5} />
          </div>
        </div>

        {/* Right Sidebar (Subject Allocation) */}
        <div
          className="
            hidden
            lg:block
            w-[260px]
            shrink-0
            h-full
            overflow-y-auto
            border-l
            border-[#E5E7EB]
            bg-white
            shadow-[-4px_0_24px_-8px_rgba(0,0,0,0.05)]
          "
        >
          <SubjectAllocationPanel
            subjects={timetableSubjectsArr}
            onUpdateSubject={handleUpdateSubject}
            onAddSubject={handleAddSubject}
          />
        </div>
      </div>

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
    </>
  );
}
