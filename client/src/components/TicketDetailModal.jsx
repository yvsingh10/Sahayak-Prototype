import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  X,
  ArrowUp,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Check,
  MapPin,
  Phone,
  Mail,
  Building2,
  Navigation,
  ExternalLink,
  Share2,
  MessageSquare,
  Send,
  Eye,
  RotateCcw,
  Lock,
  Star,
  CheckCircle2,
  QrCode,
  KeyRound,
  Sparkles,
  Camera,
  FileText,
  BadgeCheck
} from 'lucide-react';

// ── 5-Stage Life-Cycle Stepper (Feature 139) ──────────────────────────────────
const STAGES = [
  { n: 1, label: 'Submitted', key: 'PENDING_TRIAGE', sub: 'GPS hardware lock & 48h SLA gate' },
  { n: 2, label: 'Desk Verified', key: 'IN_REVIEW', sub: 'Jurisdiction confirmed & Ward Engineer bound' },
  { n: 3, label: 'In Progress', key: 'IN_PROGRESS', sub: 'Work order issued & field crew dispatched' },
  { n: 4, label: 'Work Completed', key: 'WORK_COMPLETED', sub: 'Mandatory repair photo & 20m geofence' },
  { n: 5, label: 'Resolved & Closed', key: 'RESOLVED_CLOSED', sub: 'Citizen 5-star rating & OTP sign-off' }
];

