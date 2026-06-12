"use client";

import {
  Pencil,
  Send,
  Eye,
  TriangleAlert,
  LayoutGrid,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { enableSelectionMode, disableSelectionMode } from "@/store/timetableEngineSlice";
import { mergeSelectedPeriods, runValidation } from "@/store/syntheticActions";
import { undoHistory, redoHistory } from "@/store/historySlice";
import { RootState, AppDispatch } from "@/store/store";


interface ActionToolbarProps {
  onOpenConflicts?: () => void;
}

export default function ActionToolbar({
  onOpenConflicts,
}: ActionToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectionMode, selectedCells } = useSelector((state: RootState) => state.timetableEngine);
  const { conflicts } = useSelector((state: RootState) => state.validation);

  const handleToggleSelectionMode = () => {
    if (selectionMode) {
      dispatch(disableSelectionMode());
    } else {
      dispatch(enableSelectionMode());
    }
  };

  const handleMerge = () => {
    if (selectedCells.length < 2) return;
    
    // In a real scenario, we might prompt for which subject to use, 
    // or just use the first assigned subject in the selection.
    // For now, let's take the first assigned subject or error.
    const firstAssigned = selectedCells.find(c => c.subjectId);
    if (!firstAssigned || !firstAssigned.subjectId) {
      alert("Please select slots that have an assigned subject to merge.");
      return;
    }

    dispatch(mergeSelectedPeriods({ subjectId: firstAssigned.subjectId }));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Top Row: Actions */}
      <div className="flex w-full items-center justify-between">
        
        {/* Left Actions */}
        <div className="flex items-center gap-4">
          
          {/* Auto Allocate */}
          <button className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-left transition-all hover:border-[#4F6BFF] hover:bg-[#F8FAFF] min-w-[200px]" style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)" }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F4FF]">
              <Pencil className="h-5 w-5 text-[#4F6BFF]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0D2463]">Auto Allocate</h3>
              <p className="text-xs text-slate-500">Smart resource mapping</p>
            </div>
          </button>

          {/* Detect Conflicts */}
          <button 
            onClick={() => {
              dispatch(runValidation());
              if (onOpenConflicts) onOpenConflicts();
            }}
            className={`flex items-center gap-3 rounded-2xl border ${conflicts.length > 0 ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] bg-white'} px-4 py-3 text-left transition-all hover:border-red-300 hover:bg-red-50 min-w-[200px]`} 
            style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)" }}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${conflicts.length > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${conflicts.length > 0 ? 'text-red-700' : 'text-[#0D2463]'}`}>Detect Conflicts</h3>
              <p className={`text-xs ${conflicts.length > 0 ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                {conflicts.length > 0 ? `${conflicts.length} Conflicts Detected` : 'Verify constraints'}
              </p>
            </div>
          </button>
          
          {/* Select Mode */}
          <button 
            onClick={handleToggleSelectionMode}
            id="enable-selection-btn"
            className={`flex items-center gap-3 rounded-2xl border ${selectionMode ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-[#E5E7EB] bg-white'} px-4 py-3 text-left transition-all hover:border-[#2563EB] hover:bg-blue-50 min-w-[150px]`} style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)" }}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selectionMode ? 'bg-blue-600 text-white' : 'bg-[#DBEAFE] text-[#2563EB]'}`}>
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${selectionMode ? 'text-blue-700' : 'text-[#0D2463]'}`}>Select</h3>
              <p className={`text-xs ${selectionMode ? 'text-blue-500' : 'text-slate-500'}`}>
                {selectionMode ? 'Mode Active' : 'Enable merge'}
              </p>
            </div>
          </button>
          
          {selectionMode && selectedCells.length >= 2 && (
             <Button 
               onClick={handleMerge}
               className="h-12 rounded-2xl bg-indigo-600 px-6 font-bold text-white hover:bg-indigo-700"
             >
               Merge {selectedCells.length} Slots
             </Button>
          )}

        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-slate-200 rounded-[10px] p-1 bg-white">
            <button
              onClick={() => {
                dispatch(undoHistory());
              }}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Undo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button
              onClick={() => {
                dispatch(redoHistory());
              }}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Redo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </button>
          </div>

          <Button variant="outline" className="h-[36px] rounded-[10px] border-[#E5E7EB] px-5 font-semibold text-slate-700">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button className="h-[36px] rounded-[10px] bg-[#4F46E5] px-5 font-semibold text-white hover:bg-[#4338ca]">
            <Send className="mr-2 h-4 w-4" />
            Publish Timetable
          </Button>
        </div>
      </div>

      {/* Bottom Row: Filter Bar */}
      <div className="flex w-full items-center gap-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
          <LayoutGrid className="h-4 w-4" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-500 tracking-wider">↑↓ SELECTED UNIT</span>
          <select className="bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer">
            <option>Section CSE V A</option>
            <option>Section CSE V B</option>
          </select>
        </div>

      </div>
    </div>
  );
}