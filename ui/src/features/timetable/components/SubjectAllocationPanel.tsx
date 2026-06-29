"use client";

import { memo, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

import SubjectAllocationCard from "./SubjectAllocationCard";
import type { SubjectCardData } from "@/types/timetable";

interface SubjectAllocationPanelProps {
  subjects: SubjectCardData[];
  onUpdateSubject: (subject: SubjectCardData) => void;
  onAddSubject: () => void;
  onClose?: () => void;
}

export default memo(function SubjectAllocationPanel({
  subjects,
  onClose,
}: SubjectAllocationPanelProps) {
  const router = useRouter();

  const handleAddNew = useCallback(() => {
    router.push("/dashboard/academic-modules/new?from=/dashboard/timetable/builder");
  }, [router]);

  return (
    <aside
      className="
        flex
        h-[90dvh]
        flex-col
        bg-white
      "
    >
      {/* Header */}

      <div
        className="
          border-b
          border-[#E5E7EB]
          px-5
          py-5
          sticky
          top-0
          bg-white
          z-10
        "
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="
                text-[20px]
                font-semibold
                text-slate-900
              "
            >
              Subject Allocation
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Manage faculty & rooms
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-md
              p-1
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Subject List */}

      <div
        className="
          flex-1
          
          overflow-y-scroll
          p-5
        "
      >
        <div className="space-y-4">
          {subjects.map((subject) => (
            <SubjectAllocationCard
              key={subject.id}
              subject={subject}
              onEdit={() => router.push(`/dashboard/academic-modules/${subject.id}/settings?from=/dashboard/timetable/builder`)}
            />
          ))}
        </div>
      </div>

      {/* Editor Modal Removed */}

      {/* Footer - Fixed at bottom */}
      <div className="p-5 flex flex-col gap-4 sticky bottom-0 bg-white border-t border-slate-200 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={handleAddNew}
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-dashed
            border-[#D6DDF5]
            bg-white
            text-sm
            font-medium
            text-[#4F6BFF]
            transition-colors
            hover:bg-[#F8FAFF]
          "
        >
          <Plus className="h-4 w-4" />
          Add New Subject
        </button>
      </div>
    </aside>
  );
});