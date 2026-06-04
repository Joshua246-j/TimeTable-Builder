"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Building2,
  BarChart3,
  Eye,
  Settings,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/cn";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Timetable Builder",
    href: "/timetable-builder",
    icon: CalendarDays,
  },
  {
    title: "Faculty",
    href: "/faculty",
    icon: GraduationCap,
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: Building2,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Preview",
    href: "/preview",
    icon: Eye,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden
        xl:flex
        h-screen
        w-[280px]
        shrink-0
        flex-col
        border-r
        border-slate-200
        bg-white
      "
    >
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-[#102F82]
              text-white
              shadow-md
            "
          >
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Timetable Creation
            </h2>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              B.Tech CSE • Semester V
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-4 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
        </div>

        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  `
                  group
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-3
                  py-3
                  transition-all
                  duration-200
                `,
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      `
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                    `,
                      active
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium">
                    {item.title}
                  </span>
                </div>

                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-all",
                    active
                      ? "translate-x-0 text-blue-600"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#102F82]
                text-sm
                font-semibold
                text-white
              "
            >
              AK
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Admin User
              </p>

              <p className="text-xs text-slate-500">
                Academic Coordinator
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}