import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Check, 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Star, 
  RotateCcw, 
  Phone, 
  Mail, 
  Award,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function CitizenPortal({ 
  tickets, 
  onSelectTicket, 
  onOpenReport, 
  onOpenClosure,
  onOpenDispute 
}) {
  const { user, loginAsCitizen, setAuthModalOpen } = useAuth();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'reported' | 'endorsed'

  if (!user || user.role !== 'citizen') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 mx-auto flex items-center justify-center text-2xl shadow-inner">
          👤
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Citizen Authentication Required</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          You are currently in Guest or Authority mode. Please log in as a citizen to view your filed complaints, track 5-stage lifecycle milestones, and sign off on completed repairs.
        </p>
        <button 
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
        >
          Select Citizen Account (Yash Singh) →
        </button>
      </div>
    );
  }

  // Filter complaints associated with this citizen
  const myReports = tickets.filter(t => t.complainantId === user.cuid || t.complainantId === user.id);
  const myEndorsed = tickets.filter(t => t.upvotedBy && t.upvotedBy.includes(user.cuid || user.id));

  const displayList = filterMode === 'reported' 
    ? myReports 
    : filterMode === 'endorsed' 
    ? myEndorsed 
    : Array.from(new Set([...myReports, ...myEndorsed]));

  return (
    <div className="space-y-6">
      
      {/* Citizen Profile Card with C-UID & KYC Badge */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user.kycBadge || "DigiLocker Verified Citizen"}
              </span>
            </div>
            
            {/* Permanent C-UID */}
            <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              C-UID: {user.cuid || user.id}
            </div>

            <p className="text-xs text-slate-500">
              📍 {user.ward} · {user.city} · {user.phoneMasked || user.phone}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onOpenReport}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Problem</span>
        </button>

      </div>

      {/* Grievance Management Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Filter Switcher */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Lodged Grievances &amp; Endorsements
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify Stage 4 repairs with OTP sign-off or dispute incomplete work
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterMode === 'all' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              All Records ({myReports.length + myEndorsed.length})
            </button>
            <button
              onClick={() => setFilterMode('reported')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterMode === 'reported' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Lodged by Me ({myReports.length})
            </button>
            <button
              onClick={() => setFilterMode('endorsed')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterMode === 'endorsed' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Endorsed ({myEndorsed.length})
            </button>
          </div>
        </div>

        {/* Complaints List */}
        {displayList.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayList.map(ticket => {
              const isOwner = ticket.complainantId === user.cuid || ticket.complainantId === user.id;
              const isWorkCompleted = ticket.stage === 4;
              const isResolved = ticket.stage === 5;

              return (
                <div 
                  key={ticket.id} 
                  className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{ticket.id}</span>
                      
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isResolved 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isWorkCompleted 
                          ? 'bg-purple-100 text-purple-800 font-extrabold animate-pulse' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        Stage {ticket.stage}: {ticket.status}
                      </span>

                      {isOwner ? (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-semibold">
                          My Report
                        </span>
                      ) : (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                          Community Endorsement
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {ticket.title}
                    </h4>

                    <p className="text-xs text-slate-500">
                      📍 {ticket.location} ({ticket.ward}, {ticket.city})
                    </p>

                    {/* Stage 4 Alert: Citizen sign-off ready */}
                    {isWorkCompleted && isOwner && (
                      <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between gap-2 mt-2">
                        <span className="font-semibold">
                          🎉 Field Crew uploaded repair proof! Please inspect site and sign off with OTP.
                        </span>
                        <button
                          onClick={() => onOpenClosure(ticket)}
                          className="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 shadow-xs"
                        >
                          Verify &amp; Confirm ✓
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {isWorkCompleted && isOwner && (
                      <button
                        onClick={() => onOpenDispute(ticket)}
                        className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Dispute</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectTicket(ticket)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No complaints found in this view.
          </div>
        )}

      </div>

    </div>
  );
}
