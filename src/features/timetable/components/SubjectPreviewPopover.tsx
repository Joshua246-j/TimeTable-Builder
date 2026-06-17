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
        <button className="text-slate-400 cursor-pointer hover:text-[#4F6BFF] transition-all duration-200 ml-2 p-1.5 rounded-full hover:bg-blue-50 hover:scale-110 hover:shadow-sm outline-none">
          <Eye className="w-[18px] h-[18px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        side="left" 
        sideOffset={16}
        className="w-[320px] p-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden font-inter z-50 bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=left]:slide-in-from-right-4 transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Header */}
        <div className="bg-gradient-to-br from-[#4F6BFF] to-[#3B4BE5] px-5 py-4 flex items-start gap-4 text-white relative overflow-hidden">
          {/* Background pattern/glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex-1 min-w-0 relative z-10">
            <h4 className="font-bold text-white text-[16px] leading-tight truncate drop-shadow-sm">{subject.subjectName}</h4>
            <div className="text-[12px] font-bold text-blue-100 mt-1 uppercase tracking-wider drop-shadow-sm">{subject.code || "CS301"}</div>
          </div>
          <div className="shrink-0 relative z-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
            {subject.type}
          </div>
        </div>
        
        <div className="p-5 space-y-4 bg-white/80 backdrop-blur-lg">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Faculty</span>
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-3.5 h-3.5 text-[#4F6BFF]" />
                      </div>
                      <span className="truncate">{subject.facultyName || "Unassigned"}</span>
                  </div>
              </div>
              <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room</span>
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-[#C2410C]" />
                      </div>
                      <span className="truncate">{subject.roomName || "Unassigned"}</span>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section</span>
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center shrink-0">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <span className="truncate">{subject.section || "No Section"}</span>
                  </div>
              </div>
              <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credits</span>
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center shrink-0">
                          <Hash className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="truncate">{subject.credits || 0}</span>
                  </div>
              </div>
          </div>
          
          {/* Timing Section */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                  <CalendarDays className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Day</span>
                  <span className="text-[12px] font-bold text-slate-700">{assignedDay}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                  <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Slot</span>
                  <span className="text-[12px] font-bold text-slate-700">{assignedTime}</span>
              </div>
            </div>
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
});
