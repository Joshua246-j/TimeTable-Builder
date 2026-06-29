# Timetable Management System - Client Workflow

This document explains how the frontend client of the Timetable Management System works in simple English. It covers the flow from managing subjects to building and publishing timetables.

## 1. Subject Management Flow

### Overview
Before building a timetable, teachers must define the subjects (classes) they need to schedule. This is done through the Subject Management panels.

### Adding and Editing Subjects
- **Subject Creation**: Users can create subjects by providing a name (e.g., "Database Systems"), a short code (e.g., "CS301"), and assigning a color.
- **Color Coding**: Each subject is assigned a unique color tag. This color is used consistently across the entire application so that users can instantly recognize the subject on the timetable grid.
- **Data Synchronization**: When a subject is added or updated, it is immediately saved to the global state (Redux). This ensures that any changes to a subject's name or color instantly update across all timetable drafts and live views without needing a page refresh.

## 2. Timetable Draft & Publishing Architecture

### The Draft System
The core philosophy of the timetable builder is based on **Drafts**. Instead of editing a live schedule directly, teachers work within safe, isolated drafts.
- **Multiple Drafts**: A teacher can have multiple saved drafts at the same time. Examples include "Regular Semester", "Exam Week", or "Holiday Schedule".
- **Draft Manager**: At the top of the Timetable Builder, a Draft Manager toolbar allows the user to switch between their drafts instantly. They can also create new drafts, duplicate existing ones, and delete them.
- **Safe Editing**: All drag-and-drop actions, splitting, and merging of cells are strictly saved to the active draft. The live timetable seen by students is completely unaffected.

### The Publishing Flow
When a teacher is satisfied with a draft, they can make it live.
- **Publish Live**: Clicking the "Publish Live" button takes a snapshot of the current active draft and pushes it to the Live Timetable.
- **Single Source of Truth**: Only ONE timetable can be published at a time for a given class. The published timetable is the definitive source for students and faculty.
- **Editing the Live Timetable**: If a teacher notices a mistake in the published timetable, they can click "Edit Timetable". The system safely loads the active draft behind that view into the builder, ensuring the live view remains untouched until the teacher clicks "Publish Live" again.

## 3. Timetable Builder Flow

### Building the Schedule
The Builder is the interactive workspace where the actual scheduling happens.
- **Drag and Drop**: Teachers can drag subjects from the sidebar directly onto the grid.
- **Time Adjustments**: By dragging the edges of an assigned block on the grid, teachers can increase or decrease the duration of a class.
- **Conflict Detection**: If a teacher tries to place a subject in a slot that is already occupied or overlaps with another subject, the system automatically detects the conflict and alerts the user.
- **Merging**: If a teacher drops the same subject into adjacent slots, the system intelligently suggests merging them into a single continuous block.

## 4. Published Timetable View

### Viewing the Live Schedule
- **Read-Only Access**: The Published View is strictly read-only. It is designed to be fast, clear, and perfectly formatted for students and faculty to check their schedules.
- **Dynamic Updates**: Because the Published View relies on a detached snapshot (the `liveTimetable`), it only updates when a teacher explicitly hits "Publish Live". It ignores any unsaved or saved draft work happening in the background. 
- **Clear Status**: The view clearly indicates that it is the "Live for students & faculty" version, giving everyone confidence in the accuracy of the schedule.
