"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/cn";
import NotificationMenu from "@/components/layout/notification-menu/NotificationMenu";
import UserMenu from "@/components/layout/user-menu/UserMenu";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Faculty",
    href: "/faculty",
  },
  {
    label: "Rooms",
    href: "/rooms",
  },
  {
    label: "Analytics",
    href: "/analytics",
  },
];

export default function Topbar() {
  const pathname = usePathname();

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-[76px]
        border-b
        border-slate-200
        bg-white/95
        backdrop-blur-md
      "
    >
      <div className="flex h-full items-center justify-between px-8">
        {/* Left */}
        <div className="flex items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#102F82]
                text-white
                shadow-sm
              "
            >
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                Timetable Creation
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                B.Tech CSE • Semester V
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              p-1
            "
          >
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    `
                    rounded-full
                    px-4
                    py-2
                    text-xs
                    font-medium
                    transition-all
                  `,
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Semester */}
          <button
            className="
              hidden
              lg:flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-xs
              font-medium
              text-slate-700
              transition-all
              hover:border-slate-300
            "
          >
            <CalendarDays className="h-4 w-4 text-blue-600" />

            <span>Odd Sem 2024-25</span>

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* Department */}
          <button
            className="
              hidden
              lg:flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-xs
              font-medium
              text-slate-700
              transition-all
              hover:border-slate-300
            "
          >
            <span>CSE Department</span>

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <div className="h-8 w-px bg-slate-200" />

          {/* Notifications */}
          <div className="hidden lg:block">
            <NotificationMenu />
          </div>

          {/* User */}
          <UserMenu />

          {/* Mobile Bell */}
          <button
            className="
              flex
              lg:hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
            "
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}