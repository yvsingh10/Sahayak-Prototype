import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Download, 
  FileText, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Users,
  Flame
} from 'lucide-react';

export default function PenaltyTracker() {
  const [data, setData] = useState({
    summary: { overdueCount: 1, totalPenalties: 45000, complianceRate: 92.6, avgTriageLatencyHours: 19.4 },
    breakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPenalties().then(res => {
      if (res.success) {
        setData(res);
      }
    }).finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    window.open('/api/tickets/export/csv', '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* SLA Clause Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white border border-rose-900/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-400/30 uppercase font-mono">
              Enforceable Municipal Accountability
            </span>
            <span className="text-xs text-rose-400 font-semibold">Section 48-B Local Self-Govt Act</span>
          </div>
          <h2 className="text-xl font-bold">48-Hour SLA Gateway &amp; Officer Penalty Ledger</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unassigned complaints past the 48-hour gate automatically trigger Tier-1 escalation to Ward Engineers. After 96 hours, tickets escalate to the Municipal Commissioner, with delayed hours debited against departmental administrative registers.
          </p>
        </div>

        <button
          onClick={downloadCSV}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Overdue Audit (CSV)</span>
        </button>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Overdue Breaches</div>
          <div className="text-3xl font-black text-rose-600 font-mono">{data.summary.overdueCount}</div>
          <div className="text-[11px] text-slate-400">&gt;48h Without Desk Triage</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Aggregate Fines Levied</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            ₹{data.summary.totalPenalties.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Escalated to Commissioner</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Average Triage Latency</div>
          <div className="text-3xl font-black text-amber-500 font-mono">{data.summary.avgTriageLatencyHours} hrs</div>
          <div className="text-[11px] text-slate-400">Target: &lt;24h Safe Boundary</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">SLA Compliance Rate</div>
          <div className="text-3xl font-black text-emerald-600 font-mono">{data.summary.complianceRate}%</div>
          <div className="text-[11px] text-slate-400">Triaged Within 48h Window</div>
        </div>

      </div>

      {/* Enforceable Breaches Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Active SLA Breach &amp; Officer Service Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated penalty deductions calculated under municipal performance regulations</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold font-mono">
            {data.breakdown.length} Escalated Cases
          </span>
        </div>

        {data.breakdown.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Department &amp; Officer</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4">Overdue Latency</th>
                  <th className="py-3 px-4">Escalation Tier</th>
                  <th className="py-3 px-4">Penalty Fine</th>
                  <th className="py-3 px-4">Enforcement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.breakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.ticketId}
                      <div className="text-[11px] text-slate-500 font-sans font-normal truncate max-w-xs">{item.title}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{item.department}</div>
                      <div className="text-[11px] text-slate-500">{item.officer}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {item.ward}, {item.city}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">
                      +{item.hoursOverdue} hrs
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                        {item.escalationTier}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-rose-700 dark:text-rose-400">
                      {item.fineLevied}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      {item.actionRequired}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No unresolved SLA breaches at this moment! All municipal officers are compliant.
          </div>
        )}
      </div>

    </div>
  );
}
