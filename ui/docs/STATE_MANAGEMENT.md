# State Management Guide

The application uses **Redux Toolkit** as its centralized state management solution. The store is meticulously divided into logical slices to prevent unnecessary re-renders and keep data structured.

## Redux Slices

### 1. Timetable Engine (`timetableEngineSlice.ts`)
This is the core execution engine of the timetable builder.
- **State Structure:**
  - `allocations`: A massive dictionary of all assigned blocks (keyed by ID). Tracks `startTime`, `endTime`, `subjectId`, `dayId`, `isLocked`.
- **Key Actions:**
  - `assignSubject`: Drops a new subject onto a grid cell.
  - `swapSubjectAssignments`: Swaps the position of two different subjects.
  - `updateTimeAllocation`: Alters the start/end time (stretching or moving) of an assignment.
  - `merge`: Combines two adjacent blocks of the same subject into a single block.

### 2. Timetable Drafts (`timetableDraftSlice.ts`)
Controls the persistence and versioning of the timetables.
- **State Structure:**
  - `drafts`: Array of timetable versions (e.g., "Draft 1", "Draft 2", "Live Version").
  - `activeDraftId`: The ID of the draft currently being edited in the workspace.
  - `publishedDraftId`: The ID of the draft that is currently "Live" and visible in read-only mode.
- **Key Actions:**
  - `saveActiveDraft`: Serializes the current `allocations` into the active draft.
  - `publishActiveDraft`: Promotes the active draft to the `publishedDraftId`.

### 3. Subject Management (`subjectSlice.ts`)
Manages the raw data for academic modules (courses, faculty, rooms).
- **State Structure:**
  - `subjects`: Dictionary of all available subjects.
- **Usage:**
  The `SubjectAllocationPanel` reads from this slice to render the draggable subject cards.

### 4. Validation Engine (`validationSlice.ts`)
A background processor that analyzes the `allocations` for rule-breaking behavior.
- **State Structure:**
  - `conflicts`: Array of detected conflicts (e.g., "Teacher double-booked", "Room capacity exceeded").
- **Usage:**
  This slice powers the red `ConflictDrawer` and the warning badges in the `ActionToolbar`.

## Synthetic Actions
In many cases, an action triggered by the user needs to affect multiple slices (e.g., assigning a subject might need to trigger validation). We use **Synthetic Actions** (thunks or complex reducers in `syntheticActions.ts`) to coordinate these multi-slice updates cleanly without creating circular dependencies.
