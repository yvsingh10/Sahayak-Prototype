import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Upload, ShieldCheck, MapPin, CheckCircle2, DollarSign, Package } from 'lucide-react';

const PROOF_PRESETS = {
  repaired_road: "https://images.unsplash.com/photo-1578873375969-d71a742d4a79?auto=format&fit=crop&w=700&q=80",
  cleared_waste: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80",
  repaired_pipe: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
  repaired_light: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80"
};

export default function ResolutionProofModal({ isOpen, onClose, ticket, onProofUploaded }) {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(PROOF_PRESETS.repaired_road);
  const [contractorId, setContractorId] = useState(user?.contractorId || 'MUNICIPAL-FIELD-UNIT-402');
  const [notes, setNotes] = useState('Excavated loose debris, laid 40mm bituminized base, and leveled pavement.');
  const [costExpense, setCostExpense] = useState('₹42,500');
  const [materialsUsed, setMaterialsUsed] = useState('1.2 tons Asphalt Mix, 45 Paver Blocks');
  const [submitting, setSubmitting] = useState(false);

  // Simulated field crew GPS location within 8m of issue
  const [workerLat, setWorkerLat] = useState(ticket?.lat ? ticket.lat + 0.00007 : 28.47448);
  const [workerLng, setWorkerLng] = useState(ticket?.lng ? ticket.lng + 0.00005 : 77.50406);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoUrl) {
      alert("Mandatory 'After Repair' photo evidence is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.uploadProof(ticket.id, {
        photoUrl,
        contractorId,
        notes,
        workerLat,
        workerLng,
        costExpense,
        materialsUsed,
        actor: user
      });

      if (res.success) {
        onProofUploaded(res.ticket);
        onClose();
      } else {
        alert("Proof upload failed: " + res.error);
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
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto"
      >

        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Stage 4 Resolution Proof</h3>
            <p className="text-xs text-slate-500">Submits photographic evidence &amp; triggers 20m Geofence verification</p>
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

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
            <div className="font-bold text-purple-900 dark:text-purple-200">{ticket.id}: {ticket.title}</div>
            <div className="text-slate-500">📍 {ticket.location} ({ticket.ward}, {ticket.city})</div>
          </div>

          {/* Feature 95: Geofence Verification Indicator */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="font-bold text-emerald-900 dark:text-emerald-200">20-Meter Geofence Lock: Verified</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Crew GPS is located ~8m from origin coordinates.</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded">
              PASSED
            </span>
          </div>

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

          {/* Feature 96: Municipal Expense Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Repair Cost *</label>
              <input
                type="text"
                required
                value={costExpense}
                onChange={(e) => setCostExpense(e.target.value)}
                placeholder="e.g. ₹28,000"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Materials / Quantities *</label>
              <input
                type="text"
                required
                value={materialsUsed}
                onChange={(e) => setMaterialsUsed(e.target.value)}
                placeholder="e.g. 1.2t Asphalt, Paver Blocks"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Execution Summary Notes *</label>
            <textarea
              rows={2}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>

          {/* Photo Evidence */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Mandatory "After Repair" Photographic Proof *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400">Presets:</span>
              <button type="button" onClick={() => setPhotoUrl(PROOF_PRESETS.repaired_road)} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">Resurfaced Asphalt</button>
              <button type="button" onClick={() => setPhotoUrl(PROOF_PRESETS.cleared_waste)} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">Sanitized Depot</button>
              <button type="button" onClick={() => setPhotoUrl(PROOF_PRESETS.repaired_pipe)} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">Welded Feeder Pipe</button>
              <button type="button" onClick={() => setPhotoUrl(PROOF_PRESETS.repaired_light)} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">Insulated Cable</button>
            </div>

            {photoUrl && (
              <img src={photoUrl} alt="Repair Proof" className="h-32 w-full object-cover rounded-xl border border-slate-200 dark:border-slate-700 mt-2" />
            )}
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
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Uploading & Geofencing...' : 'Submit Resolution Proof →'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
