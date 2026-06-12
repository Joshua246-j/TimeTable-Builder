"use client";

import { memo } from "react";
import { Eye, GraduationCap, Building2, Users, Clock, CalendarDays, Hash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SubjectCardData } from "@/types/timetable";

interface SubjectPreviewPopoverProps {
  subject: SubjectCardData;
  assignedTime?: string;
  assignedDay?: string;
}

export default memo(function SubjectPreviewPopover({
  subject,
  assignedTime = "Not Assigned",
  assignedDay = "Not Assigned",
}: SubjectPreviewPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors ml-2 p-1 rounded-full hover:bg-indigo-50 outline-none">
          <Eye className="w-[18px] h-[18px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        side="left" 
        sideOffset={16}
        className="w-72 p-0 rounded-xl shadow-lg border border-slate-200 overflow-hidden font-inter z-50 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-indigo-50/80 px-4 py-3 border-b border-indigo-100 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">{subject.subjectName}</h4>
            <div className="text-xs font-semibold text-indigo-600 mt-0.5">{subject.code || "CS301"}</div>
          </div>
          <div className="shrink-0 bg-white border border-indigo-200 rounded-md px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
            {subject.type}
          </div>
        </div>
        
        <div className="p-4 space-y-3 bg-white">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate flex-1 font-medium text-slate-700">{subject.facultyName || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate flex-1">{subject.roomName || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate flex-1">{subject.section || "No Section"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Hash className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate flex-1">{subject.credits || 0} Credits</span>
          </div>
          
          <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate flex-1 font-medium">{assignedTime}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate flex-1 font-medium">{assignedDay}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
