"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS, UserRole } from "@/constants/navigation";
import { LogOut, ChevronLeft, Settings, GraduationCap } from "lucide-react";
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
      className={`relative flex flex-col h-full bg-[#FAFAFA] border-r border-[#E5E7EB] shrink-0 font-inter transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] z-50 ${isCollapsed ? "w-[64px]" : "w-[220px]"}`}
    >
      {/* Edge-Attached Toggle Button with Large Hit Area */}
      <div 
        className="absolute -right-3 top-6 w-6 h-12 flex items-center justify-center z-50 group cursor-pointer" 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} 
        role="button" 
        tabIndex={0} 
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsCollapsed(!isCollapsed); }}
      >
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.05)] group-hover:text-slate-800 group-hover:border-slate-300 group-hover:shadow-sm transition-all duration-200 ring-offset-1 focus-within:ring-2 focus-within:ring-slate-300">
          <div className="absolute -inset-3" />
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-300 ease-in-out ${isCollapsed ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Top section: Logo & Branding */}
      <div className={`flex shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'flex-col items-center pt-5 pb-4' : 'h-14 items-center px-4 mt-2'}`}>
        <div className={`flex items-center gap-3 overflow-hidden w-full ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white shadow-sm transition-all duration-300">
            <GraduationCap className="h-4 w-4" />
          </div>
          
          <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 w-0" : "opacity-100 flex-1"}`}>
            <h1 className="text-[14px] font-[700] text-[#111827] tracking-tight leading-none mb-0.5">
              IIS
            </h1>
            <div className="text-[11px] font-[500] text-slate-500 tracking-wide truncate leading-none">
              Amal Jyothi
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex flex-col flex-1 py-3 px-3 overflow-y-auto scrollbar-none border-t border-transparent">
        <nav className="flex flex-col gap-0.5 flex-1">
          <TooltipProvider delayDuration={150}>
            {visibleItems.map((item) => {
              const isActive = item.href === '/dashboard' 
                ? pathname === '/dashboard' 
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              const linkContent = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center rounded-md text-[13px] font-[500] transition-all duration-150 ease-out group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
                    ${
                      isActive
                        ? "bg-slate-200/50 text-slate-900 font-[600]"
                        : "text-slate-600 hover:bg-slate-200/30 hover:text-slate-900"
                    }
                    ${isCollapsed ? "justify-center w-[40px] h-[40px] mx-auto" : "gap-2.5 px-3 py-2 w-full"}
                  `}
                >
                  <Icon
                    className={`shrink-0 w-[16px] h-[16px] transition-colors duration-150 ${
                      isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 w-0 max-w-0" : "opacity-100 flex-1"}`}>
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
                    <TooltipContent side="right" className="font-medium text-xs py-1.5 px-2.5 bg-slate-800 text-white border-slate-700 shadow-md rounded-md" sideOffset={14}>
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

      {/* Secondary Actions: Settings & Logs */}
      <div className={`shrink-0 flex flex-col gap-0.5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] px-3 py-2`}>
        <TooltipProvider delayDuration={150}>
          {[
            { title: "Settings", icon: Settings, href: "/settings" },
            { title: "Activity Logs", icon: LogOut, href: "#" }
          ].map((item, idx) => {
            const Icon = item.icon;
            const linkContent = (
              <button key={idx} className={`flex items-center rounded-md text-[13px] font-[500] text-slate-600 hover:bg-slate-200/30 hover:text-slate-900 transition-all duration-150 ease-out group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${isCollapsed ? "justify-center w-[40px] h-[40px] mx-auto" : "gap-2.5 px-3 py-2 w-full"}`}>
                <Icon className="w-[16px] h-[16px] shrink-0 text-slate-400 group-hover:text-slate-700 transition-colors" />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 w-0 max-w-0" : "opacity-100 flex-1 text-left"}`}>
                  {item.title}
                </span>
              </button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium text-xs py-1.5 px-2.5 bg-slate-800 text-white border-slate-700 shadow-md rounded-md" sideOffset={14}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return linkContent;
          })}
        </TooltipProvider>
      </div>

      {/* User Profile */}
      <div className={`mt-auto shrink-0 flex flex-col border-t border-slate-200/60 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? 'p-2' : 'p-3'}`}>
        <button className={`flex items-center gap-2.5 rounded-md transition-all duration-150 ease-out group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${isCollapsed ? "justify-center w-[44px] h-[44px] mx-auto" : "px-2.5 py-2 w-full hover:bg-slate-200/30"}`}>
          <div className={`flex shrink-0 h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-900 to-slate-800 text-[10px] font-bold text-white shadow-sm ring-1 ring-slate-900/5 ${isCollapsed ? "mx-auto h-7 w-7 text-[11px]" : ""}`}>
            T
          </div>
          <div className={`flex flex-col items-start whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? "opacity-0 w-0 max-w-0" : "opacity-100"}`}>
            <span className="text-[13px] font-[600] text-slate-900 group-hover:text-slate-900 transition-colors leading-none mb-1">Teacher</span>
            <span className="text-[11px] font-[400] text-slate-500 leading-none">Faculty Member</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
