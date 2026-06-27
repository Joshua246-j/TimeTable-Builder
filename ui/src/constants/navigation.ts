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
  LucideIcon,
  Users
} from "lucide-react";

export type UserRole = "ADMIN" | "ORG_ADMIN" | "DEPT_ADMIN" | "TEACHER" | "FACULTY" | "STUDENT" | "HOD";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "ORG_ADMIN", "DEPT_ADMIN", "TEACHER", "FACULTY", "STUDENT", "HOD"]
  },

  {
    title: "Timetable",
    href: "/timetable",
    icon: CalendarDays,
    roles: ["ADMIN", "ORG_ADMIN", "DEPT_ADMIN", "TEACHER", "HOD"]
  },

  {
    title: "Faculty",
    href: "/faculty",
    icon: GraduationCap,
    roles: ["ADMIN", "ORG_ADMIN", "DEPT_ADMIN", "HOD"]
  },

  {
    title: "Rooms",
    href: "/rooms",
    icon: Building2,
    roles: ["ADMIN", "ORG_ADMIN", "DEPT_ADMIN", "HOD"]
  },
  
  {
    title: "Attendance",
    href: "/attendance",
    icon: Users,
    roles: ["TEACHER", "FACULTY", "STUDENT", "HOD"]
  },

  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["ADMIN", "ORG_ADMIN", "DEPT_ADMIN", "HOD"]
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN", "ORG_ADMIN", "DEPT_ADMIN", "TEACHER", "FACULTY", "STUDENT", "HOD"]
  },
];

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

  timetable: "Timetable",
  "timetable/builder": "Timetable Builder",

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