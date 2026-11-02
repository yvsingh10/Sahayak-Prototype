import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ArrowUp, 
  Building2, 
  Award, 
  ShieldAlert, 
  Flame,
  CheckCircle2
} from 'lucide-react';

function getPriorityChip(score) {
  if (score >= 100) return { label: 'Critical Hazard', color: 'bg-rose-600 text-white font-extrabold animate-pulse' };
  if (score >= 80)  return { label: 'High Urgency', color: 'bg-orange-500 text-white font-bold' };
  if (score >= 55)  return { label: 'Elevated Priority', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  return { label: 'Normal Maintenance', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
}

export default function Leaderboard({ tickets, onSelectTicket, wardRankings = [] }) {
  const sorted = [...tickets].sort((a, b) => (b.priority?.score || 0) - (a.priority?.score || 0));

  return (
    <div className="space-y-6">

      {/* Hero Banner (Clean UI Directive: No mathematical formulas) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl border border-slate-800">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30 uppercase tracking-widest font-mono">
              Live Civic Urgency Meter
            </span>
            <span className="text-xs text-slate-400">Continuous Dynamic Prioritization</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Civic Urgency &amp; Resolution Leaderboard
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Every grievance is prioritized in real-time by community endorsement volume, verified physical severity, and elapsed time since lodging. Critical hazards bubble to the top to ensure swift municipal resolution.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
              <div className="text-2xl font-black text-emerald-400">{tickets.length}</div>
              <div className="text-slate-400 mt-0.5">Active Grievances</div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
              <div className="text-2xl font-black text-rose-400">
                {tickets.filter(t => (t.priority?.score || 0) >= 100 || t.status === 'ESCALATED').length}
              </div>
              <div className="text-slate-400 mt-0.5">Critical / Escalated</div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
              <div className="text-2xl font-black text-amber-400">
                {tickets.reduce((s, t) => s + (t.priority?.uCount || 1), 0)}
              </div>
              <div className="text-slate-400 mt-0.5">Total Upvotes</div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-center">
              <div className="text-2xl font-black text-blue-400">
                {tickets.filter(t => t.stage === 5 || t.status === 'Resolved').length}
              </div>
              <div className="text-slate-400 mt-0.5">Resolved &amp; Closed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 76: Ward Hall of Fame & Shame */}
      {wardRankings && wardRankings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Hall of Fame */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Ward Hall of Fame (Top Municipal Performers)</span>
            </div>
            <div className="space-y-2 text-xs">
              {wardRankings.filter(w => w.isHallOfFame).slice(0, 3).map(w => (
                <div key={w.ward} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{w.ward}</div>
                    <div className="text-[11px] text-slate-500">{w.city} Municipal Zone</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {w.resolutionRate}% Resolved
                    </span>
                    <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">Zero SLA Breaches</div>
                  </div>
                </div>
              ))}
              {wardRankings.filter(w => w.isHallOfFame).length === 0 && (
                <div className="p-3 text-slate-500 italic text-center">All wards currently in progress.</div>
              )}
            </div>
          </div>

          {/* Hall of Shame */}
          <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Ward Accountability Watchlist (Delayed / Overdue)</span>
            </div>
            <div className="space-y-2 text-xs">
              {wardRankings.filter(w => w.isHallOfShame).slice(0, 3).map(w => (
                <div key={w.ward} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-rose-900 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{w.ward}</div>
                    <div className="text-[11px] text-slate-500">{w.city} Municipal Zone</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
                      {w.escalated} Escalated Tickets
                    </span>
                    <div className="text-[10px] text-rose-600 mt-0.5 font-semibold">Under Commissioner Review</div>
                  </div>
                </div>
              ))}
              {wardRankings.filter(w => w.isHallOfShame).length === 0 && (
                <div className="p-3 text-emerald-600 font-semibold text-center">Zero overdue wards! Excellent compliance.</div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Ranked Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Ranked Civic Urgency Index
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any record to inspect telemetry, office routes and evidence</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Top Tickets Automatically Bind Zonal Engineers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Issue Details</th>
                <th className="py-3 px-4">Department &amp; Ward</th>
                <th className="py-3 px-4">Urgency Level</th>
                <th className="py-3 px-4">Community Endorsements</th>
                <th className="py-3 px-4">SLA Clock</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sorted.map((ticket, index) => {
                const prio = ticket.priority || { score: 40, priorityBadge: "Normal Maintenance" };
                const sla = ticket.sla || { formattedCountdown: "48h left", isBreached: false };
                const chip = getPriorityChip(prio.score);

                return (
                  <tr 
                    key={ticket.id} 
                    onClick={() => onSelectTicket(ticket)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">
                      #{index + 1}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{ticket.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{ticket.id} · {ticket.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{ticket.category}</div>
                      <div className="text-[11px] text-slate-500">{ticket.ward}, {ticket.city}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${chip.color}`}>
                        {chip.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>{prio.uCount || 1} Citizens</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${sla.slaBadgeClass || 'bg-slate-100 text-slate-800'}`}>
                        {sla.slaBadgeText || sla.formattedCountdown}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(ticket);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
