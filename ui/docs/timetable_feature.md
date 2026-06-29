TIMETABLE FEATURE DOCUMENTATION

MODULE
src/features/timetable/components & src/features/timetable/hooks


FEATURE OVERVIEW

- The Timetable Feature is the central scheduling workspace of the application.
- It is responsible for creating, managing, validating, and publishing academic schedules.
- Every timetable-related operation passes through this module, including subject allocation, faculty assignment, room allocation, drag-and-drop scheduling, conflict detection, timetable validation, merge operations, and schedule configuration.

CORE CONCEPTS

1. Visual Scheduling Interface
- Powered by Tailwind CSS, shadcn primitives, and the local cn utility for dynamic classes.
2. Scheduling Business Logic
- Business logic is completely extracted from UI components into custom React hooks (e.g., `useTimetableMutations.ts` and `useTimetableDragAndDrop.ts`).
3. Validation & Conflict Management
- Powered by internal engines like timeEngine.ts and mergeEngine.ts.

The feature combines multiple specialized components that work together to create a highly responsive and professional timetable-building experience.

1. INTERNAL BUSINESS LOGIC & CUSTOM HOOKS

Before looking at the UI components, it is critical to understand the custom hooks that power them. These isolate heavy computation from UI rendering.

USE TIMETABLE MUTATIONS (hooks/useTimetableMutations.ts)
  PURPOSE
  - Handles all Redux dispatching for timetable alterations (Time changes, Subject swaps, Assignment overwrites).
  - Contains advanced collision detection logic inside `onSaveEdit` and `onTimeChange`.
  - Integrates with `mergeEngine` to detect if adjacent blocks can be merged automatically.

USE TIMETABLE DRAG AND DROP (hooks/useTimetableDragAndDrop.ts)
  PURPOSE
  - Handles the raw DndKit mechanics (`handleDragStart`, `handleDragEnd`, and sensor configuration).
  - Determines if a drag event was a "Swap", "Overwrite", or a "New Assignment".

SYNTHETIC ACTIONS ENGINE (@/store/syntheticActions.ts)
  PURPOSE
  - Orchestrates complex Redux dispatch operations (updating multiple slices simultaneously).

TIME ENGINE (@/lib/timeEngine.ts)
  PURPOSE
  - Handles raw mathematical logic for time parsing and validation. Critical for determining physical overlaps between blocks.

MERGE ENGINE (@/lib/mergeEngine.ts)
  PURPOSE
  - Calculates the CSS Grid rowSpan math needed to turn three 1-hour slots into a single 3-hour lab block seamlessly.


2. COMPLETE COMPONENT AUDIT

TIMETABLE INTERACTIVE WORKSPACE (TimetableInteractiveWorkspace.tsx)
  PURPOSE
  - The master UI controller coordinating all visual layouts.
  VISUAL UI
  - Acts as the parent wrapper for the ActionToolbar, Grid, Panels, and Overlays.
  WORKING
  - Connects to the custom hooks (`useTimetableMutations`, `useTimetableDragAndDrop`) and passes logic callbacks to subcomponents like the Grid and Toolbars.

TIMETABLE GRID (TimetableGrid.tsx)
  PURPOSE
  - Builds the entire timetable matrix.
  VISUAL UI
  - The massive grid itself, made up of columns and rows.
  WORKING
  - Maps through gridConfigSlice. Generates physical cells and maps allocations to physical coordinates.

SUBJECT ALLOCATION PANEL (SubjectAllocationPanel.tsx)
  PURPOSE
  - Acts as the visual inventory system for all available subjects.
  VISUAL UI
  - An absolute-positioned right-side sidebar overlay featuring a vertical list of allocation cards. Does not shift grid layout.

TIMETABLE DATE PICKER (TimetableDatePicker.tsx)
  PURPOSE
  - Allows navigation between weeks and selection of specific days.
  WORKING
  - Dynamically highlights days containing published schedule versions.

ACTION TOOLBAR (ActionToolbar.tsx)
  PURPOSE
  - Acts as the central action hub for timetable operations (Detect Conflicts, Auto Allocate, Publish).

CONFLICT DRAWER (ConflictDrawer.tsx)
  PURPOSE
  - Displays a detailed list of all scheduling errors inside a sliding right-side panel.

SUBJECT CLASS CARD (SubjectClassCard.tsx)
  PURPOSE
  - Visual representation of a scheduled class inside the grid.

TIMETABLE CELL (TimetableCell.tsx)
  PURPOSE
  - Represents an individual drop zone time slot.
  WORKING
  - Uses useDroppable to listen for hovering items. 

PROJECT ARCHITECTURE AUDIT CONCLUSION

The timetable feature perfectly illustrates an advanced React/Redux implementation pattern by strictly separating concerns:
1. The Visual Layer: Components like `TimetableGrid` only care about rendering blocks based on coordinate props.
2. The Hook Logic Layer: Custom hooks like `useTimetableMutations` intercept all user actions and compute mathematical consequences.
3. The Synchronization Layer: Redux and `syntheticActions.ts` permanently persist the results of the mutations.
