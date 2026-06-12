"use client";

import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { disableSelectionMode, enableSelectionMode } from "@/store/timetableEngineSlice";
import { splitMergedPeriod } from "@/store/syntheticActions";

import { AppDispatch } from "@/store/store";

export default memo(function MergeSplitControls({ groupId }: { groupId?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectionMode } = useSelector((state: RootState) => state.timetableEngine);

  return (
    <div className="flex items-center gap-2">
      {!selectionMode ? (
        <button
          onClick={() => dispatch(enableSelectionMode())}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
        >
          Enable Merge Mode
        </button>
      ) : (
        <button
          onClick={() => dispatch(disableSelectionMode())}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100 transition-colors border border-slate-200"
        >
          Exit Merge Mode
        </button>
      )}

      {groupId && (
        <button
          onClick={() => dispatch(splitMergedPeriod({ mergedId: groupId }))}
          className="px-3 py-1.5 text-xs font-semibold bg-orange-50 text-orange-600 rounded-md hover:bg-orange-100 transition-colors border border-orange-200"
        >
          Split Period
        </button>
      )}
    </div>
  );
});
