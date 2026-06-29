import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  onRowClick?: (item: T) => void;
  
  // Sorting props
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;

  // Selection props
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelect?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  className = '', 
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  selectable,
  selectedIds,
  onSelect,
  onSelectAll
}: DataTableProps<T>) {
  
  const allSelected = data.length > 0 && selectedIds?.size === data.length;
  const someSelected = data.length > 0 && selectedIds && selectedIds.size > 0 && selectedIds.size < data.length;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            {selectable && (
              <th className="w-12 px-4 py-3 border-b border-slate-200">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected || false;
                  }}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </th>
            )}
            {columns.map(col => (
              <th 
                key={col.key} 
                className={`py-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider ${col.className || ''} ${col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors select-none group' : ''}`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.header}
                  {col.sortable && (
                    <span className="text-slate-400 group-hover:text-slate-600">
                      {sortKey === col.key ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            const id = keyExtractor(item);
            const isSelected = selectedIds?.has(id) || false;

            return (
              <tr 
                key={id} 
                onClick={() => onRowClick?.(item)}
                className={`border-b border-slate-100 last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''} ${isSelected ? 'bg-indigo-50/30' : ''}`}
              >
                {selectable && (
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      checked={isSelected}
                      onChange={(e) => onSelect?.(id, e.target.checked)}
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className={`py-4 ${col.className || ''}`}>
                    {col.cell(item)}
                  </td>
                ))}
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center text-sm text-slate-500 bg-slate-50/30">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400">∅</span>
                  </div>
                  <p>No data available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
