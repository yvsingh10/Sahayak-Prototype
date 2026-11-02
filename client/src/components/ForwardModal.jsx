import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, ArrowRightLeft, Building2 } from 'lucide-react';

const DEPARTMENTS = [
  "Roads & Infrastructure",
  "Water Supply & Sewage",
  "Solid Waste & Cleanliness",
  "Electricity & Power",
  "Public Health & Safety"
];

export default function ForwardModal({ isOpen, onClose, ticket, onForwardCompleted }) {
  const { user } = useAuth();
  const [targetDepartment, setTargetDepartment] = useState('Water Supply & Sewage');
  const [forwardReason, setForwardReason] = useState('Pipe burst has undermined the road foundation. Water board must repair line before road resurfacing.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !ticket) return null;

  const availableDepts = DEPARTMENTS.filter(d => d !== ticket.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.forwardDepartment(ticket.id, {
        targetDepartment,
        reason: forwardReason,
        actor: user
      });

      if (res.success) {
        onForwardCompleted(res.ticket);
        onClose();
      } else {
        alert("Failed to forward ticket: " + res.error);
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
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Inter-Department Forwarding</h3>
              <p className="text-xs text-slate-500">1-Click official reassignment with audit trail</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-800 dark:text-slate-200">{ticket.id}: {ticket.title}</div>
            <div className="text-slate-500 mt-0.5">Current Department: <strong>{ticket.category}</strong></div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Department *</label>
            <select
              value={targetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800 font-semibold"
            >
              {availableDepts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reassignment Justification *</label>
            <textarea 
              rows={3}
              required
              value={forwardReason}
              onChange={(e) => setForwardReason(e.target.value)}
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
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Reassigning...' : 'Forward to Department →'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

