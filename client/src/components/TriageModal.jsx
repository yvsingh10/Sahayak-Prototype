import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, CheckCircle2, ShieldCheck, UserCheck, HardHat, AlertTriangle } from 'lucide-react';

export default function TriageModal({ isOpen, onClose, ticket, onTriageComplete }) {
  const { user } = useAuth();
  const [targetStage, setTargetStage] = useState(2);
  const [wardEngineer, setWardEngineer] = useState('Er. Ramesh Verma (Executive Engineer)');
  const [contractorId, setContractorId] = useState('MUNICIPAL-FIELD-CREW-14');
  const [triageNote, setTriageNote] = useState('Jurisdiction confirmed. Work order issued to zonal maintenance unit.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.updateStage(ticket.id, {
        targetStage,
        actor: user,
        wardEngineer,
        contractorId,
        note: triageNote
      });

      if (res.success) {
        onTriageComplete(res.ticket);
        onClose();
      } else {
        alert("Failed to triage ticket: " + res.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
      >
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Desk Triage &amp; Engineer Assignment</h3>
            <p className="text-xs text-slate-500">Advance grievance along the 5-Stage resolution pipeline</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-800 dark:text-slate-200">{ticket.id}: {ticket.title}</div>
            <div className="text-slate-500 mt-0.5">📍 {ticket.location} ({ticket.ward}, {ticket.city})</div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Milestone Stage *</label>
            <select
              value={targetStage}
              onChange={(e) => setTargetStage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800 font-semibold"
            >
              <option value={2}>Stage 2: Jurisdiction Verified &amp; Desk Approved (IN_REVIEW)</option>
              <option value={3}>Stage 3: Mobilize Field Crew Immediately (IN_PROGRESS)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Ward Executive Engineer *</label>
            <input 
              type="text"
              required
              value={wardEngineer}
              onChange={(e) => setWardEngineer(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>

          {targetStage === 3 && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contractor / Field Crew ID *</label>
              <input 
                type="text"
                required
                value={contractorId}
                onChange={(e) => setContractorId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Triage Note *</label>
            <textarea 
              rows={2}
              required
              value={triageNote}
              onChange={(e) => setTriageNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Confirm Stage Transition →'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
