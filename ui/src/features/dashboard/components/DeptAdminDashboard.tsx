import React from 'react';

export function DeptAdminDashboard() {
  return (
    <div className="flex flex-col h-full w-full bg-[#F7F8FC] p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Department Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Faculty</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Programs</h3>
          <p className="text-3xl font-bold text-[#5A67D8] mt-2">6</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Average Attendance</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">94%</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex-1 flex items-center justify-center">
        <p className="text-slate-400">Department Analytics Charts will go here</p>
      </div>
    </div>
  );
}
