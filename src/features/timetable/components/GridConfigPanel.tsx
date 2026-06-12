import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  toggleGridEditMode,
  toggleDay,
  addBreak,
  removeBreak,
  updatePeriodStructure,
  GridBreak
} from "@/store/gridConfigSlice";
import { X, Clock, Settings2, Plus, CalendarDays, Coffee, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export default function GridConfigPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector((state: RootState) => state.gridConfig);
  const { allocations } = useSelector((state: RootState) => state.timetableEngine);

  // Local state for Period Structure form
  const [startTime, setStartTime] = useState(config.startTime);
  const [duration, setDuration] = useState(config.defaultPeriodDuration);
  const [periodsCount, setPeriodsCount] = useState(config.numberOfPeriods);

  // Local state for Break form
  const [showAddBreak, setShowAddBreak] = useState(false);
  const [breakPosition, setBreakPosition] = useState<string>(config.timeSlots[0]?.id || '1');
  const [breakType, setBreakType] = useState<GridBreak['type']>('Lunch Break');
  const [breakDuration, setBreakDuration] = useState<number>(45);

  if (!config.isGridEditMode) return null;

  const handleToggleDay = (dayName: string, enabled: boolean) => {
    if (!enabled) {
      // Validation check before disabling a day
      const hasSubjects = Object.values(allocations).some(alloc => alloc.id.startsWith(dayName));
      if (hasSubjects) {
        if (!confirm(`Warning: There are subjects assigned on ${dayName}. If you disable this day, those subjects might not be visible. Do you want to continue?`)) {
          return; // Abort if they don't confirm
        }
      }
    }
    dispatch(toggleDay({ name: dayName, enabled }));
  };

  const handleSavePeriodStructure = () => {
    dispatch(updatePeriodStructure({ startTime, duration, count: periodsCount }));
    toast.success("Period structure updated");
  };

  const handleAddBreak = () => {
    const newBreak: GridBreak = {
      id: `break-${Date.now()}`,
      afterPeriodId: breakPosition,
      durationMinutes: breakDuration,
      label: breakType,
      type: breakType
    };
    dispatch(addBreak(newBreak));
    setShowAddBreak(false);
    toast.success(`${breakType} added`);
  };

  return (
    <div className="h-full w-[360px] shrink-0 bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-700">
            <Settings2 className="w-5 h-5" />
            <h2 className="font-bold text-[15px]">Grid Configuration</h2>
          </div>
          <button
            onClick={() => dispatch(toggleGridEditMode())}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">

          {/* Working Days Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-slate-700 text-sm">Working Days</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {config.days.map(day => (
                <label
                  key={day.id}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${day.enabled ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                  <span className={`text-sm font-semibold ${day.enabled ? 'text-indigo-700' : 'text-slate-500'}`}>
                    {day.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(e) => handleToggleDay(day.name, e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Period Structure Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-slate-700 text-sm">Period Structure</h3>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Start Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  placeholder="e.g. 08:30 AM"
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(parseInt(e.target.value) || 0)}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Periods Count</label>
                  <input
                    type="number"
                    value={periodsCount}
                    onChange={e => setPeriodsCount(parseInt(e.target.value) || 0)}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSavePeriodStructure}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                Apply Structure
              </button>
            </div>
          </section>

          {/* Break Management Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Coffee className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-slate-700 text-sm">Break Management</h3>
            </div>

            <div className="space-y-2">
              {config.breaks.length === 0 && (
                <div className="text-center py-4 text-xs font-medium text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  No breaks defined
                </div>
              )}

              {config.breaks.map(b => (
                <div key={b.id} className="flex flex-col gap-1 p-3 border border-slate-200 rounded-xl bg-white shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-700">{b.label}</span>
                    <button
                      onClick={() => dispatch(removeBreak(b.id))}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    After Period {b.afterPeriodId} • {b.durationMinutes} mins
                  </span>
                </div>
              ))}
            </div>

            {!showAddBreak ? (
              <button
                onClick={() => setShowAddBreak(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 text-xs font-bold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Break
              </button>
            ) : (
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-indigo-900">New Break</h4>
                  <button onClick={() => setShowAddBreak(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Break Type</label>
                  <select
                    value={breakType}
                    onChange={(e) => setBreakType(e.target.value as GridBreak['type'])}
                    className="w-full text-sm p-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 bg-white"
                  >
                    <option value="Lunch Break">Lunch Break</option>
                    <option value="Tea Break">Tea Break</option>
                    <option value="Assembly Break">Assembly Break</option>
                    <option value="Custom Break">Custom Break</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Position</label>
                  <select
                    value={breakPosition}
                    onChange={(e) => setBreakPosition(e.target.value)}
                    className="w-full text-sm p-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 bg-white"
                  >
                    {config.timeSlots.map((ts, idx) => (
                      <option key={ts.id} value={ts.id}>After Period {idx + 1} ({ts.endTime})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Duration (mins)</label>
                  <input
                    type="number"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(parseInt(e.target.value) || 0)}
                    className="w-full text-sm p-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 bg-white"
                  />
                </div>

                <button
                  onClick={handleAddBreak}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition-colors"
                >
                  Save Break
                </button>
              </div>
            )}

          </section>

        </div>
    </div>
  );
}
