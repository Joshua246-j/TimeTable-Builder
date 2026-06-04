"use client";

import {
  Eye,
  Plus,
  Rocket,
  WandSparkles,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FloatingActionButtonProps {
  onAddSubject?: () => void;
  onAutoAllocate?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
}

export default function FloatingActionButton({
  onAddSubject,
  onAutoAllocate,
  onPreview,
  onPublish,
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
              bg-blue-700
              text-white
              shadow-lg
              transition-all
              hover:bg-blue-800
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
          "
        >
          <div className="mb-3">
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
                mt-1
                text-xs
                text-slate-500
              "
            >
              Timetable management shortcuts
            </p>
          </div>

          <div className="space-y-2">
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
                py-3
                text-left
                transition-all
                hover:bg-slate-100
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-100
                "
              >
                <Plus
                  className="
                    h-4
                    w-4
                    text-blue-700
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
              onClick={onAutoAllocate}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                transition-all
                hover:bg-slate-100
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-violet-100
                "
              >
                <WandSparkles
                  className="
                    h-4
                    w-4
                    text-violet-700
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
                Auto Allocate
              </span>
            </button>

            <button
              type="button"
              onClick={onPreview}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                transition-all
                hover:bg-slate-100
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                "
              >
                <Eye
                  className="
                    h-4
                    w-4
                    text-slate-700
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
                Preview Timetable
              </span>
            </button>

            <button
              type="button"
              onClick={onPublish}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                transition-all
                hover:bg-slate-100
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-green-100
                "
              >
                <Rocket
                  className="
                    h-4
                    w-4
                    text-green-700
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
                Publish Timetable
              </span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}