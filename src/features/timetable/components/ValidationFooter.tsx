"use client";

import { CheckCircle2, RotateCcw, RotateCw, Trash2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { undoHistory, redoHistory } from "@/store/historySlice";
import { clearAllocations } from "@/store/timetableEngineSlice";
import { runValidation } from "@/store/syntheticActions";

interface ValidationFooterProps {
  onOpenConflicts?: () => void;
}

export default function ValidationFooter({ onOpenConflicts }: ValidationFooterProps) {
  const dispatch = useDispatch<AppDispatch>();
  const validation = useSelector((state: RootState) => state.validation);
  
  const hasConflicts = validation.conflicts.length > 0;
  const hasWarnings = validation.warnings.length > 0;
  const totalIssues = validation.conflicts.length + validation.warnings.length;

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear ALL allocations in the timetable? Subjects, rooms, and faculty will not be deleted.")) {
      dispatch(clearAllocations());
      dispatch(runValidation());
    }
  };

  const handleUndo = () => dispatch(undoHistory());
  const handleRedo = () => dispatch(redoHistory());

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between rounded-xl border bg-white p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] lg:shadow-sm transition-colors ${hasConflicts ? 'border-orange-200 cursor-pointer hover:bg-orange-50/30' : hasWarnings ? 'border-yellow-200' : 'border-[#E5E7EB]'}`}
         onClick={() => {
           if (hasConflicts && onOpenConflicts) {
             onOpenConflicts();
           }
         }}
    >
      {/* Left side: Status */}
      <div className="flex items-center gap-3">
        {hasConflicts ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
        ) : hasWarnings ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
        <div>
          <h4 className={`text-sm font-semibold ${hasConflicts ? 'text-slate-900' : 'text-slate-900'}`}>
            {hasConflicts ? "Scheduling Conflicts Detected" : hasWarnings ? "Scheduling Warnings" : "Schedule Validated"}
          </h4>
          <p className="text-xs text-slate-500">
            {hasConflicts || hasWarnings 
              ? `${totalIssues} issue(s) found. Check faculty and room availability.`
              : "No critical conflicts detected for the current week."
            }
          </p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="mt-4 flex items-center gap-2 sm:mt-0">
        <Button variant="ghost" className="h-9 gap-2 text-slate-600" onClick={handleUndo}>
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Undo</span>
        </Button>
        <Button variant="ghost" className="h-9 gap-2 text-slate-600" onClick={handleRedo}>
          <RotateCw className="h-4 w-4" />
          <span className="hidden sm:inline">Redo</span>
        </Button>
        
        <div className="mx-2 h-4 w-px bg-slate-200" />

        <Button variant="ghost" className="h-9 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleClearAll}>
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Clear All</span>
        </Button>
      </div>
    </div>
  );
}
