"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS, UserRole } from "@/constants/navigation";
import { ChevronLeft, Settings, GraduationCap } from "lucide-react";
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
      className={`relative flex flex-col h-full bg-white border-r border-[#E5E7EB] shrink-0 font-inter transition-[width] duration-300 ease-in-out z-50 ${isCollapsed ? "w-[80px]" : "w-[240px]"}`}
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
      <div className="flex shrink-0 h-24 items-center overflow-hidden">
        <div className="flex items-center ml-[20px]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5A67D8] text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          
          <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-[width,opacity,margin] duration-300 ease-in-out ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-[140px] opacity-100 ml-3"}`}>
            <h1 className="text-[15px] font-[800] text-[#111827] tracking-tight leading-none mb-1">
              IIS
            </h1>
            <div className="text-[10px] font-[600] text-slate-500 tracking-wide truncate leading-tight">
              Amal Jyothi College of<br/>Engineering
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex flex-col flex-1 py-2 overflow-y-auto scrollbar-none border-t border-transparent px-4">
        <nav className="flex flex-col gap-1.5 flex-1">
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
                    flex items-center rounded-xl text-[13px] font-[700] transition-[width,padding,background-color,color] duration-300 ease-in-out overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 mx-auto
                    ${isActive ? "bg-[#5A67D8] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                    ${isCollapsed ? "w-[44px] px-[13px]" : "w-full px-4"}
                    py-3
                  `}
                >
                  <Icon
                    className={`shrink-0 w-[18px] h-[18px] transition-colors duration-150 ${
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  />
                  <div className={`overflow-hidden transition-[width,opacity,margin] duration-300 ease-in-out flex items-center ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto flex-1 opacity-100 ml-3.5"}`}>
                    <span className="whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
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

      {/* Secondary Actions: Settings & Profile */}
      <div className={`shrink-0 flex flex-col gap-1.5 px-4 py-4 mb-2`}>
        
        {/* Settings */}
        <Link href="/settings" className={`flex items-center rounded-xl text-[13px] font-[700] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-[width,padding] duration-300 ease-in-out overflow-hidden mx-auto focus:outline-none ${isCollapsed ? "w-[44px] px-[13px]" : "w-full px-4"} py-3`}>
          <Settings className="w-[18px] h-[18px] shrink-0 text-slate-500 group-hover:text-slate-700 transition-colors" />
          <div className={`overflow-hidden transition-[width,opacity,margin] duration-300 ease-in-out flex items-center ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto flex-1 opacity-100 ml-3.5"}`}>
            <span className="whitespace-nowrap">Settings</span>
          </div>
        </Link>
        
        {/* Profile */}
        <button className={`flex items-center rounded-xl text-[13px] font-[700] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-[width,padding] duration-300 ease-in-out overflow-hidden mx-auto focus:outline-none ${isCollapsed ? "w-[44px] px-[11px]" : "w-full px-3.5"} py-2.5`}>
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E0E7FF] text-[#5A67D8] font-bold text-[10px]">
            AK
          </div>
          <div className={`overflow-hidden transition-[width,opacity,margin] duration-300 ease-in-out flex items-center ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto flex-1 opacity-100 ml-3.5"}`}>
            <span className="whitespace-nowrap">Profile</span>
          </div>
        </button>

      </div>
    </aside>
  );
}
