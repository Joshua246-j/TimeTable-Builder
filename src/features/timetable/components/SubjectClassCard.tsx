"use client";

import {
  BookOpen,
  FlaskConical,
  PenTool,
  LayoutDashboard,
  Briefcase,
  AlertTriangle,
  MoreVertical,
  Lock,
  Unlock,
  Users,
  Pencil,
  Trash2,
  GitMerge,
  SplitSquareHorizontal,
} from "lucide-react";

import SubjectPreviewPopover from "./SubjectPreviewPopover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import type { SubjectCardData, ScheduleEntry } from "@/types/timetable";
import { ValidationIssue } from "@/services/validationService";


interface SubjectClassCardProps {
  data?: SubjectCardData;
  scheduleEntry?: ScheduleEntry;
  hasConflict?: boolean;
  conflictData?: ValidationIssue;
  isLocked?: boolean;
  onToggleLock?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMerge?: () => void;
  onSplit?: () => void;
  assignedTime?: string;
  assignedDay?: string;
}

type BadgeStyle = {
  bg: string;
  text: string;
  iconBg: string;
  icon: LucideIcon;
};

const BADGE_STYLES: Record<string, BadgeStyle> = {
  THEORY: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    iconBg: "bg-indigo-50 text-indigo-600",
    icon: BookOpen,
  },
  LAB: {
    bg: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-700",
    iconBg: "bg-indigo-50 text-indigo-600",
    icon: FlaskConical,
  },
  TUTORIAL: {
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-700",
    iconBg: "bg-slate-100 text-slate-600",
    icon: PenTool,
  },
  ELECTIVE: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-600",
    icon: LayoutDashboard,
  },
  SEMINAR: {
    bg: "bg-cyan-50 border-cyan-200",
    text: "text-cyan-700",
    iconBg: "bg-cyan-50 text-cyan-600",
    icon: Briefcase,
  },
  WORKSHOP: {
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    iconBg: "bg-purple-50 text-purple-600",
    icon: Briefcase,
  },
};

