/* =========================================================
   ROUTER CONSTANTS

   Source Of Truth For:
   - App Router Paths
   - Navigation
   - Breadcrumbs
   - Future Route Guards

   Must stay synchronized with:
   navigation.ts
   app/(auth)
   app/(dashboard)
   ========================================================= */

export const ROUTES = {
  /* -------------------------------- */
  /* Root                             */
  /* -------------------------------- */

  HOME: "/",

  /* -------------------------------- */
  /* Auth                             */
  /* -------------------------------- */

  LOGIN: "/login",

  FORGOT_PASSWORD:
    "/forgot-password",

  /* -------------------------------- */
  /* Dashboard                        */
  /* -------------------------------- */

  DASHBOARD: "/dashboard",

  TIMETABLE_BUILDER:
    "/timetable-builder",

  FACULTY: "/faculty",

  ROOMS: "/rooms",

  ANALYTICS: "/analytics",

  PREVIEW: "/preview",

  SETTINGS: "/settings",
} as const;

/* =========================================================
   AUTH ROUTES
   ========================================================= */

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
] as const;

/* =========================================================
   DASHBOARD ROUTES
   ========================================================= */

export const DASHBOARD_ROUTES = [
  ROUTES.DASHBOARD,

  ROUTES.TIMETABLE_BUILDER,

  ROUTES.FACULTY,

  ROUTES.ROOMS,

  ROUTES.ANALYTICS,

  ROUTES.PREVIEW,

  ROUTES.SETTINGS,
] as const;

/* =========================================================
   PUBLIC ROUTES
   ========================================================= */

export const PUBLIC_ROUTES = [
  ROUTES.HOME,

  ROUTES.LOGIN,

  ROUTES.FORGOT_PASSWORD,
] as const;

/* =========================================================
   DEFAULT REDIRECTS
   ========================================================= */

export const DEFAULT_ROUTES = {
  afterLogin:
    ROUTES.DASHBOARD,

  dashboard:
    ROUTES.TIMETABLE_BUILDER,
} as const;

/* =========================================================
   ROUTE LABELS
   ========================================================= */

export const ROUTE_LABELS = {
  [ROUTES.DASHBOARD]:
    "Dashboard",

  [ROUTES.TIMETABLE_BUILDER]:
    "Timetable Builder",

  [ROUTES.FACULTY]:
    "Faculty",

  [ROUTES.ROOMS]:
    "Rooms",

  [ROUTES.ANALYTICS]:
    "Analytics",

  [ROUTES.PREVIEW]:
    "Preview",

  [ROUTES.SETTINGS]:
    "Settings",

  [ROUTES.LOGIN]:
    "Login",

  [ROUTES.FORGOT_PASSWORD]:
    "Forgot Password",
} as const;