function StageStepper({ currentStage, isDelayed }) {
  const stage = currentStage || 1;
  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          📋 5-Stage Resolution Pipeline — Stage {stage} of 5
        </h4>
        {isDelayed && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Stage Delay Warning (&gt;24h in current stage)
          </span>
        )}
      </div>

      <div className="relative flex items-start justify-between gap-1">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-emerald-500 z-0 transition-all duration-700"
          style={{ width: `${((stage - 1) / 4) * 100}%` }}
        />
        {STAGES.map((s) => {
          const isDone = s.n < stage;
          const isActive = s.n === stage;
          return (
            <div key={s.n} className="relative z-10 flex flex-col items-center flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                isDone
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : isActive
                    ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
              }`}>
                {isDone ? '✓' : s.n}
              </div>
              <div className="mt-1.5 text-center px-0.5">
                <div className={`text-[10px] font-bold leading-tight ${s.n <= stage ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                  {s.label}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 leading-tight hidden sm:block">
                  {s.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Nearest Government Office Card ───────────────────────────────────────────
function GovOfficeCard({ office, ticketLat, ticketLng }) {
  if (!office) return null;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${office.lat},${office.lng}&destination=${ticketLat},${ticketLng}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${ticketLat},${ticketLng}`;

  return (
    <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-blue-600" />
          Nearest Competent Government Office
        </div>
        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
          📍 {office.distance || '1.4 km'} away
        </span>
      </div>

      <div>
        <div className="text-sm font-bold text-slate-900 dark:text-white">{office.name}</div>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 flex items-start gap-1">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
          {office.address}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
        <div><strong>Officer:</strong> {office.officer}</div>
        <div><strong>Hours:</strong> {office.hours || '09:30 AM – 06:00 PM'}</div>
        <div className="flex items-center gap-1">
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <a href={`tel:${office.phone}`} className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">{office.phone}</a>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-indigo-700 dark:text-indigo-400 truncate">{office.email || 'support@gov.in'}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          Turn-by-Turn Navigation
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>

        <a
          href={streetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-purple-600" />
          360&deg; Street View
        </a>
      </div>
    </div>
  );
}

// ── Interactive Before / After Slider ─────────────────────────────────────────
function BeforeAfterComparison({ beforeUrl, afterUrl, proofDetails }) {
  const [sliderPos, setSliderPos] = useState(50);

  if (!afterUrl) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Citizen Original Evidence (Before)</div>
          <img src={beforeUrl} alt="Reported Problem" className="h-44 w-full object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
        </div>
        <div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Municipal Repair Proof (After)</div>
          <div className="h-44 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <span>Awaiting official Stage 4 resolution proof from Field Crew</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800 dark:text-slate-200">
          Automated Before/After Photo Pair Verification
        </span>
        <span className="text-[10px] text-purple-700 dark:text-purple-300 font-mono font-bold bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded">
          Geofence Verified (12m)
        </span>
      </div>

      <div className="relative h-56 w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 select-none shadow-inner">
        <img src={afterUrl} alt="After Repair" className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold z-10">
          AFTER REPAIR
        </span>

        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
          <img src={beforeUrl} alt="Before Repair" className="h-full w-full object-cover max-w-none" style={{ width: '100%', height: '100%' }} />
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold z-10">
            BEFORE (REPORTED)
          </span>
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-20 flex items-center justify-center"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="w-6 h-6 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center text-[10px] font-bold border border-slate-300">
            &harr;
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />
      </div>

      {proofDetails && (
        <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
          <div className="font-semibold text-purple-900 dark:text-purple-200">
            Field Crew Execution Details (Contractor: {proofDetails.contractorId})
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">{proofDetails.notes}</p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-purple-200 dark:border-purple-800">
            <span><strong>Expense:</strong> {proofDetails.costExpense || '₹15,000'}</span>
            <span><strong>Materials:</strong> {proofDetails.materialsUsed || 'Bitumen & Pavers'}</span>
            <span><strong>Uploaded:</strong> {new Date(proofDetails.uploadedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Inspection Modal ────────────────────────────────────────────────────
export default function TicketDetailModal({
  ticket,
  onClose,
  onUpvote,
  onOpenTriage,
  onOpenProof,
  onOpenClosure,
  onOpenDispute,
  onOpenForward,
  onRefreshData
}) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'comments' | 'notes' | 'workorder' | 'memo'
  
  // Phase-3 State
  const [workOrderData, setWorkOrderData] = useState(null);
  const [closureOtpData, setClosureOtpData] = useState(null);
  const [penaltyMemoData, setPenaltyMemoData] = useState(null);
  const [corroborateModalOpen, setCorroborateModalOpen] = useState(false);
  const [corroborateNote, setCorroborateNote] = useState('');
  const [celebrationCardOpen, setCelebrationCardOpen] = useState(false);

  if (!ticket) return null;

  const isVoted = user && ticket.upvotedBy && ticket.upvotedBy.includes(user.cuid || user.id);
  const isAuthority = user && user.role !== 'citizen';

  const prio = ticket.priority || { score: 40, priorityBadge: "Normal Maintenance", urgencyPercent: 35 };
  const sla = ticket.sla || { formattedCountdown: '48h left', isBreached: false };

  // Fetch Digital Work Order (Feature 133)
  const handleLoadWorkOrder = async () => {
    setActiveTab('workorder');
    try {
      const res = await api.getWorkOrder(ticket.id);
      if (res.success) setWorkOrderData(res.workOrder);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch 4-Digit Closure OTP (Feature 135)
  const handleLoadClosureOtp = async () => {
    try {
      const res = await api.getClosureOtp(ticket.id);
      if (res.success) setClosureOtpData(res);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Penalty Memo (Feature 173)
  const handleLoadPenaltyMemo = async () => {
    setActiveTab('memo');
    try {
      const res = await api.getPenaltyMemo(ticket.id);
      if (res.success) setPenaltyMemoData(res.memo);
    } catch (e) {
      console.error(e);
    }
  };

  // Post Comment (Feature 164)
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.addComment(ticket.id, { text: commentText, user });
      if (res.success) {
        setCommentText('');
        if (onRefreshData) onRefreshData();
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  // Submit Corroboration (Feature 165)
  const handleSubmitCorroboration = async () => {
    try {
      const res = await api.corroborateTicket(ticket.id, { note: corroborateNote, user });
      if (res.success) {
        setCorroborateModalOpen(false);
        setCorroborateNote('');
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // WhatsApp Share (Feature 163)
  const shareWhatsApp = () => {
    const text = encodeURIComponent(`📢 Urgent Civic Alert in ${ticket.ward}, ${ticket.city}: "${ticket.title}". Review & endorse on SAHAYAK portal: http://localhost:7000/`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 text-xs">

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {ticket.id}
              </span>

              {/* Clean Visual Priority Badge */}
              <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                prio.badgeColor === 'rose' ? 'bg-rose-600 text-white font-extrabold animate-pulse' :
                prio.badgeColor === 'orange' ? 'bg-orange-500 text-white' :
                prio.badgeColor === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' :
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
              }`}>
                {prio.priorityBadge}
              </span>

              {/* Feature 168: MLA Endorsement Badge */}
              {ticket.politicalEndorsement && (
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 font-bold flex items-center gap-1 font-mono">
                  <BadgeCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>MLA Endorsed</span>
                </span>
              )}

              {ticket.isEmergencySos && (
                <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                  🚨 EMERGENCY SOS
                </span>
              )}

              <span className="text-slate-500">
                Logged {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 leading-snug">
              {ticket.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              📍 {ticket.location} ({ticket.ward}, {ticket.city}) · Alt: {ticket.elevationMeters || 198}m
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Stage Stepper (Feature 139) */}
        <StageStepper currentStage={ticket.stage || 1} isDelayed={sla.isStageDelayed} />

        {/* Feature 138: SLA Sub-Stage Micro-Timers */}
        <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{ticket.subStageTimers?.triageHoursLeft || 2}h Left</div>
            <div className="text-[10px] text-slate-500 uppercase">Triage Window</div>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{ticket.subStageTimers?.dispatchHoursLeft || 12}h Left</div>
            <div className="text-[10px] text-slate-500 uppercase">Dispatch SLA</div>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{ticket.subStageTimers?.repairHoursLeft || 24}h Left</div>
            <div className="text-[10px] text-slate-500 uppercase">Field Repair</div>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{ticket.subStageTimers?.inspectionHoursLeft || 10}h Left</div>
            <div className="text-[10px] text-slate-500 uppercase">QC Inspection</div>
          </div>
        </div>

        {/* 48-Hour SLA Gateway Countdown */}
        <div className={`p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 border ${
          sla.isBreached
            ? 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/40 dark:text-rose-200'
            : 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${sla.isBreached ? 'animate-spin' : ''}`} />
            <span className="font-bold">48-Hour SLA Gateway:</span>
            <span className="font-mono font-bold">{sla.formattedCountdown}</span>
          </div>
          {sla.isBreached && (
            <button
              onClick={handleLoadPenaltyMemo}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 font-mono text-[10px]"
            >
              View Salary Deduction Memo (F-173) &rarr;
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Overview &amp; Evidence
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'comments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Forum ({ticket.comments?.length || 0})</span>
          </button>
          <button
            onClick={handleLoadWorkOrder}
            className={`px-4 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'workorder' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital QR Work Order (F-133)</span>
          </button>
          {isAuthority && (
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'notes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Internal Notes ({ticket.internalNotes?.length || 0})</span>
            </button>
          )}
        </div>

        {/* TAB 1: DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
              <strong>Complainant Statement:</strong> {ticket.description}
            </div>

            <BeforeAfterComparison
              beforeUrl={ticket.photoUrl}
              afterUrl={ticket.resolutionProof?.photoUrl}
              proofDetails={ticket.resolutionProof}
            />

            <GovOfficeCard
              office={ticket.nearestOffice}
              ticketLat={ticket.lat || 28.4744}
              ticketLng={ticket.lng || 77.5040}
            />
          </div>
        )}

        {/* TAB 2: COMMENTS & SECONDARY CORROBORATION */}
        {activeTab === 'comments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200">Local Ward Coordination</span>
              <button
                onClick={() => setCorroborateModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-bold flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Corroborate / Add Photos (F-165)</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{new Date(c.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  No comments yet. Be the first local resident to corroborate this hazard!
                </div>
              )}
            </div>

            <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Coordinate with affected neighbors..."
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: WORK ORDER (Feature 133) */}
        {activeTab === 'workorder' && workOrderData && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {workOrderData.workPermitId}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Official Digital Job Permit</h4>
                <p className="text-slate-500">Contractor: {workOrderData.assignedContractor}</p>
              </div>
              <img src={workOrderData.qrCodeSvg} alt="QR Work Order" className="w-24 h-24 rounded-lg border bg-white p-1" />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div><strong>Labor Squad:</strong> {workOrderData.laborSquadSize} Technicians</div>
              <div><strong>Target SLA:</strong> {workOrderData.targetCompletionHours} Hours Maximum</div>
              <div className="col-span-2">
                <strong>Allocated Materials:</strong>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mt-1">
                  {workOrderData.allocatedMaterials.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SALARY DEDUCTION PENALTY MEMO (Feature 173) */}
        {activeTab === 'memo' && penaltyMemoData && (
          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-200 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900 pb-2">
              <span className="font-bold text-sm">MEMORANDUM OF PENALTY</span>
              <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded font-bold">{penaltyMemoData.memoNumber}</span>
            </div>
            <div><strong>Issuing Authority:</strong> {penaltyMemoData.issuingAuthority}</div>
            <div><strong>Delinquent Officer:</strong> {penaltyMemoData.officerInCharge} ({penaltyMemoData.department})</div>
            <div><strong>Statutory Breach:</strong> {penaltyMemoData.statutoryBreachHours}</div>
            <div className="text-base font-black text-rose-700 dark:text-rose-300">
              Fine Deducted from Salary: {penaltyMemoData.penaltyDeduction}
            </div>
            <p className="text-[11px] font-sans text-rose-800 dark:text-rose-300">
              Governed by {penaltyMemoData.statutoryRule}. Rectification mandated within {penaltyMemoData.remedyDeadline}.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpvote(ticket.id)}
              className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 ${
                isVoted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{isVoted ? 'Endorsed' : 'Upvote'} ({prio.uCount})</span>
            </button>

            <button
              onClick={shareWhatsApp}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold"
            >
              WhatsApp Share
            </button>

            {ticket.stage >= 4 && (
              <button
                onClick={() => setCelebrationCardOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-semibold"
              >
                Celebration Card (F-166)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Feature 135: Stage 5 OTP Handshake */}
            {ticket.stage === 4 && (
              <button
                onClick={handleLoadClosureOtp}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100"
              >
                Get Closure OTP (F-135)
              </button>
            )}

            {ticket.stage === 4 && (
              <button
                onClick={() => onOpenClosure(ticket)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Verify &amp; Sign Off OTP</span>
              </button>
            )}

            {ticket.stage === 4 && (
              <button
                onClick={() => onOpenDispute(ticket)}
                className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-300 font-bold"
              >
                Dispute Quality
              </button>
            )}

            {isAuthority && ticket.stage === 1 && (
              <button
                onClick={() => onOpenTriage(ticket)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Triage &amp; Assign Ward Engineer
              </button>
            )}

            {isAuthority && (ticket.stage === 2 || ticket.stage === 3) && (
              <button
                onClick={() => onOpenProof(ticket)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Upload Resolution Proof
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50"
            >
              Close
            </button>
          </div>

        </div>

        {/* Feature 135: OTP Handshake Popup Banner */}
        {closureOtpData && (
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-900 flex items-center justify-between text-indigo-950 dark:text-indigo-200">
            <div>
              <div className="font-bold">4-Digit Closure Handshake OTP:</div>
              <div className="text-[10px] text-slate-500">Sent to Complainant ({closureOtpData.complainantPhoneMasked})</div>
            </div>
            <span className="text-xl font-black font-mono tracking-widest bg-indigo-600 text-white px-3 py-1 rounded-xl">
              {closureOtpData.closureOtp}
            </span>
          </div>
        )}

      </div>

      {/* Feature 165: Secondary Corroboration Modal */}
      {corroborateModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl max-w-md w-full space-y-3 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between items-center font-bold text-sm">
              <span>Neighbor Evidence Corroboration (Feature 165)</span>
              <button onClick={() => setCorroborateModalOpen(false)}>✕</button>
            </div>
            <p className="text-slate-500">Confirm you also encountered this civic issue and add your observation to boost priority.</p>
            <textarea
              value={corroborateNote}
              onChange={(e) => setCorroborateNote(e.target.value)}
              placeholder="e.g. I also faced waterlogging here at 9 AM today; 2 bikes slipped."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              rows={3}
            />
            <button
              onClick={handleSubmitCorroboration}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
            >
              Confirm Experience &amp; Boost Urgency
            </button>
          </div>
        </div>
      )}

      {/* Feature 166: Before/After Celebration Share Modal */}
      {celebrationCardOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-200 font-bold">SAHAYAK Civic Transformation</span>
              <button onClick={() => setCelebrationCardOpen(false)} className="text-white">✕</button>
            </div>
            <div className="text-xl font-black">🎉 Problem Resolved!</div>
            <p className="text-xs text-emerald-100">{ticket.title} ({ticket.ward}, {ticket.city}) has been successfully repaired!</p>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-900">
              <div className="rounded-xl overflow-hidden bg-white p-1">
                <img src={ticket.photoUrl} alt="Before" className="h-24 w-full object-cover rounded-lg" />
                <div className="font-bold text-[10px] mt-1 text-rose-700">BEFORE</div>
              </div>
              <div className="rounded-xl overflow-hidden bg-white p-1">
                <img src={ticket.resolutionProof?.photoUrl || ticket.photoUrl} alt="After" className="h-24 w-full object-cover rounded-lg" />
                <div className="font-bold text-[10px] mt-1 text-emerald-700">AFTER REPAIR</div>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Celebration card copied to clipboard for social media sharing!");
                setCelebrationCardOpen(false);
              }}
              className="w-full py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50"
            >
              Share Celebration on WhatsApp / Social Media
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
