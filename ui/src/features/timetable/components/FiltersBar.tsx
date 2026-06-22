"use client";

import {
  Building2,
  CalendarDays,
  Layers3,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DEPARTMENTS,
  SECTIONS,
  SEMESTERS,
} from "@/constants/timetable";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setSemester, setDepartment, setSection } from "@/store/uiSlice";

export default function FiltersBar() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedSemester,
    selectedDepartment,
    selectedSection,
  } = useSelector((state: RootState) => state.ui);

  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* Header */}
      <div className="mb-5">
        <h2
          className="
            text-base
            font-semibold
            text-slate-900
          "
        >
          Academic Filters
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Select semester, department and section
          to manage the timetable.
        </p>
      </div>

      {/* Filters */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {/* Semester */}
        <div>
          <label
            className="
              mb-2
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            <CalendarDays className="h-4 w-4" />
            Semester
          </label>

          <Select
            value={selectedSemester}
            onValueChange={(val) => dispatch(setSemester(val))}
          >
            <SelectTrigger
              className="
                h-11
                rounded-xl
              "
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {SEMESTERS.map((semester) => (
                <SelectItem
                  key={semester.id}
                  value={semester.value}
                >
                  {semester.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div>
          <label
            className="
              mb-2
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            <Building2 className="h-4 w-4" />
            Department
          </label>

          <Select
            value={selectedDepartment}
            onValueChange={(val) => dispatch(setDepartment(val))}
          >
            <SelectTrigger
              className="
                h-11
                rounded-xl
              "
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {DEPARTMENTS.map((department) => (
                <SelectItem
                  key={department.id}
                  value={department.value}
                >
                  {department.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section */}
        <div>
          <label
            className="
              mb-2
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            <Layers3 className="h-4 w-4" />
            Section
          </label>

          <Select
            value={selectedSection}
            onValueChange={(val) => dispatch(setSection(val))}
          >
            <SelectTrigger
              className="
                h-11
                rounded-xl
              "
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {SECTIONS.map((section) => (
                <SelectItem
                  key={section.id}
                  value={section.value}
                >
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}