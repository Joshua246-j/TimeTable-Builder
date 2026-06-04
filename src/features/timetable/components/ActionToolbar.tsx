"use client";

import {
  AlertTriangle,
  Eye,
  Rocket,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ActionToolbar() {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* Header */}
      <div className="mb-5">
        <h2
          className="
            text-base
            font-semibold
            text-slate-900
          "
        >
          Timetable Actions
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Manage scheduling, validation and
          publishing workflows.
        </p>
      </div>

      {/* Desktop */}
      <div
        className="
          hidden
          lg:grid
          lg:grid-cols-4
          gap-4
        "
      >
        {/* Auto Allocate */}
        <button
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            text-left
            transition-all
            hover:border-blue-200
            hover:bg-blue-50
          "
        >
          <div
            className="
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-100
            "
          >
            <WandSparkles
              className="
                h-5
                w-5
                text-blue-700
              "
            />
          </div>

          <h3
            className="
              text-sm
              font-semibold
              text-slate-900
            "
          >
            Auto Allocate
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
            "
          >
            Generate schedule automatically
            using available resources.
          </p>
        </button>

        {/* Conflict Detection */}
        <button
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            text-left
            transition-all
            hover:border-amber-200
            hover:bg-amber-50
          "
        >
          <div
            className="
              mb-4
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

          <h3
            className="
              text-sm
              font-semibold
              text-slate-900
            "
          >
            Detect Conflicts
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
            "
          >
            Check faculty, room and schedule
            conflicts instantly.
          </p>
        </button>

        {/* Preview */}
        <button
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            text-left
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
          "
        >
          <div
            className="
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-slate-100
            "
          >
            <Eye
              className="
                h-5
                w-5
                text-slate-700
              "
            />
          </div>

          <h3
            className="
              text-sm
              font-semibold
              text-slate-900
            "
          >
            Preview
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
            "
          >
            Review timetable before final
            publication.
          </p>
        </button>

        {/* Publish */}
        <button
          className="
            group
            rounded-2xl
            border
            border-blue-200
            bg-blue-50
            p-5
            text-left
            transition-all
            hover:bg-blue-100
          "
        >
          <div
            className="
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-600
            "
          >
            <Rocket
              className="
                h-5
                w-5
                text-white
              "
            />
          </div>

          <h3
            className="
              text-sm
              font-semibold
              text-slate-900
            "
          >
            Publish
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
            "
          >
            Publish the finalized timetable
            for students and faculty.
          </p>
        </button>
      </div>

      {/* Mobile */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          lg:hidden
        "
      >
        <Button
          variant="outline"
          className="h-12 justify-start gap-2"
        >
          <WandSparkles className="h-4 w-4" />
          Auto Allocate
        </Button>

        <Button
          variant="outline"
          className="h-12 justify-start gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Conflicts
        </Button>

        <Button
          variant="outline"
          className="h-12 justify-start gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>

        <Button
          className="
            h-12
            justify-start
            gap-2
            bg-blue-700
            hover:bg-blue-800
          "
        >
          <Rocket className="h-4 w-4" />
          Publish
        </Button>
      </div>
    </section>
  );
}