"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import SubjectAllocationCard from "./SubjectAllocationCard";
import SubjectAssignmentEditor from "./SubjectAssignmentEditor";
import type { SubjectCardData } from "@/types/timetable";

interface SubjectAllocationPanelProps {
  subjects: SubjectCardData[];
  onUpdateSubject: (subject: SubjectCardData) => void;
  onAddSubject: (subject: SubjectCardData) => void;
}

export default function SubjectAllocationPanel({
  subjects,
  onUpdateSubject,
  onAddSubject,
}: SubjectAllocationPanelProps) {
  const [editingId, setEditingId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (updatedSubject: SubjectCardData) => {
    onUpdateSubject(updatedSubject);
    setEditingId("");
  };

  const handleAddNew = () => {
    const newId = `new-${Date.now()}`;
    const newSubject: SubjectCardData = {
      id: newId,
      code: "NEW",
      credits: 3,
      type: "THEORY",
      subjectName: "New Subject",
      facultyName: "Unassigned",
      roomName: "Unassigned",
    };
    onAddSubject(newSubject);
    setEditingId(newId);
  };

  return (
    <aside
      className="
        flex
        h-full
        flex-col
        bg-white
      "
    >
      {/* Header */}

      <div
        className="
          border-b
          border-[#E5E7EB]
          px-5
          py-5
        "
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="
                text-[20px]
                font-semibold
                text-slate-900
              "
            >
              Subject Allocation
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Manage faculty & rooms
            </p>
          </div>

          <button
            className="
              rounded-md
              p-1
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Subject List */}

      <div
        className="
          flex-1
          overflow-y-auto
          p-5
        "
      >
        <div className="space-y-4">
          {subjects.map((subject) => {
            const isEditing =
              editingId === subject.id;

            if (isEditing) {
              return (
                <SubjectAssignmentEditor
                  key={subject.id}
                  subject={subject}
                  onCancel={() => setEditingId("")}
                  onSave={() => handleSave(subject)}
                />
              );
            }

            return (
              <SubjectAllocationCard
                key={subject.id}
                subject={subject}
                onEdit={() =>
                  setEditingId(subject.id)
                }
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}

      <div
        className="
          p-5
          pt-0
        "
      >
        <button
          onClick={handleAddNew}
          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-dashed
            border-[#D6DDF5]
            bg-white
            text-sm
            font-medium
            text-[#4F6BFF]
            transition-colors
            hover:bg-[#F8FAFF]
          "
        >
          <Plus className="h-4 w-4" />

          Add New Subject
        </button>
      </div>
    </aside>
  );
}