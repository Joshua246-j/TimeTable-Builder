"use client";

import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { disableSelectionMode } from "@/store/selectionSlice";
import { createMergedAllocation } from "@/store/mergeSlice";
import { ScheduleEntry } from "@/types/timetable";
import { mergeEngine } from "@/lib/mergeEngine";
import { cn } from "@/lib/utils";

export default memo(function SelectionToolbar() {
  const dispatch = useDispatch();
  const { selectedCells, selectionMode } = useSelector((state: RootState) => state.selection);

  if (!selectionMode && selectedCells.length === 0) return null;

  const canMerge = mergeEngine.canMerge(selectedCells);

  const handleMerge = () => {
    if (!canMerge) return;
    
    // selectedCells are already sorted by rowIndex if using selectionSlice reducer
    const startCell = selectedCells[0];
    const endCell = selectedCells[selectedCells.length - 1];

    const newGroup: ScheduleEntry = {
      id: crypto.randomUUID(),
      dayId: startCell.day || startCell.id.split('-')[0], // Simplified day extraction
      startTime: startCell.startTime,
      endTime: endCell.endTime,
      rowSpan: selectedCells.length,
      rowStart: startCell.rowIndex,
      subjectId: startCell.subjectId || "",
      isLocked: false,
      isEditable: true,
    };

    dispatch(createMergedAllocation(newGroup));
    dispatch(disableSelectionMode());
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-300 font-inter">
      <div className="flex items-center gap-4 px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-full">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DBEAFE] text-[#2563EB] text-xs font-bold">
            {selectedCells.length}
          </div>
          <span className="text-sm font-semibold text-slate-700">Selected</span>
        </div>

        <div className="flex items-center gap-2 relative group">
          <button
            onClick={handleMerge}
            disabled={!canMerge}
            className={cn(
              "px-4 py-1.5 text-sm font-bold rounded-full transition-colors",
              canMerge 
                ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-md shadow-blue-500/20" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            Merge
          </button>
          
          {!canMerge && selectedCells.length > 1 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max">
              <div className="bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg">
                Only adjacent periods of the same subject can be merged.
              </div>
            </div>
          )}
          
          <button
            onClick={() => dispatch(disableSelectionMode())}
            className="px-4 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});
