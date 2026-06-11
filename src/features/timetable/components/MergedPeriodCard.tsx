"use client";

import { memo } from "react";
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
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteMergedAllocation } from "@/store/mergeSlice";
import { lockAllocation, unlockAllocation } from "@/store/lockSlice";
import { ScheduleEntry, SubjectCardData } from "@/types/timetable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MergedPeriodCardProps {
  group: ScheduleEntry;
  subject?: SubjectCardData;
  onEdit?: () => void;
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

export default memo(function MergedPeriodCard({
  group,
  subject,
  onEdit,
}: MergedPeriodCardProps) {
  const dispatch = useDispatch();

  const typeKey = subject?.type?.toUpperCase() || "THEORY";
  const styles = BADGE_STYLES[typeKey] || BADGE_STYLES.THEORY;
  const Icon = styles.icon;
  const hasConflict = subject?.hasConflict || false;

  return (
    <div className="flex-1 p-[14px] flex flex-col justify-center relative min-w-0 h-full font-inter bg-white rounded-r-[10px]">
      
      {/* Actions / Conflict indicator */}
      {hasConflict && (
        <div className="absolute top-2 right-8 h-4 w-4 rounded bg-orange-100 text-orange-500 flex items-center justify-center z-20">
          <AlertTriangle className="h-2.5 w-2.5" />
        </div>
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
            {!group.isLocked && onEdit && (
              <>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="cursor-pointer">
                  <Pencil className="w-4 h-4 mr-2 text-slate-500" /> Edit Subject
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="cursor-pointer">
                  <Users className="w-4 h-4 mr-2 text-slate-500" /> Edit Teacher
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" /> Edit Room
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="cursor-pointer">
                  <Clock className="w-4 h-4 mr-2 text-slate-500" /> Edit Time
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                if (group.isLocked) {
                  dispatch(unlockAllocation(group.id));
                } else {
                  dispatch(lockAllocation(group.id));
                }
              }}
              className="cursor-pointer"
            >
              {group.isLocked ? (
                <><Unlock className="w-4 h-4 mr-2 text-blue-600" /> Unlock</>
              ) : (
                <><Lock className="w-4 h-4 mr-2" /> Lock</>
              )}
            </DropdownMenuItem>

            {!group.isLocked && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); dispatch(deleteMergedAllocation(group.id)); }}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Assignment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {group.isLocked && (
        <div className="absolute bottom-3 right-8 flex items-center z-20 text-slate-400">
          <Lock className="w-3 h-3" />
        </div>
      )}

      <div 
        className="flex flex-col my-auto max-h-full cursor-pointer"
        onDoubleClick={(e) => { e.stopPropagation(); if(onEdit && !group.isLocked) onEdit(); }}
      >
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 pt-0.5">
          
          {/* Title Area */}
          <div className="flex items-start gap-[12px]">
            <div className="w-[38px] h-[38px] shrink-0 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#4F46E5]" />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <h3 className="font-[700] text-[#0F172A] leading-tight text-[15px] line-clamp-2 mb-0.5" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                {subject?.subjectName || "Subject"}
              </h3>
              <div className="flex flex-wrap items-center font-medium text-[#94A3B8] text-[12px] gap-1.5 mt-1">
                <span className="truncate">
                  {subject?.code || "CODE"} <span className="mx-0.5">•</span> <span className="capitalize">{subject?.type === "THEORY" ? "Lecture" : subject?.type?.toLowerCase() || "Lecture"}</span>
                </span>
                <div className="rounded-[4px] bg-[#DBEAFE] px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB]">
                  {group.rowSpan} Periods
                </div>
              </div>
            </div>
          </div>

          {/* Faculty + Room Chips */}
          <div className="mt-[14px] flex items-center gap-[8px] min-w-0">
            <div className="flex items-center rounded-md border border-[#E2E8F0] bg-white px-[8px] h-[28px] min-w-0 max-w-[150px]">
              <span className="truncate text-[12px] font-[600] text-[#475569] w-full">
                {subject?.facultyName || "Faculty"}
              </span>
            </div>

            <div className="flex items-center shrink-0 rounded-md bg-[#EEF2FF] px-[8px] h-[28px]">
              <span className="text-[12px] font-[700] text-[#4F46E5] whitespace-nowrap">
                {subject?.roomName || "Room"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Area - Always bottom aligned */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-transparent shrink-0">
          <div className="flex items-center gap-1.5 text-[#94A3B8] min-w-0">
            <Users className="w-4 h-4 shrink-0" />
            <span className="text-[12px] font-medium truncate">{subject?.section || "Section CSE V A"}</span>
          </div>
          
          {/* Bookmark Icon */}
          <div className="text-[#818CF8] cursor-pointer hover:text-[#4F46E5] transition-colors ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={subject?.bookmarkStatus ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
        </div>
      </div>

    </div>
  );
});