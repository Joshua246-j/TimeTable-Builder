"use client";

import {
  Eye,
  Rocket,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ActionToolbar() {
  return (
    <div
      className="
        flex
        w-full
        overflow-x-auto
        snap-x
        gap-3
        py-2
        no-scrollbar
        lg:flex-row
        lg:items-center
        lg:justify-between
        lg:overflow-visible
        lg:py-0
      "
    >
      {/* LEFT ACTIONS (Scrollable on Mobile) */}
      <div
        className="
          flex
          flex-nowrap
          gap-3
          lg:flex-wrap
        "
      >
        {/* Auto Allocate */}
        <button
          className="
            flex
            flex-1
            shrink-0
            snap-start
            items-center
            gap-3
            rounded-2xl
            bg-white
            px-4
            py-4
            text-left
            transition-all
            hover:bg-[#F8FAFF]
            lg:w-auto
            lg:flex-none
            lg:min-w-[220px]
            lg:border
            lg:border-[#E5E7EB]
            lg:hover:border-[#4F6BFF]
          "
          style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)" }}
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[#F0F4FF]
              lg:h-10
              lg:w-10
              lg:rounded-lg
            "
          >
            <Sparkles
              className="
                h-4
                w-4
                text-[#4F6BFF]
                lg:h-5
                lg:w-5
              "
            />
          </div>

          <div>
            <h3
              className="
                text-xs
                font-bold
                text-[#0D2463]
                lg:text-sm
              "
            >
              Auto Allocate
            </h3>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-500
                lg:text-xs
              "
            >
              Resources
            </p>
          </div>
        </button>

        {/* Conflict Detection */}
        <button
          className="
            flex
            flex-1
            shrink-0
            snap-start
            items-center
            gap-3
            rounded-2xl
            bg-white
            px-4
            py-4
            text-left
            transition-all
            hover:bg-slate-50
            lg:w-auto
            lg:flex-none
            lg:min-w-[220px]
            lg:border
            lg:border-[#E5E7EB]
            lg:hover:border-orange-300
            lg:hover:bg-orange-50
          "
          style={{ boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)" }}
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white
              border
              border-slate-200
              lg:h-10
              lg:w-10
              lg:rounded-lg
              lg:bg-orange-100
              lg:border-none
            "
          >
            <TriangleAlert
              className="
                h-4
                w-4
                text-[#0D2463]
                lg:h-5
                lg:w-5
                lg:text-orange-500
              "
            />
          </div>

          <div>
            <h3
              className="
                text-xs
                font-bold
                text-[#0D2463]
                lg:text-sm
              "
            >
              Conflicts
            </h3>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-500
                lg:text-xs
              "
            >
              0 Critical
            </p>
          </div>
        </button>

        {/* Publish Timetable (Mobile Card version) */}
        <button
          className="
            flex
            w-[200px]
            shrink-0
            snap-start
            items-start
            gap-3
            rounded-xl
            border
            border-[#0D2463]
            bg-[#0D2463]
            px-4
            py-3
            text-left
            transition-all
            hover:bg-[#091A4A]
            lg:hidden
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              bg-white/10
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

          <div>
            <h3
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Publish
            </h3>

            <p
              className="
                mt-1
                text-[10px]
                text-blue-200
              "
            >
              Make it live
            </p>
          </div>
        </button>
      </div>

      {/* RIGHT ACTIONS (Desktop Only) */}
      <div
        className="
          hidden
          items-center
          gap-3
          self-end
          lg:flex
        "
      >
        {/* Preview */}
        <Button
          variant="outline"
          className="
            h-10
            rounded-lg
            border-[#E5E7EB]
            px-5
          "
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>

        {/* Publish */}
        <Button
          className="
            h-10
            rounded-lg
            bg-[#0D2463]
            px-5
            text-white
            hover:bg-[#091A4A]
          "
        >
          <Rocket className="mr-2 h-4 w-4" />
          Publish Timetable
        </Button>
      </div>
    </div>
  );
}