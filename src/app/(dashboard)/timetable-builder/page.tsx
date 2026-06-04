"use client";

import {
  ChevronDown,
  Circle,
} from "lucide-react";

import FiltersBar from "@/features/timetable/components/FiltersBar";
import ActionToolbar from "@/features/timetable/components/ActionToolbar";
import ResourcePanel from "@/features/timetable/components/ResourcePanel";
import StatusPanel from "@/features/timetable/components/StatusPanel";
import TimetableGrid from "@/features/timetable/components/TimetableGrid";
import FloatingActionButton from "@/features/timetable/components/FloatingActionButton";

export default function TimetableBuilderPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <FiltersBar />

      {/* Actions */}
      <ActionToolbar />

      {/* Workspace */}
      <div
        className="
          flex
          flex-col
          gap-6
          xl:flex-row
        "
      >
        {/* Main Area */}
        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          {/* Header */}
          <div
            className="
              border-b
              border-slate-200
              px-5
              py-4
              lg:px-6
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Selected Unit */}
              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Selected Unit
                </p>

                <button
                  className="
                    mt-1
                    flex
                    items-center
                    gap-2
                    text-lg
                    font-semibold
                    text-slate-900
                  "
                >
                  Section CSE V A

                  <ChevronDown
                    className="
                      h-4
                      w-4
                    "
                  />
                </button>
              </div>

              {/* Legend */}
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-4
                  text-xs
                  font-medium
                "
              >
                <div className="flex items-center gap-2">
                  <Circle
                    className="
                      h-3
                      w-3
                      fill-blue-500
                      text-blue-500
                    "
                  />
                  Theory
                </div>

                <div className="flex items-center gap-2">
                  <Circle
                    className="
                      h-3
                      w-3
                      fill-green-500
                      text-green-500
                    "
                  />
                  Lab
                </div>

                <div className="flex items-center gap-2">
                  <Circle
                    className="
                      h-3
                      w-3
                      fill-purple-500
                      text-purple-500
                    "
                  />
                  Tutorial
                </div>

                <div className="flex items-center gap-2">
                  <Circle
                    className="
                      h-3
                      w-3
                      fill-orange-500
                      text-orange-500
                    "
                  />
                  Elective
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Workspace */}
          <div
            className="
              flex-1
              overflow-auto
              bg-slate-50
              p-4
              lg:p-6
            "
          >
            <TimetableGrid
              days={[]}
              timeSlots={[]}
              cells={[]}
            />
          </div>
        </div>

        {/* Resource Panel */}
        <aside
          className="
            w-full
            xl:w-[380px]
            xl:min-w-[380px]
          "
        >
          <ResourcePanel />
        </aside>
      </div>

      {/* Status */}
      <StatusPanel />

      {/* Mobile FAB */}
      <FloatingActionButton />
    </div>
  );
}