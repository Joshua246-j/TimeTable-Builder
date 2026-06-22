"use client";

import {
  CalendarPlus,
  Plus,
  Settings2,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FloatingActionButtonProps {
  onAddSubject?: () => void;
  onAssignSlot?: () => void;
  onOpenSubjectAllocation?: () => void;
}

export default function FloatingActionButton({
  onAddSubject,
  onAssignSlot,
  onOpenSubjectAllocation,
}: FloatingActionButtonProps) {
  return (
    <div
      className="
        fixed
        bottom-6
        right-6
        z-50
        lg:hidden
      "
    >
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Quick Actions"
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#4F6BFF]
              text-white
              shadow-[0_8px_30px_rgb(79,107,255,0.3)]
              transition-all
              hover:bg-[#3d54cc]
              active:scale-95
            "
          >
            <Plus className="h-6 w-6" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="top"
          className="
            w-64
            rounded-2xl
            border-slate-200
            p-3
            mb-2
          "
        >
          <div className="mb-3 px-1">
            <h3
              className="
                text-sm
                font-semibold
                text-slate-900
              "
            >
              Quick Actions
            </h3>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              Timetable management shortcuts
            </p>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={onAddSubject}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-left
                transition-all
                hover:bg-slate-50
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                "
              >
                <Plus
                  className="
                    h-4
                    w-4
                    text-blue-600
                  "
                />
              </div>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Add Subject
              </span>
            </button>

            <button
              type="button"
              onClick={onAssignSlot}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-left
                transition-all
                hover:bg-slate-50
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-purple-50
                "
              >
                <CalendarPlus
                  className="
                    h-4
                    w-4
                    text-purple-600
                  "
                />
              </div>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Assign Slot
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenSubjectAllocation}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-left
                transition-all
                hover:bg-slate-50
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                "
              >
                <Settings2
                  className="
                    h-4
                    w-4
                    text-slate-600
                  "
                />
              </div>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Open Subject Allocation
              </span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}