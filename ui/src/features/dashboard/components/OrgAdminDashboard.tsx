import React from 'react';

export function OrgAdminDashboard() {
  return (
    <div className="flex flex-col h-full w-full bg-[#F7F8FC] p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Organization Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Institutions</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Students</h3>
          <p className="text-3xl font-bold text-[#5A67D8] mt-2">15,432</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">$2.4M</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex-1 flex items-center justify-center">
        <p className="text-slate-400">Organization Analytics Charts will go here</p>
      </div>
    </div>
  );
}
