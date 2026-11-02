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
  Compass,
  Sparkles,
  Share2
} from 'lucide-react';

const CATEGORY_STYLES = {
  "Roads & Infrastructure": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  "Water Supply & Sewage": "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  "Solid Waste & Cleanliness": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  "Electricity & Power": "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  "Public Health & Safety": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
};

const STAGE_STYLES = {
  1: { label: "Pending Triage", style: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20" },
  2: { label: "In Review", style: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  3: { label: "In Progress", style: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  4: { label: "Work Completed", style: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" },
  5: { label: "Resolved", style: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" }
};

export default function TicketCard({ ticket, onSelect, onUpvote }) {
  const { user } = useAuth();
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [copied, setCopied] = useState(false);

  const isVoted = user && ticket.upvotedBy && ticket.upvotedBy.includes(user.cuid || user.id);
  const prio = ticket.priority || { score: 40, priorityBadge: "Normal Maintenance", urgencyPercent: 35 };
  const sla = ticket.sla || { formattedCountdown: '48h left', isBreached: false };

  const isCritical = prio.score >= 100 || ticket.status === 'ESCALATED' || ticket.isEmergencySos;

  // Feature 154: Humanized SLA countdown
  const getHumanizedSla = () => {
    if (ticket.stage >= 4) return "Work Done ✓";
    if (sla.isBreached) return "Overdue · Escalated";
    return sla.formattedCountdown;
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#ticket-${ticket.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      onClick={() => onSelect(ticket)}
      className={`group relative rounded-2xl bg-white dark:bg-zinc-900/90 border transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer overflow-hidden flex flex-col justify-between text-xs ring-1 ring-black/[0.02] dark:ring-white/[0.02] ${
        isCritical 
          ? 'border-rose-400/60 dark:border-rose-800/60 shadow-[0_4px_20px_-2px_rgba(244,63,94,0.12)]' 
          : 'border-slate-200/70 dark:border-zinc-800/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.02)] hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.07)]'
      }`}
    >
      {/* Top Banner Accent for Critical Breaches */}
      {isCritical && (
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white text-[10px] font-semibold px-3.5 py-1.5 flex items-center justify-between tracking-wide font-mono">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{ticket.isEmergencySos ? "EMERGENCY SOS PROTOCOL" : "CRITICAL HAZARD · AUTO-ESCALATED"}</span>
          </span>
          <span className="text-[9px] uppercase tracking-wider opacity-90">48h SLA</span>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-3.5 flex-1">
        
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-medium text-slate-600 dark:text-zinc-400 bg-slate-100/80 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-zinc-700/60">
              {ticket.id}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${CATEGORY_STYLES[ticket.category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {ticket.category}
            </span>
          </div>

          {/* 5-Stage Status Chip */}
          <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${
            STAGE_STYLES[ticket.stage]?.style || 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {STAGE_STYLES[ticket.stage]?.label || ticket.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm sm:text-[15px] leading-snug tracking-tight text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {ticket.title}
        </h3>

        {/* Location with Card Hover Mini-Map Preview */}
        <div 
          onMouseEnter={() => setShowMiniMap(true)}
          onMouseLeave={() => setShowMiniMap(false)}
          className="relative text-xs text-slate-500 dark:text-zinc-400 flex items-start gap-1.5 group/loc"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-500/90 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
          <span className="line-clamp-1 group-hover/loc:text-slate-800 dark:group-hover/loc:text-zinc-200 transition-colors">
            {ticket.location} · {ticket.ward}, {ticket.city}
          </span>

          {/* Mini-Map Popup Snapshot */}
          {showMiniMap && (
            <div className="absolute top-6 left-0 z-30 p-3 bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-zinc-700/80 w-60 animate-in fade-in zoom-in-95 duration-150">
              <div className="font-medium text-[11px] flex items-center justify-between pb-1.5 border-b border-zinc-800">
                <span className="text-zinc-300">Geospatial Telemetry</span>
                <span className="text-emerald-400 font-mono text-[9px]">&lt;15m Lock</span>
              </div>
              <div className="h-20 w-full bg-zinc-800 rounded-xl my-2 overflow-hidden relative flex items-center justify-center">
                <img 
                  src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80`} 
                  alt="Satellite Mini-Map" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white animate-ping"></div>
                <div className="absolute w-2 h-2 rounded-full bg-rose-500"></div>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {ticket.lat?.toFixed(4)}° N, {ticket.lng?.toFixed(4)}° E
              </div>
            </div>
          )}
        </div>

        {/* Feature 153: Urgency Thermometer Progress Meter */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Thermometer className={`w-3.5 h-3.5 ${prio.score >= 80 ? 'text-rose-500' : 'text-blue-500'}`} strokeWidth={1.75} />
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                prio.score >= 100 ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20' :
                prio.score >= 80 ? 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20' :
                prio.score >= 55 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20' : 
                'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
              }`}>
                {prio.priorityBadge}
              </span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 font-medium">
              {prio.riskLevel}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-zinc-800/80 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-black/[0.02]">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                prio.score >= 100 ? 'bg-rose-500' :
                prio.score >= 80  ? 'bg-orange-500' :
                prio.score >= 55  ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${prio.urgencyPercent}%` }}
            />
          </div>
        </div>

        {/* Feature 154: Humanized SLA Countdown Badge */}
        <div className="pt-0.5 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${sla.slaBadgeClass || 'bg-slate-50 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border-slate-200/60 dark:border-zinc-700/60'}`}>
            <Clock className="w-3 h-3 flex-shrink-0" strokeWidth={1.75} />
            <span>{getHumanizedSla()}</span>
          </span>

          {ticket.politicalEndorsement && (
            <span className="text-[10px] font-medium text-purple-700 dark:text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>MLA Endorsed</span>
            </span>
          )}
        </div>

        {/* Photo Evidence Thumbnail Preview */}
        {ticket.photoUrl && (
          <div className="pt-1">
            <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden border border-slate-200/60 dark:border-zinc-800/80 bg-slate-100 dark:bg-zinc-800">
              <img 
                src={ticket.photoUrl} 
                alt="Civic Problem" 
                className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              {ticket.resolutionProof && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white font-medium text-[10px] shadow-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Repaired</span>
                </span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Card Footer: Upvote, Share & Details Actions */}
      <div className="p-2.5 sm:px-4 bg-slate-50/60 dark:bg-zinc-800/30 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5">
          {/* Upvote Button with Explicit Type & Event Isolation */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(ticket.id);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-medium text-xs transition-all duration-150 active:scale-[0.98] ${
              isVoted 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs shadow-blue-500/20' 
                : 'bg-white dark:bg-zinc-800 border-slate-200/80 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700/60 shadow-2xs'
            }`}
            title="Endorse this civic issue"
          >
            <ArrowUp className={`w-3.5 h-3.5 ${isVoted ? 'text-white' : 'text-slate-500 dark:text-zinc-400'}`} strokeWidth={2} />
            <span>{isVoted ? 'Endorsed' : 'Upvote'}</span>
            <span className="text-[11px] font-mono opacity-80">({prio.uCount})</span>
          </button>

          {/* Share Button with Clipboard Feedback */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700/60 transition-all active:scale-[0.98] relative"
            title="Share grievance link"
          >
            <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-medium shadow-md whitespace-nowrap animate-in fade-in">
                Link Copied!
              </span>
            )}
          </button>
        </div>

        {/* View Details Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(ticket);
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs flex items-center gap-1 px-1.5 py-1"
        >
          <span>View Details</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
