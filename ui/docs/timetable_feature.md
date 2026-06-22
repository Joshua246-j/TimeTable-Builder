TIMETABLE FEATURE DOCUMENTATION

MODULE
src/features/timetable/components


FEATURE OVERVIEW

- The Timetable Feature is the central scheduling workspace of the application.
- It is responsible for creating, managing, validating, and publishing academic schedules.
- Every timetable-related operation passes through this module, including subject allocation, faculty assignment, room allocation, drag-and-drop scheduling, conflict detection, timetable validation, merge operations, and schedule configuration.

CORE CONCEPTS

1. Visual Scheduling Interface
- Powered by Tailwind CSS, shadcn primitives, and the local cn utility for dynamic classes.
2. Scheduling Business Logic
- Powered by Redux Toolkit, specifically utilizing syntheticActions.ts for orchestrating complex state updates.
3. Validation & Conflict Management
- Powered by internal engines like timeEngine.ts and mergeEngine.ts.

The feature combines multiple specialized components that work together to create a highly responsive and professional timetable-building experience.


COMPONENT HIERARCHY

TimetableInteractiveWorkspace
- TimetableNavbar
- ActionToolbar
- FiltersBar
- MobileFilters
- SubjectAllocationPanel
  - SubjectAllocationCard
  - SubjectPreviewPopover
- TimetableGrid
  - DayHeader
  - TimeColumn
  - BreakRow
  - TimetableCell
  - EmptySlot
  - SubjectClassCard
  - TimetableSlotCard
  - TimeRail
  - SubjectAssignmentEditor
- SelectionToolbar
- MergeSplitControls
- ConflictDrawer
- ValidationFooter
- GridConfigPanel
- MobileSubjectDrawer
- FloatingActionButton


1. INTERNAL BUSINESS LOGIC ENGINES

Before looking at the UI components, it is critical to understand the custom internal libraries that power them. These are strictly unique to this project and handle the heavy lifting.

SYNTHETIC ACTIONS ENGINE (@/store/syntheticActions.ts)
  PURPOSE
  - Orchestrates complex Redux dispatch operations.
  - Instead of UI components dispatching separate actions to update different slices, they call a single synthetic action.

  WORKING & USAGE
  - Imported across almost every major interactive component.
  - Contains actions like swapSubjectAssignments, splitMergedPeriod, undoAction, redoAction, and applyGridConfigurationAndSync.

TIME ENGINE (@/lib/timeEngine.ts)
  PURPOSE
  - Handles raw mathematical logic for time parsing and validation.

  WORKING & USAGE
  - Critical for determining if a dragged card illegally collides with an existing session.
  - Provides mathematical functions like isOverlap, parseTime, and formatTime.

MERGE ENGINE (@/lib/mergeEngine.ts)
  PURPOSE
  - Calculates the CSS Grid rowSpan math.

  WORKING & USAGE
  - Required to seamlessly turn three 1-hour slots into a single 3-hour lab block without breaking the HTML layout on the screen.


2. COMPLETE COMPONENT AUDIT (ALL 26 FILES)

ACTION TOOLBAR (ActionToolbar.tsx)
  PURPOSE
  - Acts as the central action hub for all timetable operations.
  VISUAL UI
  - A horizontal row of action buttons sitting just above the main timetable grid.
  WORKING
  - Dispatches the runValidation synthetic action to check for errors and manages Undo/Redo historical stacks.
  PACKAGES & USAGE
  - lucide-react supplies standardized UI icons.
  - react-redux connects to the undo/redo states.

BREAK ROW (BreakRow.tsx)
  PURPOSE
  - Represents institutional breaks in the schedule (like Lunch or Assembly).
  VISUAL UI
  - A wide horizontal band cutting completely across the grid columns.
  WORKING
  - Maps to the GridBreak arrays from gridConfigSlice. Prevents dropping subjects into these slots.
  PACKAGES & USAGE
  - @/store/syntheticActions is used to delete or modify the break.

CIRCULAR TIME PICKER (CircularTimePicker.tsx)
  PURPOSE
  - Allows precise time entry using a visual clock interface.
  VISUAL UI
  - A circular analog clock face with a draggable hour/minute hand.
  WORKING
  - Uses standard trigonometry (Math.atan2) to convert mouse drag angles into 24-hour time values.
  PACKAGES & USAGE
  - lucide-react provides the center dot icon.

CONFLICT DRAWER (ConflictDrawer.tsx)
  PURPOSE
  - Displays a detailed list of all scheduling errors.
  VISUAL UI
  - A sliding right-side panel containing red warning cards.
  WORKING
  - Subscribes to the validation errors array in Redux. Pops open when errors are detected.
  PACKAGES & USAGE
  - react-redux maps the errors from the store.
  - lucide-react provides the warning triangle icons.

