"use client";

import { Building2, MoreVertical, Pencil, Copy, Trash2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { addSubject } from "@/store/subjectSlice";
import { useDraggable } from "@dnd-kit/core";
import { deleteSubjectGlobal } from "@/store/syntheticActions";

interface SubjectAllocationCardProps {
  subject: {
    id: string;
    code?: string;
    credits?: number;
    type: string;
    subjectName: string;
    facultyName: string;
    roomName: string;
  };
  onEdit: () => void;
}

export default function SubjectAllocationCard({
  subject,
  onEdit,
}: SubjectAllocationCardProps) {


  const dispatch = useDispatch<AppDispatch>();
  const { allocations } = useSelector((state: RootState) => state.timetableEngine);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: subject.id,
    data: {
      type: "SUBJECT",
      subject,
    },
  });

  const handleDelete = () => {
    // Check if assigned
    const isAssigned = Object.values(allocations).some(a => a.subjectId === subject.id);
    
    if (isAssigned) {
      if (confirm("Subject currently used.\n\nDelete subject and ALL timetable allocations globally?")) {
        dispatch(deleteSubjectGlobal({ subjectId: subject.id }));
      }
    } else {
      dispatch(deleteSubjectGlobal({ subjectId: subject.id }));
    }
  };

  const handleDuplicate = () => {
    dispatch(addSubject({
      ...subject,
      id: `duplicate-${Date.now()}`,
      subjectName: `${subject.subjectName} (Copy)`,
      isEditable: true,
    }));
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onEdit}
      className={`
        rounded-2xl
        border
        bg-white
        transition-all
        cursor-grab
        active:cursor-grabbing
        ${isDragging ? "opacity-50 ring-2 ring-blue-500 shadow-xl" : "border-[#E5E7EB] hover:border-slate-300 hover:shadow-sm"}
      `}
    >
      <div className="p-[16px] flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h3
              className="
                text-[15px]
                font-bold
                text-slate-900
                leading-tight
                truncate
              "
              title={subject.subjectName}
            >
              {subject.subjectName}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {subject.code || "CODE"}
              </span>

              <span className="text-[11px] font-semibold text-slate-300">
                •
              </span>

              <span
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {subject.credits || 4} CREDITS
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-slate-400
                  transition
                  hover:bg-slate-50
                  hover:text-slate-700
                "
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Subject</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer">
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicate Subject</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Subject</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* FACULTY + ROOM */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Faculty
            </p>

            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-[13px]
                font-semibold
                text-slate-700
              "
            >
              <User className="h-4 w-4 text-[#2563EB]" />
              <span className="truncate">{subject.facultyName || "Unassigned"}</span>
            </div>
          </div>

          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Room
            </p>

            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-[13px]
                font-semibold
                text-slate-700
              "
            >
              <Building2 className="h-4 w-4 text-[#2563EB]" />
              <span className="truncate">{subject.roomName || "Unassigned"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}