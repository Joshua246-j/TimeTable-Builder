import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  toggleGridEditMode,
  toggleDay,
  setBreaks,
  updateTimeSlots,
  GridBreak,
  GridTimeSlot,
  updatePeriodStructure
} from "@/store/gridConfigSlice";
import { X, Clock, Plus, CalendarDays, Trash2, GripVertical, Save } from "lucide-react";
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
import { CircularTimePicker } from './CircularTimePicker';

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
      className={`rounded-2xl border transition-all ${isPeriod ? 'border-[#E5E7EB] bg-white hover:border-slate-300 hover:shadow-sm' : 'border-orange-200 bg-[#FFF9F2] hover:shadow-sm'}`}
    >
      <div className="p-[16px] flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
             <h4 className={`text-[15px] font-bold truncate pr-2 ${isPeriod ? 'text-slate-900' : 'text-[#C2410C]'}`}>
                 {isPeriod ? item.label : item.breakType}
             </h4>
             {!isPeriod && (
                <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
             )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider">{timeRange}</span>
              <div className="flex items-center gap-1.5">
                  <input 
                     type="number" 
                     value={item.durationMinutes}
                     onChange={(e) => onUpdateDuration(item.id, parseInt(e.target.value) || 0)}
                     className="w-12 text-[11px] font-semibold p-1 border border-slate-200 rounded text-center outline-none focus:border-[#4F6BFF] bg-white"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mins</span>
              </div>
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

  const handleAddBreak = () => {
    const newBreakId = `new-break-${Date.now()}`;
    setTimelineItems(items => [
      ...items,
      {
        id: newBreakId,
        type: 'BREAK',
        label: 'Custom Break',
        durationMinutes: 15,
        breakType: 'Custom Break'
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
    
    dispatch(updatePeriodStructure({ startTime, duration: config.defaultPeriodDuration, count: newTimeSlots.length }));
    dispatch(updateTimeSlots(newTimeSlots));
    dispatch(setBreaks(newBreaks));
    
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

  // Safely parse the "09:00 AM" string into a JS Date object for MUI
  const parsedStartTime = useMemo(() => {
     try {
       const d = parse(startTime, "hh:mm a", new Date());
       return isNaN(d.getTime()) ? new Date() : d;
     } catch {
       return new Date();
     }
  }, [startTime]);

  const handleTimeChange = (newValue: Date | null) => {
     if (newValue) {
        setStartTime(format(newValue, "hh:mm a"));
     }
  };

  if (!config.isGridEditMode) return null;

  return (
    <aside className="h-[90dvh] w-[360px] shrink-0 bg-white flex flex-col z-50 border-l border-[#E5E7EB] shadow-2xl">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] px-5 py-5 sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[20px] font-semibold text-slate-900">Grid Setup</h2>
              <p className="mt-1 text-sm text-slate-500">Reorder slots & breaks</p>
            </div>
            <button
              onClick={() => dispatch(toggleGridEditMode())}
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-scroll p-5 space-y-6">

          {/* Working Days Section */}
          <section>
            <div className="flex items-center gap-2 pb-3">
              <CalendarDays className="w-4 h-4 text-[#4F6BFF]" />
              <h3 className="font-semibold text-slate-900 text-[15px]">Working Days</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {config.days.map(day => (
                <label
                  key={day.id}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${day.enabled ? 'border-[#4F6BFF] bg-[#F8FAFF]' : 'border-[#E5E7EB] bg-white hover:border-slate-300'}`}
                >
                  <span className={`text-[13px] font-semibold ${day.enabled ? 'text-[#4F6BFF]' : 'text-slate-500'}`}>
                    {day.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(e) => dispatch(toggleDay({ name: day.name, enabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-[#4F6BFF] focus:ring-[#4F6BFF]"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Timeline Setup Section */}
          <section>
            <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4F6BFF]" />
                  <h3 className="font-semibold text-slate-900 text-[15px]">Timeline Config</h3>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start</label>
                    <CircularTimePicker 
                        value={parsedStartTime}
                        onChange={(d: Date) => handleTimeChange(d)}
                        className="w-[120px]"
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
            <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                    onClick={handleAddPeriod}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D6DDF5] bg-white text-sm font-medium text-[#4F6BFF] transition-colors hover:bg-[#F8FAFF]"
                >
                    <Plus className="h-4 w-4" /> Add Period
                </button>
                <button
                    onClick={handleAddBreak}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#FED7AA] bg-white text-sm font-medium text-[#C2410C] transition-colors hover:bg-[#FFF9F2]"
                >
                    <Plus className="h-4 w-4" /> Add Break
                </button>
            </div>
            
          </section>

        </div>
        
        {/* Footer Actions */}
        <div className="p-5 sticky bottom-0 bg-white border-t border-[#E5E7EB] z-10">
            <button
                onClick={handleSaveGrid}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[15px] font-bold text-white transition-all hover:bg-[#4338CA] shadow-sm"
            >
                <Save className="h-5 w-5" />
                Save Configuration
            </button>
        </div>
    </aside>
  );
}
