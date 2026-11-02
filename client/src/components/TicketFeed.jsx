import React, { useState } from 'react';
import TicketCard from './TicketCard';
import { 
  Filter, 
  ArrowUpDown, 
  Kanban, 
  LayoutGrid, 
  Download, 
  Search, 
  Clock, 
  ShieldCheck, 
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  Flame,
  Inbox
} from 'lucide-react';

const STAGES = [
  { stage: 1, key: "PENDING_TRIAGE", title: "1. Pending Triage", desc: "48h SLA Active", style: "border-slate-200/80 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40" },
  { stage: 2, key: "IN_REVIEW", title: "2. In Review", desc: "Desk Verified", style: "border-blue-200/60 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/20" },
  { stage: 3, key: "IN_PROGRESS", title: "3. In Progress", desc: "Field Dispatched", style: "border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/20" },
  { stage: 4, key: "WORK_COMPLETED", title: "4. Work Done", desc: "Proof Uploaded", style: "border-purple-200/60 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20" },
  { stage: 5, key: "RESOLVED_CLOSED", title: "5. Resolved", desc: "OTP Signed Off", style: "border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20" }
];

export default function TicketFeed({ 
  tickets, 
  loading, 
  onSelectTicket, 
  onUpvote,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  activeCity
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'near_me' | 'my_ward' | 'needs_upvotes' | 'closed_today' | 'critical'

  // Feature 155: Interactive Quick-Filter Pills
  const filteredTickets = tickets.filter(t => {
    if (quickFilter === 'near_me') return t.gpsAccuracyMeters <= 10;
    if (quickFilter === 'my_ward') return t.ward.includes('12') || t.ward.includes('1');
    if (quickFilter === 'needs_upvotes') return (t.priority?.uCount || 1) <= 2 && t.stage < 4;
    if (quickFilter === 'closed_today') return t.stage === 5;
    if (quickFilter === 'critical') return t.isEmergencySos || t.status === 'ESCALATED' || (t.priority?.score >= 80);
    return true;
  });

  const downloadGeoJSON = () => {
    window.open('/api/tickets/export/geojson', '_blank');
  };

  const downloadCSV = () => {
    window.open('/api/tickets/export/csv', '_blank');
  };

  const FILTER_PILLS = [
    { key: 'all', label: 'All Grievances', icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.75} /> },
    { key: 'near_me', label: 'Near Me (<10m)', icon: <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} /> },
    { key: 'my_ward', label: 'My Ward', icon: <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} /> },
    { key: 'needs_upvotes', label: 'Needs Upvotes', icon: <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} /> },
    { key: 'critical', label: 'Critical Hazards', icon: <Flame className="w-3.5 h-3.5 text-rose-500" strokeWidth={1.75} /> },
    { key: 'closed_today', label: 'Resolved Today', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.75} /> }
  ];

  return (
    <div className="space-y-4 text-xs">
      
      {/* Quick-Filter Pills Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {FILTER_PILLS.map(pill => {
          const isActive = quickFilter === pill.key;
          return (
            <button
              key={pill.key}
              onClick={() => setQuickFilter(pill.key)}
              className={`px-3 py-1.5 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap active:scale-[0.98] ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs ring-1 ring-black/5'
                  : 'bg-white dark:bg-zinc-900/90 border border-slate-200/70 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/70 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {pill.icon}
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters & View Switcher Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-slate-200/70 dark:border-zinc-800/80 p-3 sm:p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        
        {/* Department & Sort Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 dark:bg-zinc-800/60 rounded-xl px-2.5 py-1 border border-slate-200/50 dark:border-zinc-700/50">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" strokeWidth={1.75} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="All">All Departments</option>
              <option value="Roads & Infrastructure">Roads & Infrastructure</option>
              <option value="Water Supply & Sewage">Water Supply & Sewage</option>
              <option value="Solid Waste & Cleanliness">Solid Waste & Cleanliness</option>
              <option value="Electricity & Power">Electricity & Power</option>
              <option value="Public Health & Safety">Public Health & Safety</option>
              <option value="Horticulture & Urban Greenery">Horticulture & Greenery</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 dark:bg-zinc-800/60 rounded-xl px-2.5 py-1 border border-slate-200/50 dark:border-zinc-700/50">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" strokeWidth={1.75} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="priority_desc">Urgency: Highest to Lowest</option>
              <option value="sla_urgency">48-Hour SLA Expiry</option>
              <option value="upvotes_desc">Community Endorsements</option>
              <option value="date_desc">Most Recent First</option>
              <option value="date_asc">Oldest Open First</option>
            </select>
          </div>

        </div>

        {/* View Toggle & Export Actions */}
        <div className="flex items-center gap-2">
          
          {/* Grid vs Kanban Segmented Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100/80 dark:bg-zinc-800/80 rounded-xl border border-slate-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all duration-150 ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all duration-150 ${
                viewMode === 'kanban' 
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Kanban</span>
            </button>
          </div>

          {/* Export Actions */}
          <button
            onClick={downloadGeoJSON}
            title="Download GeoJSON for GIS Systems"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200/70 dark:border-zinc-700/70 hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-slate-600 dark:text-zinc-300 font-medium flex items-center gap-1 transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>

          <button
            onClick={downloadCSV}
            title="Export Overdue Tickets CSV"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200/70 dark:border-zinc-700/70 hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-slate-600 dark:text-zinc-300 font-medium flex items-center gap-1 transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">CSV</span>
          </button>

        </div>

      </div>

      {/* View Mode 1: Standard Grid Feed */}
      {viewMode === 'grid' && (
        <>
          {filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onSelect={onSelectTicket}
                  onUpvote={onUpvote}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-slate-200/70 dark:border-zinc-800/80 p-12 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-slate-400">
                <Inbox className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-slate-800 dark:text-zinc-200 text-sm">No Grievances Match Selected Filter</div>
                <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm mx-auto">
                  Try switching quick filters, changing category or exploring other city jurisdictions.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Mode 2: 5-Stage Kanban Transparency Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-4 no-scrollbar">
          {STAGES.map(col => {
            const stageTickets = filteredTickets.filter(t => t.stage === col.stage);
            return (
              <div 
                key={col.stage}
                className={`rounded-2xl border ${col.style} p-3 space-y-3 min-w-[240px] flex flex-col justify-start`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-zinc-800/60">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100">{col.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500">{col.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60 shadow-2xs">
                    {stageTickets.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket)}
                      className="bg-white dark:bg-zinc-900 rounded-xl p-3 border border-slate-200/70 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer space-y-2 text-xs transition-all duration-150"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-medium text-slate-500 dark:text-zinc-400">{ticket.id}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium text-[9px]">{ticket.ward.split('(')[0]}</span>
                      </div>
                      <h5 className="font-medium text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug">
                        {ticket.title}
                      </h5>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 pt-1 border-t border-slate-100 dark:border-zinc-800">
                        <span className="font-medium text-slate-700 dark:text-zinc-300">{ticket.priority?.priorityBadge}</span>
                        <span className="font-mono">{ticket.priority?.uCount || 1} votes</span>
                      </div>
                    </div>
                  ))}
                  {stageTickets.length === 0 && (
                    <div className="p-6 text-center text-slate-400 dark:text-zinc-600 text-xs italic">
                      Zero complaints in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
