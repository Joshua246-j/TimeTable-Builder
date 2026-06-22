/* =========================================================
   COLOR CONSTANTS

   Source Of Truth:
   - tokens.css
   - variables.css

   Used By:
   - Sidebar
   - Topbar
   - StatusPanel
   - ResourcePanel
   - SubjectCard
   - TimetableGrid
   ========================================================= */

export const COLORS = {
  /* -------------------------------- */
  /* Brand                            */
  /* -------------------------------- */

  primary: {
    50: "#EEF4FF",
    100: "#DBE8FF",
    200: "#BFD4FF",
    300: "#92B4FF",
    400: "#5E8CFF",
    500: "#1F4FD6",
    600: "#153FAE",
    700: "#102F82",
    800: "#0B235F",
    900: "#07163D",
  },

  /* -------------------------------- */
  /* Neutral                          */
  /* -------------------------------- */

  slate: {
    25: "#FCFCFD",
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  /* -------------------------------- */
  /* Success                          */
  /* -------------------------------- */

  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    500: "#22C55E",
    600: "#16A34A",
  },

  /* -------------------------------- */
  /* Warning                          */
  /* -------------------------------- */

  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    500: "#F59E0B",
    600: "#D97706",
  },

  /* -------------------------------- */
  /* Danger                           */
  /* -------------------------------- */

  danger: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    500: "#EF4444",
    600: "#DC2626",
  },

  /* -------------------------------- */
  /* Info                             */
  /* -------------------------------- */

  info: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    500: "#3B82F6",
  },
} as const;

/* =========================================================
   SUBJECT TYPE COLORS
   ========================================================= */

export const SUBJECT_COLORS = {
  theory: {
    background: "#EFF6FF",
    border: "#BFDBFE",
    text: "#2563EB",
    badge: "#3B82F6",
  },

  lab: {
    background: "#F0FDF4",
    border: "#BBF7D0",
    text: "#16A34A",
    badge: "#22C55E",
  },

  tutorial: {
    background: "#FAF5FF",
    border: "#E9D5FF",
    text: "#9333EA",
    badge: "#A855F7",
  },

  elective: {
    background: "#FFFBEB",
    border: "#FDE68A",
    text: "#D97706",
    badge: "#F59E0B",
  },
} as const;

/* =========================================================
   STATUS COLORS
   ========================================================= */

export const STATUS_COLORS = {
  success: {
    background: "#F0FDF4",
    border: "#22C55E",
    text: "#166534",
  },

  warning: {
    background: "#FFFBEB",
    border: "#F59E0B",
    text: "#92400E",
  },

  danger: {
    background: "#FEF2F2",
    border: "#EF4444",
    text: "#B91C1C",
  },

  info: {
    background: "#EFF6FF",
    border: "#3B82F6",
    text: "#1D4ED8",
  },
} as const;

/* =========================================================
   LAYOUT COLORS
   ========================================================= */

export const LAYOUT_COLORS = {
  sidebar: {
    background: "#FFFFFF",
    border: "#E2E8F0",
    itemHover: "#F8FAFC",
    itemActive: "#EEF4FF",
    itemActiveText: "#153FAE",
  },

  topbar: {
    background: "#FFFFFF",
    border: "#E2E8F0",
  },

  content: {
    background: "#F8FAFC",
  },

  card: {
    background: "#FFFFFF",
    border: "#E2E8F0",
  },
} as const;