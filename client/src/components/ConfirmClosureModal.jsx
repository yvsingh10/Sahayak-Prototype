import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Check, Star, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';

export default function ConfirmClosureModal({ isOpen, onClose, ticket, onClosureConfirmed }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('Satisfied with speed of dispatch and neatness of asphalt repair.');
  const [otpCode, setOtpCode] = useState('123456');
  const [otpSent, setOtpSent] = useState(true);
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
    if (!otpCode || otpCode.length < 4) {
      alert("Please enter the 6-digit verification OTP.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.confirmClosure(ticket.id, {
        rating,
        feedback,
        otpCode,
        user
      });

      if (res.success) {
        onClosureConfirmed(res.ticket);
        onClose();
      } else {
        alert("Closure verification failed: " + res.error);
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
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
      >
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Citizen Quality Sign-Off &amp; OTP</h3>
            <p className="text-xs text-slate-500">Stage 5: Final closure and municipal archiving</p>
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
            <div className="text-slate-500 mt-0.5">Contractor: {ticket.resolutionProof?.contractorId || 'Municipal Team'}</div>
          </div>

          {/* Star Rating */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Work Quality Rating (1–5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                    rating >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  <Star className="w-7 h-7 fill-current" />
                </button>
              ))}
              <span className="font-bold text-slate-800 dark:text-slate-200 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Feedback Comments &amp; Quality Notes *
            </label>
            <textarea 
              rows={2}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>

          {/* 6-Digit OTP Verification Simulation */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
            <div className="flex items-center justify-between text-blue-900 dark:text-blue-300 font-bold">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                MFA / OTP Sign-off Simulation
              </span>
              <span className="text-[10px] text-emerald-600 font-mono">Demo OTP: 123456</span>
            </div>

            <input 
              type="text" 
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit OTP..."
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-800 rounded-lg text-center tracking-widest font-mono font-bold text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <p className="text-[10px] text-slate-500">
              Guarantees tamper-proof citizen sign-off before municipal invoice clearance.
            </p>
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
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? 'Verifying...' : 'Sign Off & Archive Ticket ✓'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
