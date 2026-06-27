"use client";

import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { disableSelectionMode } from "@/store/timetableEngineSlice";
import { mergeSelectedPeriods } from "@/store/syntheticActions";

import { mergeEngine } from "@/lib/mergeEngine";
import { cn } from "@/lib/utils";

export default memo(function SelectionToolbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCells, selectionMode } = useSelector((state: RootState) => state.timetableEngine);
  const { breaks, timeSlots } = useSelector((state: RootState) => state.gridConfig);

  if (!selectionMode && selectedCells.length === 0) return null;

  const validation = mergeEngine.canMerge(selectedCells, breaks, timeSlots);
  const canMerge = validation.success;
  const mergeError = validation.reason || "Only adjacent periods of the same subject can be merged.";

  const handleMerge = () => {
    if (selectedCells.length < 2) return;
    
    const subjId = selectedCells[0].subjectId;
    if (!subjId) {
      alert("Please assign a subject to the first slot before merging.");
      return;
    }

    dispatch(mergeSelectedPeriods({ subjectId: subjId }));
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
              <div className="bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg max-w-[250px] text-center">
                {mergeError}
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
