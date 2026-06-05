"use client";

import { useState } from "react";
import {
  Building2,
  Pencil,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubjectCardData } from "@/types/timetable";

interface SubjectAssignmentEditorProps {
  subject: SubjectCardData;
  onCancel: () => void;
  onSave: (updatedSubject: SubjectCardData) => void;
}

export default function SubjectAssignmentEditor({
  subject,
  onCancel,
  onSave,
}: SubjectAssignmentEditorProps) {
  const [facultyName, setFacultyName] = useState(subject.facultyName);
  const [roomName, setRoomName] = useState(subject.roomName);

  const badgeStyles: Record<string, string> = {
    THEORY: "bg-blue-50 text-blue-700",
    LAB: "bg-green-50 text-green-700",
    TUTORIAL: "bg-purple-50 text-purple-700",
    ELECTIVE: "bg-orange-50 text-orange-700",
  };

  const handleSave = () => {
    onSave({
      ...subject,
      facultyName,
      roomName,
    });
  };

  return (
    <div
      className="
        rounded-2xl
        border-2
        border-[#4F6BFF]
        bg-white
        p-4
        shadow-[0_4px_20px_-4px_rgba(79,107,255,0.15)]
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              {subject.code || "CODE"}
            </span>

            <span className="text-[10px] font-semibold text-slate-300">
              •
            </span>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              {subject.credits || 0} CREDITS
            </span>

            <span
              className={`
                rounded-full
                px-2
                py-0.5
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                ${badgeStyles[subject.type] || badgeStyles.THEORY}
              `}
            >
              {subject.type}
            </span>
          </div>

          <h3
            className="
              mt-2
              text-lg
              font-bold
              text-slate-900
            "
          >
            {subject.subjectName}
          </h3>
        </div>

        <button
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-[#F0F3FF]
            text-[#4F6BFF]
          "
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Current Assignment */}

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-5
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            Faculty
          </p>

          <div
            className="
              mt-2
              flex
              items-center
              gap-2
              text-sm
              text-slate-700
            "
          >
            <User className="h-3.5 w-3.5" />

            <span>{facultyName}</span>
          </div>
        </div>

        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            Room
          </p>

          <div
            className="
              mt-2
              flex
              items-center
              gap-2
              text-sm
              text-slate-700
            "
          >
            <Building2 className="h-3.5 w-3.5" />

            <span>{roomName}</span>
          </div>
        </div>
      </div>

      {/* Form */}

      <div className="mt-5 space-y-4">
        <div>
          <label
            className="
              mb-2
              block
              text-[11px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            Faculty Assignment
          </label>

          <Select value={facultyName} onValueChange={setFacultyName}>
            <SelectTrigger
              className="
                h-11
                border-slate-200
              "
            >
              <SelectValue
                placeholder={facultyName}
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Dr. Anil Kumar">
                Dr. Anil Kumar
              </SelectItem>

              <SelectItem value="Prof. Arjun Nair">
                Prof. Arjun Nair
              </SelectItem>

              <SelectItem value="Dr. Priya Nair">
                Dr. Priya Nair
              </SelectItem>

              <SelectItem value="Prof. Vivek Sharma">
                Prof. Vivek Sharma
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            className="
              mb-2
              block
              text-[11px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            Room Assignment
          </label>

          <Select value={roomName} onValueChange={setRoomName}>
            <SelectTrigger
              className="
                h-11
                border-slate-200
              "
            >
              <SelectValue
                placeholder={roomName}
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="A-301">
                A-301
              </SelectItem>

              <SelectItem value="A-302">
                A-302
              </SelectItem>

              <SelectItem value="A-303">
                A-303
              </SelectItem>

              <SelectItem value="Lab-01">
                Lab-01
              </SelectItem>

              <SelectItem value="Lab-02">
                Lab-02
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}

      <div
        className="
          mt-5
          flex
          gap-3
        "
      >
        <Button
          onClick={handleSave}
          className="
            flex-1
            bg-[#0D2463]
            text-white
            shadow-sm
            hover:bg-[#091A4A]
          "
        >
          Save Changes
        </Button>

        <Button
          variant="outline"
          onClick={onCancel}
          className="
            border-slate-200
            bg-white
            px-5
          "
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}