export default memo(function SubjectClassCard({
  data,
  scheduleEntry,
  hasConflict = false,
  conflictData,
  isLocked = false,
  onToggleLock,
  onEdit,
  onDelete,
  onMerge,
  onSplit,
  assignedTime,
  assignedDay,
}: SubjectClassCardProps) {
  const typeKey = data?.type?.toUpperCase() || "THEORY";
  const styles = BADGE_STYLES[typeKey] || BADGE_STYLES.THEORY;
  const Icon = styles.icon;
  const rowSpan = scheduleEntry?.rowSpan || 1;

  return (
    <div className={`flex-1 p-[14px] flex flex-col relative min-w-0 h-full font-inter bg-white rounded-r-[10px] ${rowSpan > 1 ? 'justify-center' : ''}`}>
      
        {/* Actions / Conflict indicator */}
      {hasConflict && (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="absolute top-2 right-8 h-4 w-4 rounded bg-orange-100 text-orange-500 flex items-center justify-center z-20 cursor-help">
                <AlertTriangle className="h-2.5 w-2.5" />
              </div>
            </TooltipTrigger>
            {conflictData && (
              <TooltipContent className="bg-white text-slate-800 p-3 shadow-lg border border-red-100 min-w-[200px]" side="top" align="center">
                <div className="font-bold text-red-600 flex items-center gap-2 mb-1 border-b border-red-100 pb-1">
                  <AlertTriangle className="h-4 w-4" />
                  {conflictData.conflictType || 'Scheduling Conflict'}
                </div>
                <div className="space-y-1 text-[11px]">
                  {conflictData.affectedSubject && <div className="font-semibold text-slate-900 truncate">{conflictData.affectedSubject}</div>}
                  {conflictData.affectedTeacher && <div className="text-slate-600">👤 {conflictData.affectedTeacher}</div>}
                  {conflictData.affectedRoom && <div className="text-slate-600">🚪 {conflictData.affectedRoom}</div>}
                  {conflictData.affectedTime && <div className="text-slate-600 mt-1 pt-1 border-t border-slate-100">🕒 {conflictData.affectedTime}</div>}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}

      {/* 3 dots Dropdown menu */}
      <div className="absolute top-3 right-3 flex items-center z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="text-slate-300 hover:text-slate-500 transition-colors p-1 rounded-md hover:bg-slate-50 outline-none"
              title="Options"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 z-50 font-inter text-sm">
            {!isLocked && (
              <>
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="cursor-pointer">
                    <Pencil className="w-4 h-4 mr-2 text-slate-500" /> Edit Subject
                  </DropdownMenuItem>
                )}
                {onMerge && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMerge(); }} className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50 font-medium">
                    <GitMerge className="w-4 h-4 mr-2" /> Merge Periods
                  </DropdownMenuItem>
                )}
                {onSplit && scheduleEntry && scheduleEntry.rowSpan > 1 && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSplit(); }} className="cursor-pointer text-orange-600 focus:text-orange-700 focus:bg-orange-50 font-medium">
                    <SplitSquareHorizontal className="w-4 h-4 mr-2" /> Split Periods
                  </DropdownMenuItem>
                )}
              </>
            )}
            
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleLock) onToggleLock();
              }}
              className="cursor-pointer"
            >
              {isLocked ? (
                <><Unlock className="w-4 h-4 mr-2 text-blue-600" /> Unlock</>
              ) : (
                <><Lock className="w-4 h-4 mr-2" /> Lock</>
              )}
            </DropdownMenuItem>

            {!isLocked && onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(); }}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remove Assignment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLocked && (
        <div className="absolute bottom-3 right-8 flex items-center z-20 text-slate-400">
          <Lock className="w-3 h-3" />
        </div>
      )}

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-0 pt-0.5 cursor-pointer ${rowSpan > 1 ? 'justify-center' : ''}`}
        onDoubleClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(); }}
      >
        
        {/* Title Area */}
        <div className="flex items-start gap-[12px]">
          <div className={`w-[38px] h-[38px] shrink-0 rounded-[8px] flex items-center justify-center ${styles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-12">
            <h3 className="font-[700] text-[#0F172A] leading-tight text-[15px] line-clamp-2 mb-0.5" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
              {data?.subjectName || "Subject"}
            </h3>
            <div className="flex flex-wrap items-center font-medium text-[#94A3B8] text-[12px] gap-1.5 mt-1">
              <span className="truncate">
                {data?.code || "CODE"} <span className="mx-0.5">•</span> <span className="capitalize">{data?.type === "THEORY" ? "Lecture" : data?.type?.toLowerCase() || "Lecture"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Faculty + Room Chips */}
        <div className="mt-[14px] flex flex-nowrap items-center gap-[6px] min-w-0 w-full overflow-hidden">
          <div className="flex items-center rounded-md border border-[#E2E8F0] bg-white px-[8px] h-[28px] min-w-0 flex-1">
            <span className="truncate text-[12px] font-[600] text-[#475569] w-full">
              {data?.facultyName || "Faculty"}
            </span>
          </div>

          <div className="flex items-center shrink-0 rounded-md bg-[#EEF2FF] px-[8px] h-[28px] max-w-[90px]">
            <span className="truncate text-[12px] font-[700] text-[#4F46E5] w-full">
              {data?.roomName || "Room"}
            </span>
          </div>

          {rowSpan > 1 && (
            <div className="flex items-center shrink-0 rounded-md bg-purple-50 px-[8px] h-[28px] border border-purple-100">
              <span className="text-[12px] font-[700] text-purple-600 whitespace-nowrap">
                {rowSpan} Periods
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Area - Always bottom aligned unless merged */}
      <div className={`${rowSpan > 1 ? 'mt-4' : 'mt-auto'} pt-3 flex items-center justify-between bg-transparent shrink-0`}>
        <div className="flex items-center gap-1.5 text-[#94A3B8] min-w-0">
          <Users className="w-4 h-4 shrink-0" />
          <span className="text-[12px] font-medium truncate">{data?.section || "Section CSE V A"}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {onDelete && !isLocked && (
            <button
               onClick={(e) => { e.stopPropagation(); onDelete(); }}
               className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors outline-none"
               title="Unassign Subject"
            >
               <Trash2 className="w-[15px] h-[15px]" />
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
  );
});