# Application Architecture

This application is built with **Next.js 15 (App Router)** and **React 19**, focusing on strict modularity, high performance, and deep type safety.

## Core Technologies
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS V4 + Vanilla CSS Modules for specific overrides.
- **State Management:** Redux Toolkit (structured into domain-specific slices).
- **Drag-and-Drop:** `@dnd-kit/core` for accessible, performant interactions in the Timetable Builder.
- **Forms & Validation:** `react-hook-form` with `zod` for robust data validation.
- **UI Components:** `shadcn/ui`, `radix-ui`, and custom highly optimized atomic components.

## Directory Structure
The codebase follows a strict feature-driven architecture. This ensures that logic, state, and UI are co-located by domain rather than file type, drastically improving maintainability.

```
src/
├── app/                  # Next.js App Router endpoints and layouts
│   ├── (dashboard)/      # Protected routes (Dashboard, Academic Modules, Timetable)
│   ├── (marketing)/      # Public-facing routes (if applicable)
│   └── globals.css       # Global design tokens and Tailwind base
├── components/           # Generic, highly reusable UI components (Buttons, Inputs, Drawers)
├── features/             # Feature-driven modules (Core business logic)
│   ├── academic-modules/ # Subject management, course definitions
│   ├── dashboard/        # Teacher dashboard widgets and layouts
│   └── timetable/        # Timetable builder, drag-and-drop mechanics, resolution engines
├── hooks/                # Global generic React hooks
├── lib/                  # Utility functions, algorithms (timeEngine, mergeEngine)
├── store/                # Redux Toolkit configuration and slices
└── types/                # Global TypeScript definitions
```

## Modularity Principles
1. **Feature Encapsulation:** If a component or hook is only used within the Timetable Builder, it lives in `src/features/timetable/`. It should not pollute the global `src/components/` folder.
2. **Logic Extraction:** Heavy business logic (like collision detection, drag-and-drop state parsing) is entirely extracted into custom React hooks (e.g., `useTimetableMutations.ts`). Components should ideally only be responsible for rendering data and attaching event listeners.
3. **Strict Type Safety:** All functions, API responses, and Redux states strictly adhere to TypeScript interfaces defined in `src/types/`. The use of `any` is strictly prohibited.

## Scalability
Because the application is structured by feature, adding a new feature (like "Student Management") simply requires creating `src/features/students/` and placing all its components, hooks, and localized styles inside it. No touching of unrelated files is necessary.
