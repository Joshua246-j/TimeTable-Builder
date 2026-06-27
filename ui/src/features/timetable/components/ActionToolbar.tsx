"use client";

import {
  Pencil,
  TriangleAlert,
  LayoutGrid,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { runValidation, undoAction, redoAction } from "@/store/syntheticActions";
import { RootState, AppDispatch } from "@/store/store";


interface ActionToolbarProps {
  onOpenConflicts?: () => void;
  onPublish?: () => void;
  onCancelEdit?: () => void;
}

export default function ActionToolbar({
  onOpenConflicts,
  onPublish,
  onCancelEdit,
}: ActionToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { conflicts } = useSelector((state: RootState) => state.validation);
  const { allocations, isDirty } = useSelector((state: RootState) => state.timetableEngine);
  
  const hasAllocations = Object.keys(allocations).length > 0;
  const hasConflicts = conflicts.length > 0;
  const canPublish = hasAllocations && !hasConflicts && isDirty;

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
            className={`flex items-center gap-3 rounded-2xl border ${hasConflicts ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB] bg-white'} px-4 py-3 text-left transition-all hover:border-red-300 hover:bg-red-50 min-w-[200px]`} 
            style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)" }}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${hasConflicts ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${hasConflicts ? 'text-red-700' : 'text-[#0D2463]'}`}>Detect Conflicts</h3>
              <p className={`text-xs ${hasConflicts ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                {hasConflicts ? `${conflicts.length} Conflicts Detected` : 'Verify constraints'}
              </p>
            </div>
          </button>
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 border border-[#E5E7EB] rounded-2xl p-1 bg-white shadow-sm ml-2">
            <button
              onClick={() => {
                dispatch(undoAction());
              }}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Undo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button
              onClick={() => {
                dispatch(redoAction());
              }}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Redo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isDirty && (
            <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-2xl text-[13px] font-bold shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
              Unsaved Changes
            </div>
          )}

          {onCancelEdit && (
            <Button 
              variant="outline"
              className="h-[42px] rounded-2xl px-6 font-bold text-slate-600 border-[#E5E7EB] hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          )}

          <Button 
            className={`h-[42px] rounded-2xl px-6 font-bold text-white transition-all ${
              canPublish 
                ? "bg-[#4F6BFF] hover:bg-[#435CE5] shadow-md shadow-blue-200" 
                : "bg-slate-300 cursor-not-allowed text-slate-500 opacity-70"
            }`}
            onClick={canPublish ? onPublish : undefined}
            disabled={!canPublish}
          >
            Publish TimeTable
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