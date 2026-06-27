"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS, UserRole } from "@/constants/navigation";
import { LogOut, ChevronLeft, LayoutGrid, Bell, Settings, GraduationCap, Menu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SideNavbarProps {
  currentRole?: UserRole;
}

export default function SideNavbar({ currentRole = "TEACHER" }: SideNavbarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter items based on the user's current role
  const visibleItems = NAVIGATION_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <aside 
      className={`relative flex flex-col h-full bg-white border-r border-[#E5E7EB] shrink-0 font-inter transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] z-50 ${isCollapsed ? "w-[72px]" : "w-[240px]"}`}
    >
      {/* Absolute Toggle Button on the Edge */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-8 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 shadow-sm hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-300 z-50 focus:outline-none"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft className={`h-4 w-4 transition-transform duration-500 ease-in-out ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Top section: Logo */}
      <div className={`flex shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'flex-col items-center pt-5 pb-3' : 'h-[80px] items-center px-5 mt-2'}`}>
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
          {/* Logo Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#4F46E5] text-white shadow-sm transition-all duration-300">
            <GraduationCap className="h-5 w-5" />
          </div>
          
          {/* Logo Text */}
          <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"}`}>
            <h1 className="text-[18px] font-[800] text-[#1E293B] tracking-tight leading-none mb-0.5">
              IIS
            </h1>
            <div className="text-[11px] font-[600] text-[#64748B] tracking-wider truncate">
              Amal Jyothi
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex flex-col flex-1 py-4 px-3 overflow-y-auto scrollbar-none">
        <nav className="flex flex-col gap-1.5 flex-1">
          <TooltipProvider delayDuration={0}>
            {visibleItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              const linkContent = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-xl text-[13px] font-[600] transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${
                      isActive
                        ? "bg-blue-50/80 text-blue-700 shadow-sm ring-1 ring-blue-100/50"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
                    ${isCollapsed ? "justify-center px-0 w-11 h-11 mx-auto" : "px-3 py-3 w-full"}
                  `}
                >
                  <Icon
                    className={`shrink-0 w-[18px] h-[18px] transition-all duration-300 ease-in-out ${
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"}`}>
                    {item.title}
                  </span>
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-semibold text-xs py-1.5 px-3 bg-slate-800 text-white border-slate-700" sideOffset={16}>
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}
          </TooltipProvider>
        </nav>
      </div>

      {/* Bottom section: Profile */}
      <div className={`mt-auto shrink-0 flex flex-col gap-1 border-t border-slate-100 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? 'px-2 py-4' : 'px-4 py-5'}`}>
        <div className={`flex flex-col gap-1 mb-4 ${isCollapsed ? "items-center" : ""}`}>
          <button className={`flex items-center gap-3 rounded-xl text-[13px] font-[600] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isCollapsed ? "justify-center w-11 h-11" : "px-3 py-2.5 w-full"}`}>
            <Settings className="w-[18px] h-[18px] shrink-0 text-slate-400" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"}`}>
              Settings
            </span>
          </button>
          <button className={`flex items-center gap-3 rounded-xl text-[13px] font-[600] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isCollapsed ? "justify-center w-11 h-11" : "px-3 py-2.5 w-full"}`}>
            <LogOut className="w-[18px] h-[18px] shrink-0 text-slate-400" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"}`}>
              Activity Logs
            </span>
          </button>
        </div>

        <button className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isCollapsed ? "justify-center w-full" : "px-2 py-2 w-full hover:bg-slate-50"}`}>
          <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 text-sm font-bold text-white shadow-sm ring-2 ring-white ${isCollapsed ? "mx-auto" : ""}`}>
            T
          </div>
          <div className={`flex flex-col items-start whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"}`}>
            <span className="text-[13px] font-[700] text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">Teacher</span>
            <span className="text-[11px] font-[500] text-slate-500 mt-0.5">Faculty Member</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
