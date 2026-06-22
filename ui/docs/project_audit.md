TimeTable-Builder: Complete Project Audit & Architecture
========================================================

Hey team. Here is the full breakdown of our project. It covers our entire tech stack and architecture. Every dependency is listed here. Let's look at how it is built.

The Core Architecture
---------------------
We built this as a modern React web app. It is designed for speed, type safety, and scalability.

* Framework: Next.js (16.2.7)
  We use the App Router. It handles our page routing natively. We also use Server Components. This keeps the initial load fast.

* UI Library: React (19.2.4)
  We are on the latest major release. It handles all our interactive interfaces.

* Language: TypeScript (^5.x)
  The entire codebase is strictly typed. This prevents runtime crashes. It also makes refactoring much safer.

Styling Architecture
--------------------
Our styling approach is utility-first. We avoid writing custom CSS from scratch whenever possible.

* Tailwind CSS (^4.x)
  This is our core styling engine. We just upgraded to v4.

* PostCSS
  It processes our CSS alongside Tailwind (@tailwindcss/postcss).

* Theme Management: next-themes (^0.4.6)
  It handles the switch between light and dark modes instantly.

* Animations: tw-animate-css (^1.4.0)
  We use this for simple, native Tailwind animations.

UI Component Libraries
----------------------
We use two main component libraries for different needs.

Shadcn UI (^4.10.0)
This is our primary UI kit. We use it for standard buttons, inputs, and modals.
* Design Style:
  It uses the radix-nova design style.
* Theming:
  It relies on CSS variables for easy customization.
* Foundation: Radix UI Primitives (^1.4.3)
  This guarantees everything is accessible. We also use @radix-ui/react-switch directly.

Material UI (MUI)
We bring this in for heavy-lifting. Specifically, we use it for complex date picking.
* Core: @mui/material (^9.1.1)
  It gives us access to advanced Material components.
* Styling Engine: Emotion (@emotion/react & @emotion/styled)
  This is strictly required by MUI.
* Date Pickers: @mui/x-date-pickers (^9.5.0)
  We need these for the advanced scheduling interfaces in our timetable.

Icons
* Lucide React (^1.17.0)
  Provides clean, consistent icons across the whole app.

State Management Architecture
-----------------------------
We split our state management. We do not force everything into one tool.

* Global State: Redux Toolkit (^2.12.0) & React-Redux (^9.3.0)
  We use this for massive, app-wide data.

* Local State: Zustand (^5.0.14)
  This is a tiny, fast state manager. We use this for smaller UI states. Redux would be overkill here.

Forms and Data Validation
-------------------------
Timetable generation requires perfect data input. We treat form validation very seriously.

* State Manager: React Hook Form (^7.77.0)
  It tracks input changes super fast. It prevents laggy forms.

* Schema Validator: Zod (^4.4.3)
  We define the exact shape of our data here.

* The Bridge: Hookform Resolvers (^5.4.0)
  This connects Zod rules directly to our React Hook Forms.

The Timetable Engine (Drag & Drop)
----------------------------------
Our timetable UI is highly interactive. Dragging and dropping subjects is a core feature.

* Physics Engine: @dnd-kit/core (^6.3.1)
  It handles the raw drag events and physics.

* Lists & Grids: @dnd-kit/sortable (^10.0.0)
  This is built specifically for reordering lists.

* Constraints: @dnd-kit/modifiers & utilities
  We use these to snap dragged items to a grid perfectly.

Helper Utilities
----------------
Small packages that do one job perfectly.

* Dates: date-fns (^4.4.0)
  We use this to parse and format schedule times.

* Classes: clsx & tailwind-merge
  They merge conditional Tailwind classes without breaking styles.

* Component Variants: class-variance-authority (CVA)
  Shadcn uses this to manage button sizes and colors cleanly.

* Notifications: Sonner (^2.0.7)
  This powers our toast notifications in the corner of the screen.

Code Quality and Tooling
------------------------
We enforce clean code automatically before it ever gets committed.

* Linter: ESLint (^9.x) & eslint-config-next
  It yells at us if we write bad syntax.

* Formatter: Prettier (^3.8.3)
  It auto-formats our code.

* Tailwind Sorter: prettier-plugin-tailwindcss
  It keeps our utility classes in the exact same order.

* Git Hooks: Husky (^9.1.7) & lint-staged (^16.4.0)
  They run the linter and formatter automatically when we commit code.

* Types: @types/node, @types/react, @types/react-dom
  We include these so TypeScript understands our environment perfectly.
