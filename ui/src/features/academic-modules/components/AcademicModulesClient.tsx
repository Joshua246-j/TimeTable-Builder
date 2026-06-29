"use client";

import React, { useEffect, useState, useMemo } from "react";
import { subjectService } from "@/services/subjectService";
import { SubjectCardData } from "@/types/timetable";
import { MetricCard, DataTable, ColumnDef } from "@/components/shared";
import { BookOpen, Users, CheckCircle2, Clock, Plus, Upload, Download, Settings2, MoreHorizontal, LayoutDashboard, Search, Filter, Trash2, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AcademicModulesClient() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("code");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>("asc");

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await subjectService.getSubjects();
        setSubjects(Object.values(data));
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  // Calculate metrics based on total data (unfiltered)
  const totalSubjects = subjects.length;
  const activeSubjects = subjects.length; // Mock all as active for now
  const totalCredits = subjects.reduce((sum, s) => sum + (s.credits || 3), 0);
  const withoutFaculty = subjects.filter(s => !s.facultyName).length;

  // Filter & Sort Logic
  const filteredAndSortedSubjects = useMemo(() => {
    let result = [...subjects];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        (s.code && s.code.toLowerCase().includes(q)) || 
        (s.subjectName && s.subjectName.toLowerCase().includes(q)) ||
        (s.facultyName && s.facultyName.toLowerCase().includes(q))
      );
    }

    // Filters (Mocking department since it's not strictly in the type yet)
    if (departmentFilter !== "All") {
      // Just a mock implementation. We could check s.department if it existed.
    }

    // Sort
    result.sort((a: any, b: any) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [subjects, searchQuery, departmentFilter, statusFilter, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    const newSet = new Set(selectedIds);
    if (selected) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(filteredAndSortedSubjects.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };
  
  const columns: ColumnDef<SubjectCardData>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      cell: (item) => <span className="font-semibold text-slate-900">{item.code || "CS301"}</span>,
    },
    {
      key: "subjectName",
      header: "Subject Name",
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.subjectName}</div>
          <div className="text-xs text-slate-500">{item.type || "Theory"}</div>
        </div>
      ),
    },
    {
      key: "credits",
      header: "Credits",
      sortable: true,
      cell: (item) => <span className="text-slate-600 font-medium">{item.credits || 3}</span>,
    },
    {
      key: "department",
      header: "Department",
      cell: () => <span className="text-slate-600">CSE</span>, // Mocked for now
    },
    {
      key: "facultyName",
      header: "Faculty",
      sortable: true,
      cell: (item) => (
        <span className={item.facultyName ? "text-slate-900 font-medium" : "text-slate-400 italic"}>
          {item.facultyName || "Unassigned"}
        </span>
      ),
    },
    {
      key: "roomName",
      header: "Default Room",
      sortable: true,
      cell: (item) => <span className="text-slate-600">{item.roomName || "-"}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 font-inter shadow-md border-slate-200">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/academic-modules/${item.id}`); }} className="text-[13px] font-semibold cursor-pointer">
              <LayoutDashboard className="w-4 h-4 mr-2 text-indigo-500" />
              Open Workspace
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/academic-modules/${item.id}/settings`); }} className="text-[13px] font-semibold cursor-pointer">
              <Settings2 className="w-4 h-4 mr-2 text-slate-500" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F8FC] p-8 font-inter overflow-y-auto">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Modules</h1>
          <p className="text-[14px] text-slate-500 mt-1">Manage and monitor all subjects across the institution.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Subjects"
            value={totalSubjects.toString()}
            subtitle="Across all semesters"
            icon={<BookOpen className="h-6 w-6 text-indigo-500" />}
            className="border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white"
          />
          <MetricCard
            title="Active Subjects"
            value={activeSubjects.toString()}
            subtitle="Currently in session"
            icon={<CheckCircle2 className="h-6 w-6 text-emerald-500" />}
            className="border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white"
          />
          <MetricCard
            title="Total Credits"
            value={totalCredits.toString()}
            subtitle="Academic weight"
            icon={<Clock className="h-6 w-6 text-orange-500" />}
            className="border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white"
          />
          <MetricCard
            title="Unassigned Faculty"
            value={withoutFaculty.toString()}
            subtitle="Subjects needing faculty"
            icon={<Users className="h-6 w-6 text-rose-500" />}
            className="border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white"
          />
        </div>

        {/* Subject Management Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          
          <div className="p-6 border-b border-slate-200 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">Subject Management</h2>
                <p className="text-[13px] text-slate-500">View and manage all academic subjects.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <Upload className="w-4 h-4 text-slate-500" />
                  Import
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <Download className="w-4 h-4 text-slate-500" />
                  Export
                </button>
                <button 
                  onClick={() => router.push("/dashboard/academic-modules/new")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Subject
                </button>
              </div>
            </div>

            {/* Toolbar (Search, Filter, Bulk Actions) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-1 items-center gap-3 w-full">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by code, name, or faculty..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 bg-indigo-50 px-4 py-1.5 rounded-lg border border-indigo-100">
                  <span className="text-[12px] font-bold text-indigo-700">{selectedIds.size} selected</span>
                  <div className="w-px h-4 bg-indigo-200"></div>
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 hover:text-slate-900">
                    <Archive className="w-3.5 h-3.5" /> Archive
                  </button>
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold text-rose-600 hover:text-rose-700">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[13px] text-slate-500 font-medium">Loading subjects...</span>
              </div>
            ) : (
              <DataTable 
                data={filteredAndSortedSubjects}
                columns={columns}
                keyExtractor={(item) => item.id}
                onRowClick={(item) => router.push(`/dashboard/academic-modules/${item.id}`)}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                selectable={true}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                className="px-2"
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