DAY HEADER (DayHeader.tsx)
  PURPOSE
  - Displays the column headers for the timetable grid.
  VISUAL UI
  - A simple text block at the top of each column (e.g., "Monday", "Tuesday").
  WORKING
  - Purely presentational. Adjusts its width dynamically based on the grid structure.
  PACKAGES & USAGE
  - @/lib/utils handles standard Tailwind class merging.

EMPTY SLOT (EmptySlot.tsx)
  PURPOSE
  - Represents an unscheduled, available block of time.
  VISUAL UI
  - A subtle dashed rectangle with a small "+" icon on hover.
  WORKING
  - Acts as the default visual placeholder inside a TimetableCell when no allocation exists.
  PACKAGES & USAGE
  - @/lib/utils provides conditional opacity classes.

FILTERS BAR (FiltersBar.tsx)
  PURPOSE
  - Desktop interface for filtering the visible schedule.
  VISUAL UI
  - A row of dropdown menus.
  WORKING
  - Dispatches setSemester and setDepartment.
  PACKAGES & USAGE
  - lucide-react provides chevron icons.
  - react-redux manages global filter states.

FLOATING ACTION BUTTON (FloatingActionButton.tsx)
  PURPOSE
  - Mobile-specific quick access button.
  VISUAL UI
  - A circular button floating at the bottom right of the screen.
  WORKING
  - Opens the MobileSubjectDrawer when clicked.
  PACKAGES & USAGE
  - lucide-react provides the plus icon.

GRID CONFIG PANEL (GridConfigPanel.tsx)
  PURPOSE
  - Administrative settings panel controlling timetable structure.
  VISUAL UI
  - A form overlay displaying toggle switches for days of the week, institutional start/end times, and breaks.
  WORKING
  - Dispatches applyGridConfigurationAndSync to save working days and times.
  PACKAGES & USAGE
  - @/lib/timeEngine validates user time inputs.
  - react-hook-form manages form state.

MERGE SPLIT CONTROLS (MergeSplitControls.tsx)
  PURPOSE
  - Triggers the unification or division of selected time blocks.
  VISUAL UI
  - Two overlay buttons (Merge and Split).
  WORKING
  - Integrates directly with the mergeEngine and dispatches splitMergedPeriod.
  PACKAGES & USAGE
  - react-redux triggers the synthetic actions.

MOBILE FILTERS (MobileFilters.tsx)
  PURPOSE
  - Mobile version of the filters bar.
  VISUAL UI
  - A single condensed button that opens a bottom sheet.
  WORKING
  - Toggles the visibility of the mobile filter drawer.
  PACKAGES & USAGE
  - lucide-react provides the filter icon.

MOBILE SUBJECT DRAWER (MobileSubjectDrawer.tsx)
  PURPOSE
  - Mobile version of the subject allocation panel.
  VISUAL UI
  - A bottom sheet containing the list of available classes.
  WORKING
  - Allows touch-based assignment of classes on small screens.
  PACKAGES & USAGE
  - @dnd-kit/core enables touch dragging logic.

SELECTION TOOLBAR (SelectionToolbar.tsx)
  PURPOSE
  - Controls multi-cell operations like creating 3-hour lab sessions.
  VISUAL UI
  - A floating action bar that appears only when multiple adjacent cells are clicked.
  WORKING
  - Subscribes to the selectedCells array. Triggers mergeSelectedPeriods.
  PACKAGES & USAGE
  - @/lib/mergeEngine calculates the logical cell unification.

SUBJECT ALLOCATION CARD (SubjectAllocationCard.tsx)
  PURPOSE
  - Represents an assignable subject in the inventory.
  VISUAL UI
  - A small, colorful draggable card displaying the Subject Name and Professor.
  WORKING
  - Uses the useDraggable hook to act as an origin point for Drag-and-Drop operations.
  PACKAGES & USAGE
  - @dnd-kit/core manages the physical DOM dragging physics.

SUBJECT ALLOCATION PANEL (SubjectAllocationPanel.tsx)
  PURPOSE
  - Acts as the visual inventory system for all available subjects.
  VISUAL UI
  - A tall left-side sidebar featuring a vertical list of allocation cards.
  WORKING
  - Dynamically renders the list of subjects from the Redux store.
  PACKAGES & USAGE
  - react-redux accesses the subjects slice.

SUBJECT ASSIGNMENT EDITOR (SubjectAssignmentEditor.tsx)
  PURPOSE
  - Direct modification form for timetable allocations without drag-and-drop.
  VISUAL UI
  - A popup dialog containing form fields for Room, Faculty, and Time.
  WORKING
  - Reads the RootState to populate fields, updates the slice directly on save.
  PACKAGES & USAGE
  - react-hook-form manages internal field data.

