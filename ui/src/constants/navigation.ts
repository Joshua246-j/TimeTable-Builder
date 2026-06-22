/* =========================================================
   NAVIGATION CONSTANTS

   Used By:
   - Sidebar
   - MobileDrawer
   - Topbar
   - Breadcrumbs
   - Router Guards (Future)

   Must stay synchronized with:
   src/constants/router.ts
   ========================================================= */

import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Building2,
  BarChart3,
  Eye,
  Settings,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
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
] as const;

/* =========================================================
   TOPBAR NAVIGATION
   ========================================================= */

export const TOPBAR_NAVIGATION = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },

  {
    title: "Faculty",
    href: "/faculty",
  },

  {
    title: "Rooms",
    href: "/rooms",
  },

  {
    title: "Analytics",
    href: "/analytics",
  },
] as const;

/* =========================================================
   BREADCRUMB LABELS
   ========================================================= */

export const BREADCRUMB_LABELS: Record<
  string,
  string
> = {
  dashboard: "Dashboard",

  "timetable-builder":
    "Timetable Builder",

  faculty: "Faculty",

  rooms: "Rooms",

  analytics: "Analytics",

  preview: "Preview",

  settings: "Settings",
};

/* =========================================================
   USER MENU
   ========================================================= */

export const USER_MENU_ITEMS = [
  {
    label: "Profile",
    href: "/settings",
  },

  {
    label: "Settings",
    href: "/settings",
  },

  {
    label: "Sign Out",
    href: "#",
    danger: true,
  },
] as const;