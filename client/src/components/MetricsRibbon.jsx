import React from 'react';

export default function MetricsRibbon({ stats }) {
  const { 
    total = 0, 
    pendingTriage = 0, 
    inProgress = 0, 
    workCompleted = 0, 
    resolved = 0, 
    escalated = 0 
  } = stats || {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Complaints</div>
        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{total}</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Municipal Registry</div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Stage 1: Pending</div>
        <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{pendingTriage}</div>
        <div className="text-[10px] text-amber-700/70 dark:text-amber-500 mt-0.5">Under 48h SLA Clock</div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Stage 3: In Progress</div>
        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">{inProgress}</div>
        <div className="text-[10px] text-blue-700/70 dark:text-blue-500 mt-0.5">Field Crews Active</div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Stage 4: Work Done</div>
        <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">{workCompleted}</div>
        <div className="text-[10px] text-purple-700/70 dark:text-purple-500 mt-0.5">Citizen Review Stage</div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Stage 5: Resolved</div>
        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{resolved}</div>
        <div className="text-[10px] text-emerald-700/70 dark:text-emerald-500 mt-0.5">OTP Confirmed &amp; Closed</div>
      </div>

      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 shadow-sm">
        <div className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center justify-between">
          <span>Escalated / Overdue</span>
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
        </div>
        <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1 font-mono">{escalated}</div>
        <div className="text-[10px] text-rose-800/80 dark:text-rose-400 mt-0.5">Commissioner Radar</div>
      </div>

    </div>
  );
}
