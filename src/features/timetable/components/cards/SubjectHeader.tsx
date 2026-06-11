import { memo } from "react";
import {
  BookOpen,
  FlaskConical,
  PenTool,
  LayoutDashboard,
  Briefcase,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SubjectHeaderProps {
  subjectName: string;
  code?: string;
  type?: string;
  hasConflict?: boolean;
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

export default memo(function SubjectHeader({
  subjectName,
  code,
  type,
  hasConflict,
}: SubjectHeaderProps) {
  const typeKey = type?.toUpperCase() || "THEORY";
  const styles = BADGE_STYLES[typeKey] || BADGE_STYLES.THEORY;
  const Icon = styles.icon;

  return (
    <>
      {hasConflict ? (
        <div className="absolute top-2 right-2 h-4 w-4 rounded bg-orange-100 text-orange-500 flex items-center justify-center z-20">
          <AlertTriangle className="h-2.5 w-2.5" />
        </div>
      ) : (
        <button className="absolute top-2 right-2 text-[#CBD5E1] hover:text-slate-600 transition-colors z-20">
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex items-start gap-[10px]">
        <div className="w-[36px] h-[36px] shrink-0 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center mt-0.5">
          <Icon className="w-4 h-4 text-[#2563EB]" />
        </div>

        <div className="flex-1 min-w-0 pr-5">
          <h3 className="font-[700] text-[#111827] leading-[1.2] text-[15px] line-clamp-2" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
            {subjectName}
          </h3>
          <div className="mt-0.5 truncate font-medium text-[#94A3B8] text-[11px]">
            {code || "CS301"} • <span className="capitalize">{type === "THEORY" ? "Lecture" : type?.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </>
  );
});
