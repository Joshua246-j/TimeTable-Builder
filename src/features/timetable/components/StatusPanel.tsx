"use client";

import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function StatusPanel() {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="p-5">
        {/* Header */}
        <div
          className="
            mb-5
            flex
            flex-col
            gap-3
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <h2
              className="
                text-base
                font-semibold
                text-slate-900
              "
            >
              Schedule Status
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Current timetable optimization and
              allocation overview.
            </p>
          </div>

          <Button
            variant="outline"
            className="gap-2"
          >
            View Full Report
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Metrics */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* Optimization */}
          <div
            className="
              rounded-2xl
              border
              border-green-200
              bg-green-50
              p-5
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-100
                "
              >
                <Sparkles
                  className="
                    h-5
                    w-5
                    text-green-700
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-green-700
                  "
                >
                  Optimization
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  96%
                </h3>
              </div>
            </div>

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
              "
            >
              <CheckCircle2
                className="
                  h-4
                  w-4
                  text-green-600
                "
              />

              <span
                className="
                  text-xs
                  font-medium
                  text-green-700
                "
              >
                Schedule Optimized
              </span>
            </div>
          </div>

          {/* Faculty */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                "
              >
                <GraduationCap
                  className="
                    h-5
                    w-5
                    text-blue-700
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Faculty
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  24
                </h3>
              </div>
            </div>

            <p
              className="
                mt-4
                text-xs
                text-slate-500
              "
            >
              Faculty Assigned
            </p>
          </div>

          {/* Rooms */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-100
                "
              >
                <Building2
                  className="
                    h-5
                    w-5
                    text-violet-700
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Rooms
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  18
                </h3>
              </div>
            </div>

            <p
              className="
                mt-4
                text-xs
                text-slate-500
              "
            >
              Rooms Assigned
            </p>
          </div>

          {/* Conflicts */}
          <div
            className="
              rounded-2xl
              border
              border-amber-200
              bg-amber-50
              p-5
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-amber-100
                "
              >
                <AlertTriangle
                  className="
                    h-5
                    w-5
                    text-amber-600
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-amber-700
                  "
                >
                  Conflicts
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  2
                </h3>
              </div>
            </div>

            <p
              className="
                mt-4
                text-xs
                text-amber-700
              "
            >
              Requires Review
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}