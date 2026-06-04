"use client";

import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            flex
            items-center
            gap-2
            rounded-full
            transition-all
            hover:opacity-90
            focus:outline-none
          "
        >
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarFallback
              className="
                bg-[#102F82]
                text-xs
                font-semibold
                text-white
              "
            >
              AK
            </AvatarFallback>
          </Avatar>

          <ChevronDown
            className="
              hidden
              h-4
              w-4
              text-slate-500
              lg:block
            "
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-64
          rounded-2xl
          border-slate-200
          p-2
        "
      >
        <div className="px-3 py-3">
          <p className="text-sm font-semibold text-slate-900">
            Academic Coordinator
          </p>

          <p className="mt-1 text-xs text-slate-500">
            admin@timetable.com
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer rounded-xl">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer rounded-xl">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="
            cursor-pointer
            rounded-xl
            text-red-600
            focus:text-red-600
          "
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}