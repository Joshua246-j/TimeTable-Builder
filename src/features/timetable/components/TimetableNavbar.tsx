"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Menu,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TimetableNavbar() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  
  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-[#E5E7EB]
        bg-white
      "
    >
      <div
        className="
          flex
          h-[60px]
          items-center
          justify-between
          px-4
          lg:px-6
        "
      >
        {/* LEFT */}
        <div
          className="
            flex
            items-center
            gap-3
            md:gap-8
          "
        >
          {/* Mobile Menu Icon */}
          <button className="md:hidden flex items-center justify-center text-slate-600 hover:text-slate-900 transition p-1 -ml-1">
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div
            className="
              flex
              items-center
              gap-2
              md:gap-3
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                md:h-9
                md:w-9
                items-center
                justify-center
                rounded-lg
                bg-[#0D2463]
                text-white
              "
            >
              <CalendarDays className="h-4 w-4 md:h-5 md:w-5" />
            </div>

            <div className="flex flex-col">
              <h1
                className="
                  text-[13px]
                  md:text-sm
                  font-semibold
                  text-slate-900
                  leading-tight
                "
              >
                Timetable Creation
              </h1>

              <p
                className="
                  hidden
                  md:block
                  text-[11px]
                  text-slate-500
                  leading-tight
                "
              >
                B.TECH CSE • SEMESTER V
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div
            className="
              hidden
              items-center
              rounded-full
              p-1
              bg-slate-100/50
              border border-slate-200/60
              md:flex
              relative
            "
          >
            {/* Animated sliding background pill */}
          <div
            className={`
              absolute
              h-[calc(100%-8px)]
              w-[100px]
              rounded-full
              bg-[#0D2463]
              shadow-sm
              transition-all
              duration-300
              ease-in-out
              ${isDashboard ? "left-1" : "left-[105px]"}
            `}
          />

          <Link
            href="/dashboard"
            className={`
              relative
              z-10
              flex
              w-[100px]
              items-center
              justify-center
              rounded-full
              py-1.5
              text-[13px]
              font-semibold
              transition-colors
              duration-300
              ${isDashboard ? "text-white" : "text-slate-500 hover:text-slate-900"}
            `}
          >
            Dashboard
          </Link>

          <Link
            href="/timetable-builder"
            className={`
              relative
              z-10
              flex
              w-[100px]
              items-center
              justify-center
              rounded-full
              py-1.5
              text-[13px]
              font-semibold
              transition-colors
              duration-300
              ${!isDashboard ? "text-white" : "text-slate-500 hover:text-slate-900"}
            `}
          >
            Timetable
          </Link>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="
          flex
          items-center
            gap-2
            md:gap-3
          "
        >
          {/* Semester */}
          <div className="hidden lg:block">
            <Select defaultValue="odd">
              <SelectTrigger
                className="
                  h-10
                  w-[160px]
                  border-[#E5E7EB]
                "
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="odd">
                  Odd Sem 2024-25
                </SelectItem>

                <SelectItem value="even">
                  Even Sem 2024-25
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="hidden lg:block">
            <Select defaultValue="cse">
              <SelectTrigger
                className="
                  h-10
                  w-[160px]
                  border-[#E5E7EB]
                "
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="cse">
                  CSE Department
                </SelectItem>

                <SelectItem value="ece">
                  ECE Department
                </SelectItem>

                <SelectItem value="me">
                  Mechanical
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification */}
          <button
            className="
              relative
              flex
              h-9
              w-9
              md:h-10
              md:w-10
              items-center
              justify-center
              rounded-lg
              md:border
              md:border-[#E5E7EB]
              bg-white
              transition
              hover:bg-slate-50
            "
          >
            <Bell className="h-5 w-5 md:h-4 md:w-4 text-slate-600" />
            <span className="absolute top-2 right-2 md:top-2 md:right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Avatar */}
          <Avatar
            className="
              h-8
              w-8
              md:h-10
              md:w-10
            "
          >
            <AvatarFallback
              className="
                bg-[#0D2463]
                text-xs
                md:text-sm
                font-semibold
                text-white
              "
            >
              AK
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}