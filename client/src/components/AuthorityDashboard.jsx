import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Building2, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Layers, 
  ArrowRightLeft, 
  UserCheck, 
  FileSpreadsheet, 
  Briefcase,
  Droplets,
  Zap,
  Hammer,
  Trash2,
  Bug,
  Trees,
  Award,
  Crown,
  Share2,
  Smartphone
} from 'lucide-react';

const DEPARTMENTS = [
  "Roads & Infrastructure",
  "Water Supply & Sewage",
  "Solid Waste & Cleanliness",
  "Electricity & Power",
  "Public Health & Safety",
  "Horticulture & Urban Greenery"
];

export default function AuthorityDashboard({ 
  tickets, 
  onSelectTicket, 
  onOpenTriage, 
  onOpenProof,
  onOpenForward,
  departmentWorkload = []
}) {
  const { user, accountsData, loginAsRoleAccount, setAuthModalOpen } = useAuth();
  const [selectedDeptTab, setSelectedDeptTab] = useState('All');
  
  // Phase-3 State
  const [activeCommandCenter, setActiveCommandCenter] = useState('overview'); // 'overview' | 'contractors' | 'je_mode'
  const [contractors, setContractors] = useState([]);
  const [dmOverrideModalOpen, setDmOverrideModalOpen] = useState(false);
  const [selectedDmTicket, setSelectedDmTicket] = useState(null);
  const [dmOrderText, setDmOrderText] = useState('Emergency Public Safety Mandate — Immediate Priority Dispatch');
  const [crossDispatchModalOpen, setCrossDispatchModalOpen] = useState(false);
  const [crossTicket, setCrossTicket] = useState(null);
  const [crossSecondaryDept, setCrossSecondaryDept] = useState('Water Supply & Sewage');

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      const res = await api.getContractors();
      if (res.success) setContractors(res.contractors || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDmOverride = async () => {
    if (!selectedDmTicket) return;
    try {
      const res = await api.dmOverride(selectedDmTicket.id, {
        executiveOrder: dmOrderText,
        fundAllocation: "₹85,000 Special Municipal Contingency Fund",
        actor: user
      });
      if (res.success) {
        alert("DM Master Override successfully executed! Ticket elevated to top priority.");
        setDmOverrideModalOpen(false);
        window.location.reload();
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleCrossDispatch = async () => {
    if (!crossTicket) return;
    try {
      const res = await api.crossDispatch(crossTicket.id, {
        secondaryDepartment: crossSecondaryDept,
        reason: "Dual infrastructure repair required: pipe joint excavation under road carriageway.",
        actor: user
      });
      if (res.success) {
        alert(`Cross-dispatch active with ${crossSecondaryDept}! Dual work orders issued.`);
        setCrossDispatchModalOpen(false);
        window.location.reload();
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  if (!user || user.role === 'citizen') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 mx-auto flex items-center justify-center text-2xl shadow-inner">
          🏛
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Municipal Authority Portals</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access restricted to verified Desk Officers, Field Verification Crews, Ward Engineers, and Nodal Municipal Commissioners.
        </p>
        <button 
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
        >
          Select Authority Role &rarr;
        </button>
      </div>
    );
  }

  const isCommissioner = user.role === 'commissioner';
  const isWardEngineer = user.role === 'ward_engineer';
  const isFieldCrew = user.role === 'field_crew';

  let authTickets = tickets.filter(t => {
    const matchesCity = t.city === user.city;
    if (isCommissioner || isWardEngineer) return matchesCity;
    return matchesCity && (user.dept === 'All Departments' || t.category === user.dept);
  });

  if (selectedDeptTab !== 'All') {
    authTickets = authTickets.filter(t => t.category === selectedDeptTab);
  }

  return (
    <div className="space-y-6 text-xs">
      
      {/* Officer Jurisdiction Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase font-mono">
              {user.role === 'commissioner' ? 'Master Executive Oversight' :
               user.role === 'ward_engineer' ? 'Ward Engineering Circle' :
               user.role === 'field_crew' ? 'Field Verification Squad' : 'Departmental Desk Portal'}
            </span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              ● Live Jurisdiction: {user.city}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase font-mono">
              Features 141–150 Active
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white">{user.title}</h2>
          <p className="text-slate-300 font-medium">
            Officer: {user.name} · {user.email} · {user.dept}
          </p>
        </div>

        {/* Quick Role Persona Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Switch Persona:</span>
          <select 
            value={`${user.city}|${user.role}|${user.roleKey}`}
            onChange={(e) => {
              const [c, r, rk] = e.target.value.split('|');
              const acc = accountsData.allAccounts?.find(a => a.city === c && a.role === r && a.roleKey === rk);
              if (acc) loginAsRoleAccount(acc);
            }}
            className="py-2 px-3 text-xs font-semibold bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {accountsData.allAccounts?.map(a => (
              <option key={`${a.city}|${a.role}|${a.roleKey}`} value={`${a.city}|${a.role}|${a.roleKey}`}>
                {a.city} — {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 gap-1">
        <button
          onClick={() => setActiveCommandCenter('overview')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeCommandCenter === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Action Queue &amp; Triage
        </button>
        <button
          onClick={() => setActiveCommandCenter('contractors')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCommandCenter === 'contractors' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Contractor SLA Scorecards (F-148)</span>
        </button>
        <button
          onClick={() => setActiveCommandCenter('je_mode')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCommandCenter === 'je_mode' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>JE Mobile Touch Desk (F-149)</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & QUEUE */}
      {activeCommandCenter === 'overview' && (
        <div className="space-y-5">
          
          {/* 6 Dedicated Departmental Command Consoles (Features 141–146) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Water Supply", icon: <Droplets className="w-4 h-4 text-blue-500" />, desc: "Burst Pipes & Tankers", code: "F-141" },
              { name: "Electricity", icon: <Zap className="w-4 h-4 text-amber-500" />, desc: "11kV Lines & Transformers", code: "F-142" },
              { name: "Roads & Highways", icon: <Hammer className="w-4 h-4 text-orange-500" />, desc: "Hot-Mix Asphalt Orders", code: "F-143" },
              { name: "Solid Waste", icon: <Trash2 className="w-4 h-4 text-emerald-500" />, desc: "Compactor Fleet Routes", code: "F-144" },
              { name: "Vector Control", icon: <Bug className="w-4 h-4 text-rose-500" />, desc: "Anti-Larval Fogging", code: "F-145" },
              { name: "Urban Greenery", icon: <Trees className="w-4 h-4 text-teal-500" />, desc: "Fallen Tree Removal", code: "F-146" }
            ].map((dept, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  {dept.icon}
                  <span className="truncate">{dept.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{dept.code}</div>
                <div className="text-[10px] text-slate-500">{dept.desc}</div>
              </div>
            ))}
          </div>

          {/* Department Filter Selector */}
          <div className="flex space-x-1 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedDeptTab('All')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${selectedDeptTab === 'All' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-100'}`}
            >
              All Divisions
            </button>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDeptTab(dept)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${selectedDeptTab === dept ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-100'}`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Action Queue List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Active Resolution Queue</h3>
                <p className="text-slate-500 text-[11px]">Strict 5-stage pipeline actions assigned to your circle</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 font-mono">
                {authTickets.length} Complaints
              </span>
            </div>

            {authTickets.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {authTickets.map(ticket => {
                  const prio = ticket.priority || { score: 40 };
                  const sla = ticket.sla || { formattedCountdown: "48h left", isBreached: false };

                  return (
                    <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-blue-600">{ticket.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === 'ESCALATED' ? 'bg-rose-600 text-white animate-pulse' :
                            ticket.stage === 4 ? 'bg-purple-100 text-purple-800' :
                            ticket.stage === 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            Stage {ticket.stage}: {ticket.status}
                          </span>
                          <span className="text-slate-500">{ticket.category}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ticket.title}</h4>
                        <p className="text-slate-500">📍 {ticket.location} ({ticket.ward}) · Complainant: {ticket.complainant}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* DM Override Button (Feature 150) */}
                        <button
                          onClick={() => {
                            setSelectedDmTicket(ticket);
                            setDmOverrideModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 font-bold hover:bg-amber-100 flex items-center gap-1"
                        >
                          <Crown className="w-3.5 h-3.5 text-amber-600" />
                          <span>DM Override (F-150)</span>
                        </button>

                        {/* Multi-Dept Cross Dispatch (Feature 147) */}
                        <button
                          onClick={() => {
                            setCrossTicket(ticket);
                            setCrossDispatchModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold hover:bg-indigo-100 flex items-center gap-1"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Cross-Dispatch (F-147)</span>
                        </button>

                        {ticket.stage === 1 && (
                          <button
                            onClick={() => onOpenTriage(ticket)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                          >
                            Triage &amp; Assign
                          </button>
                        )}

                        {(ticket.stage === 2 || ticket.stage === 3) && (
                          <button
                            onClick={() => onOpenProof(ticket)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-xs flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Proof</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSelectTicket(ticket)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">Queue clear for your division!</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACTOR SLA SCORECARDS (Feature 148) */}
      {activeCommandCenter === 'contractors' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Contractor SLA Performance Scorecards</h3>
              <p className="text-slate-500 text-[11px]">Enforceable grading based on on-time repair metrics, penalty ledger, and citizen sign-offs</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
              Statutory 48h SLA Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractors.map(c => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{c.id}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                    <span className="text-slate-500 text-[11px]">{c.department}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600 font-mono">{c.onTimeRate}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">On-Time Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-center">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{c.avgRepairHours}h</div>
                    <div className="text-[10px] text-slate-500">Avg Repair</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{c.activeTickets}</div>
                    <div className="text-[10px] text-slate-500">Active Jobs</div>
                  </div>
                  <div>
                    <div className="font-bold text-rose-600 font-mono">{c.penaltiesLevied}</div>
                    <div className="text-[10px] text-slate-500">Penalties</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: JE MOBILE TOUCH DESK (Feature 149) */}
      {activeCommandCenter === 'je_mode' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-5 max-w-xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-base">Junior Engineer (JE) Mobile Field Desk</h3>
                <p className="text-[10px] text-slate-400">Optimized for on-site phone touchscreen inspections</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              GPS GEO-SYNC
            </span>
          </div>

          <div className="space-y-3">
            {authTickets.slice(0, 3).map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-400 font-bold">{t.id}</span>
                  <span className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded">Stage {t.stage}</span>
                </div>
                <div className="font-bold text-sm">{t.title}</div>
                <p className="text-slate-400 text-[11px]">📍 {t.location}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onOpenProof(t)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Work Order On-Site</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature 150: District Magistrate Master Override Modal */}
      {dmOverrideModalOpen && selectedDmTicket && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full space-y-4 border border-amber-300 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
                <Crown className="w-5 h-5 text-amber-600" />
                <span>District Magistrate Master Override (F-150)</span>
              </div>
              <button onClick={() => setDmOverrideModalOpen(false)}>✕</button>
            </div>
            <p className="text-slate-500 text-xs">
              Exercise executive statutory authority to reassign priority, fast-track emergency contingency funding, and bypass standard queuing.
            </p>
            <div>
              <label className="block font-semibold mb-1">Executive Order Text</label>
              <textarea
                value={dmOrderText}
                onChange={(e) => setDmOrderText(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
            <button
              onClick={handleDmOverride}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
            >
              Execute Master Override &amp; Allocate Funds
            </button>
          </div>
        </div>
      )}

      {/* Feature 147: Multi-Department Cross Dispatch Modal */}
      {crossDispatchModalOpen && crossTicket && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full space-y-4 border border-indigo-300 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200 text-sm">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                <span>Multi-Department Cross-Dispatch (F-147)</span>
              </div>
              <button onClick={() => setCrossDispatchModalOpen(false)}>✕</button>
            </div>
            <p className="text-slate-500 text-xs">
              Primary division: <strong>{crossTicket.category}</strong>. Select secondary utility partner for joint field dispatch:
            </p>
            <select
              value={crossSecondaryDept}
              onChange={(e) => setCrossSecondaryDept(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
            >
              {DEPARTMENTS.filter(d => d !== crossTicket.category).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <button
              onClick={handleCrossDispatch}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
            >
              Issue Dual Municipal Work Orders
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
