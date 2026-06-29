"use client";

import { X, AlertTriangle, AlertCircle, Wrench } from "lucide-react";
import { ValidationIssue } from "@/services/validationService";

interface ConflictDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: ValidationIssue[];
}

export default function ConflictDrawer({ isOpen, onClose, conflicts }: ConflictDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Scheduling Conflicts</h2>
              <p className="text-sm font-medium text-red-500">{conflicts.length} Issues Detected</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {conflicts.length === 0 ? (
            <div className="text-center py-10">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-bold text-slate-900">All Clear!</h3>
              <p className="text-sm text-slate-500">No conflicts detected in the current schedule.</p>
            </div>
          ) : (
            conflicts.map((conflict) => (
              <div key={conflict.id} className="bg-white rounded-xl p-4 border border-red-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500"></div>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-red-600 text-sm flex items-center gap-2">
                    {conflict.conflictType || 'Conflict'}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-1 bg-red-50 text-red-600 rounded">
                    URGENT
                  </span>
                </div>
                
                <p className="text-sm text-slate-700 font-medium mb-3 leading-snug">
                  {conflict.message}
                </p>

                {(conflict.affectedSubject || conflict.affectedTeacher || conflict.affectedRoom || conflict.affectedTime) && (
                  <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 border border-slate-100">
                    {conflict.affectedSubject && (
                      <div className="flex text-xs">
                        <span className="w-16 text-slate-500 font-medium">Subject</span>
                        <span className="font-bold text-slate-800">{conflict.affectedSubject}</span>
                      </div>
                    )}
                    {conflict.affectedTeacher && (
                      <div className="flex text-xs">
                        <span className="w-16 text-slate-500 font-medium">Teacher</span>
                        <span className="font-bold text-slate-800">{conflict.affectedTeacher}</span>
                      </div>
                    )}
                    {conflict.affectedRoom && (
                      <div className="flex text-xs">
                        <span className="w-16 text-slate-500 font-medium">Room</span>
                        <span className="font-bold text-slate-800">{conflict.affectedRoom}</span>
                      </div>
                    )}
                    {conflict.affectedTime && (
                      <div className="flex text-xs mt-2 pt-2 border-t border-slate-200">
                        <span className="w-16 text-slate-500 font-medium">Time</span>
                        <span className="font-bold text-indigo-600">{conflict.affectedTime}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                   <button className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                     <Wrench className="h-3 w-3" /> Auto Fix
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
