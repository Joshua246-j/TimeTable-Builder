"use client";

import {
  BookOpen,
  AlertTriangle,
  MoreVertical,
  Users,
  Pencil,
  Trash2,
  GitMerge,
  SplitSquareHorizontal,
  Lock,
} from "lucide-react";

import SubjectPreviewPopover from "./SubjectPreviewPopover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { memo } from "react";
import type { SubjectCardData, ScheduleEntry } from "@/types/timetable";
import { ValidationIssue } from "@/services/validationService";


interface SubjectClassCardProps {
  data?: SubjectCardData;
  scheduleEntry?: ScheduleEntry;
  hasConflict?: boolean;
  conflictData?: ValidationIssue;
  isLocked?: boolean;
  isReadOnly?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onMerge?: () => void;
  onSplit?: () => void;
  assignedTime?: string;
  assignedDay?: string;
}

export default memo(function SubjectClassCard({
  data,
  scheduleEntry,
  hasConflict = false,
  conflictData,
  isLocked = false,
  isReadOnly = false,
  onEdit,
  onDelete,
  onMerge,
  onSplit,
  assignedTime,
  assignedDay,
}: SubjectClassCardProps) {
  const typeKey = data?.type?.toUpperCase() || "THEORY";
  const rowSpan = scheduleEntry?.rowSpan || 1;

  // Determine the color dot based on the type
  const getDotColor = () => {
    switch (typeKey) {
      case "THEORY": return "bg-green-500";
      case "LAB": return "bg-yellow-400";
      case "TUTORIAL": return "bg-purple-500";
      case "ELECTIVE": return "bg-orange-500";
      case "SEMINAR": return "bg-blue-500";
      default: return "bg-slate-400";
    }
  };

  if (isReadOnly) {
    return (
      <div className={`flex-1 p-[16px] flex flex-col relative min-w-0 h-full font-inter bg-white rounded-[16px] overflow-hidden ${rowSpan > 1 ? 'justify-center' : ''}`}>
        {/* Thick Left Border Indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#4F6BFF] rounded-l-[16px]"></div>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-h-0 pl-1 ${rowSpan > 1 ? 'justify-center' : ''}`}>
          <h3 className="font-[800] text-[#1E293B] leading-tight text-[13px] line-clamp-2 mb-1">
            {data?.subjectName || "Subject"}
          </h3>
          
          <div className="flex flex-col gap-0.5 text-[11px] font-[500] text-[#64748B]">
            <span className="truncate">{data?.facultyName || "Faculty"}</span>
            <span className="truncate">{data?.roomName || "Room"}</span>
          </div>
        </div>

        {/* Type Indicator Dot */}
        <div className="absolute bottom-3 right-3">
          <div className={`w-[6px] h-[6px] rounded-full ${getDotColor()}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2.5 flex flex-col relative min-w-0 h-full font-inter bg-white rounded-r-[16px]">
      
      {/* Actions / Conflict indicator */}
      {hasConflict && (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded bg-orange-100 text-orange-500 flex items-center justify-center z-20 cursor-help">
                <AlertTriangle className="h-2 w-2" />
              </div>
            </TooltipTrigger>
            {conflictData && (
              <TooltipContent className="bg-white text-slate-800 p-3 shadow-lg border border-red-100 min-w-[200px]" side="top" align="center">
                <div className="font-bold text-red-600 flex items-center gap-2 mb-1 border-b border-red-100 pb-1">
                  <AlertTriangle className="h-4 w-4" />
                  {conflictData.conflictType || 'Scheduling Conflict'}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-h-0 cursor-pointer w-full"
        onDoubleClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(); }}
      >
        <div className={`flex flex-col flex-1 min-h-0 transition-all duration-300 ${scheduleEntry && scheduleEntry.rowSpan > 1 ? 'justify-center' : 'justify-start'}`}>
          {/* Top Header: Icon + Title + Subtitle */}
          <div className="flex items-start gap-1.5 mb-3 relative">
            <div className="w-[24px] h-[24px] rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-[12px] h-[12px]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 pr-4">
              <h3 className="font-[800] text-[#1E293B] leading-snug text-[12px] pr-1">
                {data?.subjectName || "Subject"}
              </h3>
              <span className="text-[9px] font-[600] text-[#94A3B8] truncate mt-0.5">
                {data?.code || "CS301"} • {data?.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1).toLowerCase() : "Lecture"}
              </span>
            </div>
            
            <div className="absolute right-0 top-0 flex items-center text-slate-300">
               {!isReadOnly && (
                 <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <button onClick={(e) => e.stopPropagation()} className="p-0.5 hover:bg-slate-100 rounded-md transition-colors">
                     <MoreVertical className="w-[14px] h-[14px] hover:text-slate-500" />
                   </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-40 font-inter p-1 border border-slate-100 shadow-lg rounded-xl">
                   {onEdit && (
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-xs font-semibold text-slate-600 cursor-pointer rounded-lg hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 px-3 py-2">
                       <Pencil className="w-3.5 h-3.5 mr-2" />
                       Edit
                     </DropdownMenuItem>
                   )}
                   {onMerge && (
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMerge(); }} className="text-xs font-semibold text-slate-600 cursor-pointer rounded-lg hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 px-3 py-2">
                       <GitMerge className="w-3.5 h-3.5 mr-2" />
                       Merge Cells
                     </DropdownMenuItem>
                   )}
                   {onSplit && scheduleEntry?.rowSpan && scheduleEntry.rowSpan > 1 && (
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSplit(); }} className="text-xs font-semibold text-slate-600 cursor-pointer rounded-lg hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 px-3 py-2">
                       <SplitSquareHorizontal className="w-3.5 h-3.5 mr-2" />
                       Split Cells
                     </DropdownMenuItem>
                   )}
                 </DropdownMenuContent>
               </DropdownMenu>
               )}
            </div>
          </div>

          {/* Middle: Faculty & Room Pills & Period Chip */}
          <div className="flex flex-col gap-2 mb-2 pl-[30px]">
            <div className="flex items-center gap-1.5">
              {data?.facultyName && (
                <div className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-[700] text-[#475569] shrink-0 truncate max-w-[50px]">
                  {data.facultyName.charAt(0).toUpperCase()}.
                </div>
              )}
              {data?.roomName && (
                <div className="px-1.5 py-0.5 rounded bg-indigo-50 text-[9px] font-[800] text-[#4F46E5] shrink-0 truncate max-w-[60px]">
                  {data.roomName}
                </div>
              )}
            </div>
            
            {scheduleEntry && scheduleEntry.rowSpan > 1 && (
              <div className="self-start px-2 py-0.5 rounded bg-purple-50 text-[9px] font-[800] text-purple-600 shrink-0">
                {scheduleEntry.rowSpan} Periods
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Section, Delete & Eye Button */}
        <div className="flex items-center justify-between mt-auto pt-1 w-full relative">
          <div className="flex items-center gap-1 text-slate-400 min-w-0 pr-12">
            <Users className="w-3 h-3 shrink-0" />
            <span className="text-[9px] font-[600] truncate">
              {data?.section || "Section CSE V A"}
            </span>
          </div>
          
          <div className="absolute right-0 flex items-center gap-1 bg-white pl-1 shrink-0">
             {onDelete && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="p-0.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors outline-none"
                  title="Remove subject"
                >
                  <Trash2 className="w-[14px] h-[14px]" />
                </button>
             )}
             {data && (
               <SubjectPreviewPopover 
                 subject={data} 
                 assignedTime={assignedTime} 
                 assignedDay={assignedDay} 
               />
             )}
          </div>
        </div>

      </div>

      {isLocked && (
        <div className="absolute top-2 right-6 flex items-center z-20 text-slate-300">
          <Lock className="w-3 h-3" />
        </div>
      )}
    </div>
  );
});