SUBJECT CLASS CARD (SubjectClassCard.tsx)
  PURPOSE
  - Visual representation of a scheduled class inside the grid.
  VISUAL UI
  - A solid rectangular block showing the Subject Name, Teacher, and Room. Turns red on conflicts.
  WORKING
  - Conditionally applies borders if there is a scheduling conflict. Acts as a draggable source so users can pick it up and move it.
  PACKAGES & USAGE
  - @/lib/utils utilizes the 'cn' function to combine dynamic Tailwind classes.
  - @dnd-kit/core provides useDraggable.

SUBJECT PREVIEW POPOVER (SubjectPreviewPopover.tsx)
  PURPOSE
  - Hides complex subject details inside a hover tooltip.
  VISUAL UI
  - A floating dark box appearing next to your mouse when hovering over a subject.
  WORKING
  - Wraps an allocation card and triggers on hover.
  PACKAGES & USAGE
  - radix-ui (via shadcn) provides the accessible popover logic.

TIME COLUMN (TimeColumn.tsx)
  PURPOSE
  - Displays the vertical axis time labels.
  VISUAL UI
  - A column on the far left of the grid containing timestamps (e.g., 09:00, 10:00).
  WORKING
  - Renders time blocks derived from the gridConfigSlice.
  PACKAGES & USAGE
  - @/lib/timeEngine formats the raw data into readable strings.

TIME RAIL (TimeRail.tsx)
  PURPOSE
  - Handles the logic for dragging the edge of a class to stretch its duration.
  VISUAL UI
  - A thin vertical line running down the left edge of a SubjectClassCard.
  WORKING
  - Invokes updateTimeAllocation when the user drags the rail.
  PACKAGES & USAGE
  - @/store/syntheticActions syncs the new duration to the store.

TIMETABLE CELL (TimetableCell.tsx)
  PURPOSE
  - Represents an individual drop zone time slot.
  VISUAL UI
  - The physical boundary box that changes color when an item is dragged over it.
  WORKING
  - Uses useDroppable to listen for hovering items. Dispatches splitMergedPeriod on click.
  PACKAGES & USAGE
  - @dnd-kit/core provides useDroppable.

TIMETABLE GRID (TimetableGrid.tsx)
  PURPOSE
  - Builds the entire timetable matrix.
  VISUAL UI
  - The massive grid itself, made up of columns and rows.
  WORKING
  - Maps through gridConfigSlice. Generates physical cells and calculates isOverlap bounds.
  PACKAGES & USAGE
  - react-redux manages the structural state mappings.

TIMETABLE INTERACTIVE WORKSPACE (TimetableInteractiveWorkspace.tsx)
  PURPOSE
  - The master controller coordinating all operations.
  VISUAL UI
  - Acts as the parent invisible wrapper for the entire layout.
  WORKING
  - Initializes the DndContext. Evaluates complex drops using timeEngine to detect overlaps.
  PACKAGES & USAGE
  - @dnd-kit/core and @dnd-kit/modifiers wrap the entire grid.
  - sonner triggers notifications.

TIMETABLE NAVBAR (TimetableNavbar.tsx)
  PURPOSE
  - Application-wide navigation and context.
  VISUAL UI
  - A clean top header strip with the Logo and Context Dropdowns.
  WORKING
  - Handles Department and Semester mapping.
  PACKAGES & USAGE
  - next/link handles client routing.

TIMETABLE SLOT CARD (TimetableSlotCard.tsx)
  PURPOSE
  - Reusable visual wrapper determining the generic styling of a card.
  VISUAL UI
  - The basic colored box with shadows and rounded corners.
  WORKING
  - Accepts boolean props (isSelected, isConflict) and applies the correct CSS.
  PACKAGES & USAGE
  - @/lib/utils manages the class merging logic safely.

VALIDATION FOOTER (ValidationFooter.tsx)
  PURPOSE
  - The real-time health monitor of the schedule.
  VISUAL UI
  - A persistent, sticky bar at the bottom showing a green checkmark or warning count.
  WORKING
  - Reads validation error arrays from Redux.
  PACKAGES & USAGE
  - react-redux subscribes to the validation engine.
  - lucide-react provides the status icons.


PROJECT ARCHITECTURE AUDIT CONCLUSION

The timetable feature perfectly illustrates an advanced React/Redux implementation pattern by separating the Visual Layer from the Mathematical Logic Layer:
1. The Visual Layer: Uses TimetableGrid, TimetableCell, and @dnd-kit purely to display boxes and capture mouse movements.
2. The Logic Layer: Uses pure mathematical files like timeEngine.ts and mergeEngine.ts to calculate overlaps without touching the DOM.
3. The Synchronization Layer: Uses syntheticActions.ts as the sole bridge between user actions and Redux state updates, ensuring that every visual change is perfectly validated and synchronized across all internal slices simultaneously.
