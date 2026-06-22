"use client";

import { useState } from "react";
import { Pencil, Check, X, Trash2, Plus, Minus } from "lucide-react";

interface BreakRowProps {
  id?: string;
  label: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  onRemove?: () => void;
  onEditDuration?: (newDuration: number) => void;
  isGridEditMode?: boolean;
}

export default function BreakRow({
  label,
  startTime,
  endTime,
  durationMinutes,
  onRemove,
  onEditDuration,
  isGridEditMode
}: BreakRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(durationMinutes);

  const handleSave = () => {
    if (onEditDuration && editVal > 0) {
      onEditDuration(editVal);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditVal(durationMinutes);
    setIsEditing(false);
  };

  return (
    <div
      className="
        col-span-full
        border-b
        border-slate-200
        bg-[#F7F8FC]
        relative
        group
      "
    >
      <div
        className="
          flex
          min-h-[72px]
          items-center
          justify-center
          px-4
        "
      >
        <div className="text-center flex flex-col md:flex-row items-center justify-center gap-3">
          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-widest
              text-slate-500
              flex items-center gap-2
            "
          >
            ☕ {startTime} — {endTime} • {label}
            {!isEditing && ` (${durationMinutes}m)`}
          </p>
          {!isEditing && onEditDuration && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-[#4F6BFF] hover:border-[#4F6BFF]/30 hover:shadow-md transition-all active:scale-95 ml-1"
              title="Edit Break Time"
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}
          
          {isGridEditMode && !isEditing && onRemove && (
            <button
              onClick={onRemove}
              className="flex items-center justify-center w-6 h-6 rounded-md bg-red-50 text-red-500 border border-red-100 shadow-sm hover:bg-red-100 transition-all active:scale-95"
              title="Remove Break"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {isEditing && (
            <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-in zoom-in duration-200">
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-md">
                <button
                  onClick={() => setEditVal((v) => Math.max(5, v - 5))}
                  className="w-7 h-7 flex items-center justify-center rounded-l-md hover:bg-white hover:shadow-sm text-slate-500 transition-all border-r border-slate-100/50"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="text"
                  value={editVal}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/\D/g, ''));
                    if (!isNaN(v)) setEditVal(v);
                  }}
                  className="w-10 text-center text-[12px] font-bold bg-transparent px-1 py-1 outline-none text-slate-700"
                  autoFocus
                />
                <button
                  onClick={() => setEditVal((v) => v + 5)}
                  className="w-7 h-7 flex items-center justify-center rounded-r-md hover:bg-white hover:shadow-sm text-slate-500 transition-all border-l border-slate-100/50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[11px] font-bold text-slate-400 px-1">min</span>
              <div className="w-[1px] h-4 bg-slate-200 mx-1" />
              <button onClick={handleSave} className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Save Duration">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={handleCancel} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-colors" title="Cancel">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
