"use client";

import { Bell, CalendarDays, AlertTriangle, CheckCircle2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notifications = [
  {
    id: 1,
    title: "Schedule Published",
    description: "Semester V timetable was published successfully.",
    icon: CheckCircle2,
    color: "text-green-600",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Conflict Detected",
    description: "Faculty overlap found in Section CSE V-A.",
    icon: AlertTriangle,
    color: "text-amber-500",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "Semester Updated",
    description: "Odd Semester 2024-25 settings were modified.",
    icon: CalendarDays,
    color: "text-blue-600",
    time: "1 hr ago",
  },
];

export default function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            transition-all
            hover:bg-slate-50
            hover:border-slate-300
          "
        >
          <Bell className="h-4 w-4 text-slate-700" />

          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-red-500
            "
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-[380px]
          rounded-2xl
          border-slate-200
          p-0
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Notifications
            </h3>

            <span
              className="
                rounded-full
                bg-blue-50
                px-2.5
                py-1
                text-[11px]
                font-medium
                text-blue-700
              "
            >
              3 New
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="
                  cursor-pointer
                  border-b
                  border-slate-100
                  px-5
                  py-4
                  transition-colors
                  hover:bg-slate-50
                "
              >
                <div className="flex gap-3">
                  <div
                    className="
                      mt-0.5
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-100
                    "
                  >
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </h4>

                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {/* Footer */}
        <div className="p-3">
          <button
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              py-2.5
              text-sm
              font-medium
              text-slate-700
              transition-all
              hover:bg-slate-50
            "
          >
            View All Notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}