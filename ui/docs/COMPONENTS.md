# Components & Reusability Guide

This document outlines the core components available in the application and how they should be reused when building new features.

## Global Components (`src/components/`)
These are highly generic, atomic components that have no knowledge of business logic. They simply accept props and emit events.
- `SideNavbar.tsx`: The primary application navigation sidebar. Supports collapse/expand animations.
- `Header.tsx`: The top application bar containing user profile, notifications, and global search.

*(Note: In the future, atomic elements like Buttons, Inputs, and Modals should be migrated here if they are reused across multiple domains).*

## Feature-Specific Components (`src/features/`)

### Teacher Dashboard Widgets (`src/features/dashboard/components/teacher-widgets/`)
These widgets are strictly designed for the Teacher Dashboard but follow a consistent UI pattern.
- `AttendanceItem.tsx`: Renders quick attendance statistics (e.g., "92% Attendance").
- `EvaluationItem.tsx`: Renders pending grading tasks.
- `ExamItem.tsx`: Renders upcoming examination schedules.
- `NotificationItem.tsx`: Displays a generic alert/notification.
- `TimetableRow.tsx`: Displays a summary of a single day's class schedule.
- `WorkloadStat.tsx`: A small statistical block (e.g., "18 hrs/week").

### Timetable Builder Components (`src/features/timetable/components/`)
The Timetable module contains the most complex components. They are strictly encapsulated here.
- `TimetableInteractiveWorkspace.tsx`: The primary container for the builder. Coordinates drag-and-drop context and acts as the state arbiter.
- `TimetableGrid.tsx`: The visual layout of rows (time) and columns (days).
- `SubjectAllocationPanel.tsx`: An absolute overlay panel (right-side) listing available subjects to drag onto the grid.
- `ActionToolbar.tsx`: The top bar containing "Auto Allocate", "Detect Conflicts", and "Publish" buttons.
- `TimetableDatePicker.tsx`: The inline calendar widget for selecting days/weeks.
- `ConflictDrawer.tsx`: A bottom sheet that slides up to reveal validation errors.

### Academic Modules (`src/features/academic-modules/components/`)
- `AcademicModulesClient.tsx`: A complex data grid displaying all subjects, supporting sorting, filtering, and dynamic view toggling.
- `AcademicModuleForm.tsx`: A complex form for defining new courses and subjects.

## Best Practices for Building New Components
1. **Never mutate global state in an atomic component.** A `Button` should not call `dispatch()`. Pass callbacks (`onClick`) instead.
2. **Use Tailwind carefully.** Stick to the design system variables (`bg-[#5A67D8]`, `rounded-2xl`, etc.) rather than arbitrary sizes.
3. **Keep files small.** If a component grows beyond 200-300 lines, extract its logic into a custom hook or break it into smaller sub-components.
