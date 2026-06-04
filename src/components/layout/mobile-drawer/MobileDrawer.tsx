"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Building2,
  BarChart3,
  Eye,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/cn";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export default function MobileDrawer() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-700
            transition-all
            hover:bg-slate-50
            lg:hidden
          "
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="
          w-[300px]
          border-slate-200
          p-0
        "
      >
        {/* Header */}
        <div
          className="
            border-b
            border-slate-200
            px-5
            py-5
          "
        >
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
              "
            >
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Timetable Creation
              </h2>

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                B.Tech CSE • Semester V
              </p>
            </div>
          </div>
        </div>

        {/* User */}
        <div
          className="
            border-b
            border-slate-200
            px-5
            py-4
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
                Academic Coordinator
              </p>

              <p className="text-xs text-slate-500">
                admin@timetable.com
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <div className="mb-3 px-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </p>
          </div>

          <nav className="space-y-2">
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
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    transition-all
                  `,
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      `
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                    `,
                      active
                        ? "bg-blue-100"
                        : "bg-slate-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4">
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
            "
          >
            <p className="text-xs text-slate-500">
              Current Semester
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              Odd Semester 2024-25
            </p>

            <div className="mt-3">
              <span
                className="
                  rounded-full
                  bg-blue-100
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-blue-700
                "
              >
                CSE Department
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}