import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, RotateCcw, AlertTriangle } from 'lucide-react';

export default function DisputeModal({ isOpen, onClose, ticket, onDisputeCompleted }) {
  const { user } = useAuth();
  const [disputeReason, setDisputeReason] = useState('Asphalt not properly compacted; trench already showing signs of depression after rain.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      alert("Please provide the specific reason for rejecting the repair.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.disputeQuality(ticket.id, {
        disputeReason,
        user
      });

      if (res.success) {
        onDisputeCompleted(res.ticket);
        onClose();
      } else {
        alert("Dispute request failed: " + res.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Dispute Substandard Repair</h3>
              <p className="text-xs text-slate-500">Stage Reversion back to Stage 3 (In Progress)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Contractor Escalation Penalty Clause</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Disputing this ticket immediately returns it to <strong>Stage 3: In Progress</strong> with an elevated priority rating. The responsible contractor and Ward Engineer are notified for immediate rework.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Reason for Rejection *
            </label>
            <textarea 
              rows={3}
              required
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain why the repair was incomplete or poorly executed..." 
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
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? 'Reverting...' : 'Reject Repair & Reopen Stage 3 ⚠️'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

