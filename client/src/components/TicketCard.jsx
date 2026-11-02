import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  MapPin, 
  ArrowUp, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Building2, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Navigation,
  Thermometer,
  BadgeCheck,
  Compass
} from 'lucide-react';

const CATEGORY_COLORS = {
  "Roads & Infrastructure": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  "Water Supply & Sewage": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  "Solid Waste & Cleanliness": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  "Electricity & Power": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
  "Public Health & Safety": "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
};

const STAGE_LABELS = {
  1: { label: "Stage 1: Pending Triage", color: "bg-slate-100 text-slate-800 border-slate-200" },
  2: { label: "Stage 2: In Review", color: "bg-blue-100 text-blue-800 border-blue-200" },
  3: { label: "Stage 3: In Progress", color: "bg-amber-100 text-amber-800 border-amber-200" },
  4: { label: "Stage 4: Work Completed", color: "bg-purple-100 text-purple-800 border-purple-200" },
  5: { label: "Stage 5: Resolved & Closed", color: "bg-emerald-100 text-emerald-800 border-emerald-200" }
};

export default function TicketCard({ ticket, onSelect, onUpvote }) {
  const { user } = useAuth();
  const [showMiniMap, setShowMiniMap] = useState(false);

  const isVoted = user && ticket.upvotedBy && ticket.upvotedBy.includes(user.cuid || user.id);
  const prio = ticket.priority || { score: 40, priorityBadge: "Normal Maintenance", urgencyPercent: 35 };
  const sla = ticket.sla || { formattedCountdown: '48h left', isBreached: false };

  const isCritical = prio.score >= 100 || ticket.status === 'ESCALATED' || ticket.isEmergencySos;

  // Feature 154: Humanized SLA countdown
  const getHumanizedSla = () => {
    if (ticket.stage >= 4) return "Work Done ✓";
    if (sla.isBreached) return "Overdue by 4h — Tier-1 Escalated";
    return sla.formattedCountdown;
  };

  return (
    <div 
      onClick={() => onSelect(ticket)}
      className={`group relative bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-200 hover:shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between text-xs ${
        isCritical 
          ? 'border-rose-400 dark:border-rose-800 shadow-sm shadow-rose-500/10' 
          : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
      }`}
    >
      {/* Top Banner Accent for Critical Breaches */}
      {isCritical && (
        <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white text-[10px] font-extrabold px-3.5 py-1.5 flex items-center justify-between uppercase tracking-wider font-mono">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            {ticket.isEmergencySos ? "EMERGENCY SOS DISASTER PROTOCOL" : "CRITICAL HAZARD — AUTO-ESCALATED"}
          </span>
          <span>48H SLA GATEWAY</span>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-3 flex-1">
        
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {ticket.id}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${CATEGORY_COLORS[ticket.category] || 'bg-slate-100 text-slate-800'}`}>
              {ticket.category}
            </span>
          </div>

          {/* 5-Stage Status Chip */}
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            STAGE_LABELS[ticket.stage]?.color || 'bg-slate-100 text-slate-800'
          }`}>
            {STAGE_LABELS[ticket.stage]?.label || ticket.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {ticket.title}
        </h3>

        {/* Feature 156: Location with Card Hover Mini-Map Preview */}
        <div 
          onMouseEnter={() => setShowMiniMap(true)}
          onMouseLeave={() => setShowMiniMap(false)}
          className="relative text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{ticket.location} · {ticket.ward}, {ticket.city}</span>

          {/* Mini-Map Popup Snapshot */}
          {showMiniMap && (
            <div className="absolute top-6 left-0 z-30 p-2.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 w-56 animate-in fade-in zoom-in-95">
              <div className="font-bold text-[11px] flex items-center justify-between">
                <span>Geospatial Pin (F-156)</span>
                <span className="text-emerald-400 font-mono text-[9px]">&lt;15m Lock</span>
              </div>
              <div className="h-20 w-full bg-slate-800 rounded-lg my-1.5 overflow-hidden relative flex items-center justify-center">
                <img 
                  src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80`} 
                  alt="Satellite Mini-Map" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute w-4 h-4 rounded-full bg-red-600 border-2 border-white animate-ping"></div>
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                Lat: {ticket.lat?.toFixed(4)}, Lng: {ticket.lng?.toFixed(4)}
              </div>
            </div>
          )}
        </div>

        {/* Feature 153: Urgency Thermometer Progress Meter (Zero Formulas) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Thermometer className={`w-3.5 h-3.5 ${prio.score >= 80 ? 'text-rose-600' : 'text-blue-500'}`} />
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                prio.score >= 100 ? 'bg-rose-100 text-rose-800' :
                prio.score >= 80 ? 'bg-orange-100 text-orange-800' :
                prio.score >= 55 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {prio.priorityBadge}
              </span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {prio.riskLevel}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                prio.score >= 100 ? 'bg-rose-600' :
                prio.score >= 80  ? 'bg-orange-500' :
                prio.score >= 55  ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${prio.urgencyPercent}%` }}
            />
          </div>
        </div>

        {/* Feature 154: Humanized SLA Countdown Badge */}
        <div className="pt-1 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border ${sla.slaBadgeClass || 'bg-slate-50 text-slate-700'}`}>
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>{getHumanizedSla()}</span>
          </span>

          {ticket.politicalEndorsement && (
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-200">
              MLA Endorsed
            </span>
          )}
        </div>

        {/* Photo Evidence Thumbnail Preview */}
        {ticket.photoUrl && (
          <div className="pt-1">
            <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img 
                src={ticket.photoUrl} 
                alt="Civic Problem" 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {ticket.resolutionProof && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] shadow">
                  Repaired ✓
                </span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Card Footer: Upvote & Quick Info */}
      <div className="p-3 sm:px-5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(ticket.id);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold text-xs transition-all ${
            isVoted 
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>{isVoted ? 'Endorsed' : 'Upvote'} ({prio.uCount})</span>
        </button>

        <span className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
          By: {ticket.complainantId || ticket.complainant}
        </span>
      </div>
    </div>
  );
}
