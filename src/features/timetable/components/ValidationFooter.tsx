"use client";

import { CheckCircle2, RotateCcw, RotateCw, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValidationFooterProps {
  conflictCount?: number;
}

export default function ValidationFooter({ conflictCount = 0 }: ValidationFooterProps) {
  const hasConflicts = conflictCount > 0;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between rounded-xl border bg-white p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] lg:shadow-sm ${hasConflicts ? 'border-orange-200' : 'border-[#E5E7EB]'}`}>
      {/* Left side: Status */}
      <div className="flex items-center gap-3">
        {hasConflicts ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
        <div>
          <h4 className={`text-sm font-semibold ${hasConflicts ? 'text-slate-900' : 'text-slate-900'}`}>
            {hasConflicts ? "Scheduling Conflicts Detected" : "Schedule Validated"}
          </h4>
          <p className="text-xs text-slate-500">
            {hasConflicts 
              ? `${conflictCount} clash(es) found. Review highlighted slots.`
              : "No critical conflicts detected for the current week."
            }
          </p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="mt-4 flex items-center gap-2 sm:mt-0">
        <Button variant="ghost" className="h-9 gap-2 text-slate-600">
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Undo</span>
        </Button>
        <Button variant="ghost" className="h-9 gap-2 text-slate-600">
          <RotateCw className="h-4 w-4" />
          <span className="hidden sm:inline">Redo</span>
        </Button>
        
        <div className="mx-2 h-4 w-px bg-slate-200" />

        <Button variant="ghost" className="h-9 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Clear All</span>
        </Button>
      </div>
    </div>
  );
}
