TimeTable-Builder: Complete Project Audit & Architecture
========================================================

Here is the full breakdown of our project. It covers our entire tech stack and architecture. Every dependency is listed here.

The Core Architecture
---------------------
We built this as a modern React web app. It is designed for speed, type safety, and scalability.

* Framework: Next.js (16.2.7)
  We use the App Router and Server Components to keep the initial load fast.

* UI Library: React (19.2.4)
  Handles all interactive interfaces and hook-based logic.

* Language: TypeScript (^5.x)
  The entire codebase is strictly typed, avoiding the use of `any`. This prevents runtime crashes and ensures deep type safety.

Styling Architecture
--------------------
Our styling approach is utility-first, focusing on modern aesthetics and clean design.

* Tailwind CSS (^4.x)
  This is our core styling engine, processed by PostCSS.

* Theme Management: next-themes (^0.4.6)
  Handles the switch between light and dark modes instantly.

* Animations: tw-animate-css (^1.4.0)
  Provides clean, native Tailwind animations.

UI Component Libraries
----------------------
* Shadcn UI (^4.10.0)
  Our primary UI kit, relying on CSS variables and radix-nova design style.
* Radix UI Primitives (^1.4.3)
  Guarantees everything is fully accessible.
* Lucide React (^1.17.0)
  Provides clean, consistent icons across the whole app.

State Management Architecture
-----------------------------
We centralize our state to avoid prop-drilling and maintain a single source of truth.

* Global State: Redux Toolkit (^2.12.0) & React-Redux (^9.3.0)
  We use Redux for all major domain logic. Our store is divided into highly specific slices:
  - `timetableEngineSlice`: Core math and allocations.
  - `timetableDraftSlice`: Versioning and persistence.
  - `subjectSlice`: Data inventory.
  - `validationSlice`: Collision and error detection.

Forms and Data Validation
-------------------------
* State Manager: React Hook Form (^7.77.0)
  Tracks input changes quickly without lag.
* Schema Validator: Zod (^4.4.3)
  Defines the exact shape of our data.
* The Bridge: Hookform Resolvers (^5.4.0)
  Connects Zod rules directly to our React Hook Forms.

The Timetable Engine (Drag & Drop)
----------------------------------
Our timetable UI is highly interactive and relies on custom physics and custom hooks.

* Physics Engine: @dnd-kit/core (^6.3.1)
  Handles raw drag events and physics.
* Lists & Grids: @dnd-kit/sortable (^10.0.0)
  Built specifically for reordering lists.
* Constraints: @dnd-kit/modifiers & utilities
  Snaps dragged items to grid layouts perfectly.

Helper Utilities
----------------
* Dates: date-fns (^4.4.0)
  Parses and formats schedule times.
* Classes: clsx & tailwind-merge
  Merges conditional Tailwind classes without breaking styles.
* Component Variants: class-variance-authority (CVA)
  Used by Shadcn to manage component variations cleanly.
* Notifications: Sonner (^2.0.7)
  Powers toast notifications across the UI.

Code Quality and Tooling
------------------------
We enforce clean code automatically before it ever gets committed.

* Linter: ESLint (^9.x) & eslint-config-next
  Catches syntax errors and enforces best practices.
* Formatter: Prettier (^3.8.3)
  Auto-formats code.
* Git Hooks: Husky (^9.1.7) & lint-staged (^16.4.0)
  Runs linting automatically upon commit.
