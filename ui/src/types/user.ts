/* =========================================================
   USER TYPES
   Used By:
   - Topbar
   - UserMenu
   - NotificationMenu
   - Dashboard Layout

   Frontend Only
   ========================================================= */

export type UserRole =
  | "admin"
  | "coordinator"
  | "faculty";

export interface User {
  id: string;

  name: string;

  email: string;

  avatar?: string;

  role: UserRole;

  department: string;
}

export interface UserProfile {
  id: string;

  name: string;

  email: string;

  avatar?: string;

  role: UserRole;

  department: string;

  designation?: string;
}

export interface UserMenuItem {
  id: string;

  label: string;

  href?: string;

  icon?: string;

  danger?: boolean;
}

export interface Notification {
  id: string;

  title: string;

  description: string;

  createdAt: string;

  isRead: boolean;

  type:
    | "info"
    | "success"
    | "warning"
    | "error";
}

export interface NotificationState {
  notifications: Notification[];

  unreadCount: number;
}