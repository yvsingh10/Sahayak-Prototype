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
  Flame
} from 'lucide-react';

const STAGES = [
  { stage: 1, key: "PENDING_TRIAGE", title: "1. Pending Triage", desc: "48h SLA Gate Initiated", color: "border-slate-300 bg-slate-50/50" },
  { stage: 2, key: "IN_REVIEW", title: "2. In Review", desc: "Desk Verified & Engineer Assigned", color: "border-blue-300 bg-blue-50/30" },
  { stage: 3, key: "IN_PROGRESS", title: "3. In Progress", desc: "Work Order & Field Dispatched", color: "border-amber-300 bg-amber-50/30" },
  { stage: 4, key: "WORK_COMPLETED", title: "4. Work Completed", desc: "Resolution Proof Uploaded", color: "border-purple-300 bg-purple-50/30" },
  { stage: 5, key: "RESOLVED_CLOSED", title: "5. Resolved & Closed", desc: "Citizen OTP Sign-off", color: "border-emerald-300 bg-emerald-50/30" }
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

  return (
    <div className="space-y-4 text-xs">
      
      {/* Feature 155: Interactive Quick-Filter Pills Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold whitespace-nowrap hidden sm:inline">Quick Filters (F-155):</span>
        {[
          { key: 'all', label: 'All Issues', icon: <Layers className="w-3.5 h-3.5" /> },
          { key: 'near_me', label: 'Near Me (<10m Lock)', icon: <MapPin className="w-3.5 h-3.5" /> },
          { key: 'my_ward', label: 'My Ward (Home)', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { key: 'needs_upvotes', label: 'Needs Endorsements', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { key: 'critical', label: 'Critical Hazards', icon: <Flame className="w-3.5 h-3.5 text-rose-500" /> },
          { key: 'closed_today', label: 'Resolved Today', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> }
        ].map(pill => (
          <button
            key={pill.key}
            onClick={() => setQuickFilter(pill.key)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              quickFilter === pill.key
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {pill.icon}
            <span>{pill.label}</span>
          </button>
        ))}
      </div>

      {/* Filters & View Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Departments (6)</option>
              <option value="Roads & Infrastructure">🚧 Roads & Infrastructure</option>
              <option value="Water Supply & Sewage">🚰 Water Supply & Sewage</option>
              <option value="Solid Waste & Cleanliness">🗑 Solid Waste & Cleanliness</option>
              <option value="Electricity & Power">💡 Electricity & Power</option>
              <option value="Public Health & Safety">🛡 Public Health & Safety</option>
              <option value="Horticulture & Urban Greenery">🌳 Horticulture & Greenery</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="priority_desc">Urgency: Highest to Lowest</option>
              <option value="sla_urgency">48-Hour SLA Expiry Clock</option>
              <option value="upvotes_desc">Community Endorsements</option>
              <option value="date_desc">Most Recent First</option>
              <option value="date_asc">Oldest Open First</option>
            </select>
          </div>

        </div>

        {/* View Toggle & Export Actions */}
        <div className="flex items-center gap-2">
          
          {/* Grid vs Kanban Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>5-Stage Kanban</span>
            </button>
          </div>

          {/* Export GeoJSON */}
          <button
            onClick={downloadGeoJSON}
            title="Download GeoJSON for GIS Systems"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={downloadCSV}
            title="Export Overdue Tickets CSV"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

        </div>

      </div>

      {/* View Mode 1: Standard Grid Feed */}
      {viewMode === 'grid' && (
        <>
          {filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 space-y-2">
              <Layers className="w-12 h-12 mx-auto text-slate-300" />
              <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Grievances Match Selected Filter</div>
              <p className="text-xs">Try selecting 'All Issues' or switching city jurisdiction to view other active cases.</p>
            </div>
          )}
        </>
      )}

      {/* View Mode 2: 5-Stage Kanban Transparency Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STAGES.map(col => {
            const stageTickets = filteredTickets.filter(t => t.stage === col.stage);
            return (
              <div 
                key={col.stage}
                className={`rounded-3xl border ${col.color} p-3 space-y-3 min-w-[240px] flex flex-col justify-start`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{col.title}</h4>
                    <p className="text-[10px] text-slate-500">{col.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-xs font-mono font-bold shadow-xs">
                    {stageTickets.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                  {stageTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket)}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-2xs hover:shadow-sm cursor-pointer space-y-2 text-xs transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{ticket.id}</span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold">{ticket.ward.split('(')[0]}</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                        {ticket.title}
                      </h5>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{ticket.priority?.priorityBadge}</span>
                        <span>{ticket.priority?.uCount || 1} votes</span>
                      </div>
                    </div>
                  ))}
                  {stageTickets.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs italic">
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
