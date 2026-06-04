import { create } from "zustand";

export type ThemeMode = "light" | "dark";

interface UIState {
  sidebarOpen: boolean;
  mobileDrawerOpen: boolean;
  activeTheme: ThemeMode;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;

  setTheme: (theme: ThemeMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  /* -------------------------------- */
  /* Initial State                    */
  /* -------------------------------- */

  sidebarOpen: true,

  mobileDrawerOpen: false,

  activeTheme: "light",

  /* -------------------------------- */
  /* Sidebar Actions                  */
  /* -------------------------------- */

  openSidebar: () =>
    set({
      sidebarOpen: true,
    }),

  closeSidebar: () =>
    set({
      sidebarOpen: false,
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  /* -------------------------------- */
  /* Mobile Drawer Actions            */
  /* -------------------------------- */

  openMobileDrawer: () =>
    set({
      mobileDrawerOpen: true,
    }),

  closeMobileDrawer: () =>
    set({
      mobileDrawerOpen: false,
    }),

  toggleMobileDrawer: () =>
    set((state) => ({
      mobileDrawerOpen: !state.mobileDrawerOpen,
    })),

  /* -------------------------------- */
  /* Theme Actions                    */
  /* -------------------------------- */

  setTheme: (theme) =>
    set({
      activeTheme: theme,
    }),
}));