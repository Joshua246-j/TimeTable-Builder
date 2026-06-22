import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  toggleGridEditMode,
  toggleDay,
  GridBreak,
  GridTimeSlot
} from "@/store/gridConfigSlice";
import { applyGridConfigurationAndSync } from "@/store/syntheticActions";
import { X, Clock, Plus, CalendarDays, Trash2, GripVertical, Save, Minus, Settings } from "lucide-react";
import { toast } from "sonner";
import { parseTime, formatTime } from "@/lib/timeEngine";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { parse, format } from 'date-fns';

type TimelineItem = {
  id: string;
  type: 'PERIOD' | 'BREAK';
  label: string;
  durationMinutes: number;
  originalPeriodId?: string;
  originalBreakId?: string;
  breakType?: GridBreak['type'];
};

function SortableItem({ item, timeRange, onDelete, onUpdateDuration }: { item: TimelineItem; timeRange: string; onDelete: (id: string) => void; onUpdateDuration: (id: string, mins: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const isPeriod = item.type === 'PERIOD';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border transition-all duration-200 ${isPeriod ? 'border-slate-200 bg-white hover:border-[#4F6BFF]/30 hover:shadow-md' : 'border-orange-200 bg-orange-50/50 hover:shadow-md'}`}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1 -ml-1">
              <GripVertical className="w-4 h-4" />
            </div>
            <h4 className={`text-[14px] font-bold truncate ${isPeriod ? 'text-slate-800' : 'text-[#C2410C]'}`}>
                {isPeriod ? item.label : item.breakType}
            </h4>
          </div>
          {!isPeriod && (
            <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between pl-8">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider bg-slate-100/50 px-2 py-1 rounded-md">{timeRange}</span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => onUpdateDuration(item.id, Math.max(5, item.durationMinutes - 5))}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-[12px] font-bold w-6 text-center text-slate-700">{item.durationMinutes}</span>
                <button 
                  onClick={() => onUpdateDuration(item.id, item.durationMinutes + 5)}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function GridConfigPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector((state: RootState) => state.gridConfig);

  // Local state for Period Structure form
  const [startTime, setStartTime] = useState(config.startTime);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  // Initialize timeline items
  useEffect(() => {
    if (!config.isGridEditMode) return;
    
    const items: TimelineItem[] = [];
    
    const initialBreaks = config.breaks.filter(b => b.afterPeriodId === '0' || !b.afterPeriodId);
    initialBreaks.forEach(b => {
       items.push({
          id: `break-${b.id}`,
          type: 'BREAK',
          label: b.label,
          durationMinutes: b.durationMinutes,
          originalBreakId: b.id,
          breakType: b.type
       });
    });

    config.timeSlots.forEach(ts => {
       items.push({
          id: `period-${ts.id}`,
          type: 'PERIOD',
          label: ts.label, 
          durationMinutes: ts.durationMinutes || config.defaultPeriodDuration,
          originalPeriodId: ts.id
       });
       
       const breaksAfter = config.breaks.filter(b => b.afterPeriodId === ts.id);
       breaksAfter.forEach(b => {
          items.push({
             id: `break-${b.id}`,
             type: 'BREAK',
             label: b.label,
             durationMinutes: b.durationMinutes,
             originalBreakId: b.id,
             breakType: b.type
          });
       });
    });
    // eslint-disable-next-line
    setTimelineItems(items);
  }, [config.timeSlots, config.breaks, config.isGridEditMode, config.defaultPeriodDuration]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTimelineItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddBreak = (presetMins: number, type: GridBreak['type']) => {
    const newBreakId = `new-break-${Date.now()}`;
    setTimelineItems(items => [
      ...items,
      {
        id: newBreakId,
        type: 'BREAK',
        label: type,
        durationMinutes: presetMins,
        breakType: type
      }
    ]);
  };
  
  const handleAddPeriod = () => {
    const newPeriodId = `new-period-${Date.now()}`;
    const periodCount = timelineItems.filter(i => i.type === 'PERIOD').length;
    setTimelineItems(items => [
      ...items,
      {
        id: newPeriodId,
        type: 'PERIOD',
        label: `Period ${periodCount + 1}`,
        durationMinutes: config.defaultPeriodDuration,
      }
    ]);
  };

  const handleDeleteItem = (id: string) => {
    setTimelineItems(items => items.filter(i => i.id !== id));
  };

  const handleUpdateDuration = (id: string, mins: number) => {
    setTimelineItems(items => items.map(i => i.id === id ? { ...i, durationMinutes: mins } : i));
  };

  const handleSaveGrid = () => {
    const newTimeSlots: GridTimeSlot[] = [];
    const newBreaks: GridBreak[] = [];
    
    let periodIndex = 1;
    let lastPeriodId = "0"; 
    
    let currentMins = parseTime(startTime);
    
    timelineItems.forEach(item => {
        const itemStart = formatTime(currentMins);
        currentMins += item.durationMinutes;
        const itemEnd = formatTime(currentMins);
        
        if (item.type === 'PERIOD') {
           const pid = item.originalPeriodId || `p-${Date.now()}-${periodIndex}`;
           newTimeSlots.push({
               id: pid,
               startTime: itemStart,
               endTime: itemEnd,
               label: `Period ${periodIndex}`,
               durationMinutes: item.durationMinutes
           });
           lastPeriodId = pid;
           periodIndex++;
        } else {
           newBreaks.push({
               id: item.originalBreakId || `break-${Date.now()}-${Math.random()}`,
               afterPeriodId: lastPeriodId, 
               durationMinutes: item.durationMinutes,
               label: item.label,
               type: item.breakType || 'Custom Break'
           });
        }
    });
    
    dispatch(applyGridConfigurationAndSync({
      startTime,
      duration: config.defaultPeriodDuration,
      newTimeSlots,
      newBreaks
    }));
    
    toast.success("Grid configuration saved successfully!");
    dispatch(toggleGridEditMode());
  };

  const renderedItems = useMemo(() => {
    const startMins = parseTime(startTime);
    const result = [];
    let current = startMins;
    
    for (const item of timelineItems) {
       const itemStart = formatTime(current);
       const next = current + item.durationMinutes;
       const itemEnd = formatTime(next);
       current = next;
       
       let label = (item.type === 'PERIOD' ? item.label : item.breakType) || 'Unknown';
       if (item.type === 'PERIOD' && label.includes(" - ")) {
           const periodNum = timelineItems.filter(i => i.type === 'PERIOD').indexOf(item) + 1;
           label = `Period ${periodNum}`;
       }
       
       result.push({ ...item, label, timeRange: `${itemStart} - ${itemEnd}` });
    }
    return result;
  }, [timelineItems, startTime]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.value) {
        // e.target.value is in "HH:mm" 24h format
        try {
           const d = parse(e.target.value, "HH:mm", new Date());
           if (!isNaN(d.getTime())) {
              setStartTime(format(d, "hh:mm a"));
           }
        } catch {
           // ignore
        }
     }
  };

  const timeInputValue = useMemo(() => {
     try {
       const d = parse(startTime, "hh:mm a", new Date());
       return isNaN(d.getTime()) ? "09:00" : format(d, "HH:mm");
     } catch {
       return "09:00";
     }
  }, [startTime]);

  if (!config.isGridEditMode) return null;

  return (
    <aside className="h-[90dvh] w-[400px] shrink-0 bg-white/95 backdrop-blur-xl flex flex-col z-50 border-l border-white/50 shadow-[-10px_0_40px_rgba(0,0,0,0.08)] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-slate-800 leading-tight">Grid Configuration</h2>
                <p className="mt-0.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Setup Working Days & Times</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleGridEditMode())}
              className="rounded-full p-2 bg-slate-50 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
        </div>

        <div className="flex-1 overflow-y-scroll p-6 space-y-8 scrollbar-hide">

          {/* Working Days Section */}
          <section className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 pb-4">
              <CalendarDays className="w-4 h-4 text-[#4F6BFF]" />
              <h3 className="font-bold text-slate-800 text-[14px]">Working Days</h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {config.days.map(day => (
                <label
                  key={day.id}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all duration-200 ${day.enabled ? 'border-[#4F6BFF] bg-[#F8FAFF] shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <span className={`text-[13px] font-bold ${day.enabled ? 'text-[#4F6BFF]' : 'text-slate-500'}`}>
                    {day.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(e) => dispatch(toggleDay({ name: day.name, enabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-[#4F6BFF] focus:ring-[#4F6BFF] transition-all"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Timeline Setup Section */}
          <section>
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4F6BFF]" />
                  <h3 className="font-bold text-slate-800 text-[14px]">Timeline Sequence</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start</span>
                    <input 
                        type="time"
                        value={timeInputValue}
                        onChange={handleTimeChange}
                        className="h-8 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 outline-none focus:border-[#4F6BFF] focus:ring-1 focus:ring-[#4F6BFF] transition-all"
                    />
                </div>
            </div>

            {/* DND Timeline */}
            <div className="space-y-3">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={timelineItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        {renderedItems.map(item => (
                            <SortableItem 
                                key={item.id} 
                                item={item} 
                                timeRange={item.timeRange} 
                                onDelete={handleDeleteItem} 
                                onUpdateDuration={handleUpdateDuration}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Add Buttons */}
            <div className="flex flex-col gap-3 mt-5">
                <button
                    onClick={handleAddPeriod}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D6DDF5] bg-white text-sm font-bold text-[#4F6BFF] transition-colors hover:bg-[#F8FAFF] hover:border-[#4F6BFF]/30"
                >
                    <Plus className="h-4 w-4" /> Add Academic Period
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleAddBreak(15, 'Short Break')}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-50/50 border border-orange-200 text-xs font-bold text-[#C2410C] transition-colors hover:bg-orange-100"
                    >
                        <Plus className="h-3 w-3" /> Short Break (15m)
                    </button>
                    <button
                        onClick={() => handleAddBreak(45, 'Lunch Break')}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-50/50 border border-orange-200 text-xs font-bold text-[#C2410C] transition-colors hover:bg-orange-100"
                    >
                        <Plus className="h-3 w-3" /> Lunch Break (45m)
                    </button>
                </div>
            </div>
            
          </section>

        </div>
        
        {/* Footer Actions */}
        <div className="p-6 sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-100 z-10">
            <button
                onClick={handleSaveGrid}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[15px] font-bold text-white transition-all duration-300 hover:bg-[#4338CA] hover:shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
                <Save className="h-5 w-5" />
                Apply Configuration
            </button>
        </div>
    </aside>
  );
}
