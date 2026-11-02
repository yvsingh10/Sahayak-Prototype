import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  UserCheck, 
  UserPlus,
  ShieldCheck, 
  Users, 
  Smartphone, 
  Award, 
  History, 
  Trash2, 
  X, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  FileBadge
} from 'lucide-react';

export default function JanKhataModal({ isOpen, onClose, onUserRegistered }) {
  const { user, loginAsCitizen } = useAuth();

  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'family' | 'sessions' | 'ledger' | 'dpdp'
  
  // Registration Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Greater Noida');
  const [ward, setWard] = useState('Ward 12 (Knowledge Park)');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [digiLockerDoc, setDigiLockerDoc] = useState(null);
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Family Members
  const [familyMembers, setFamilyMembers] = useState([]);
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState('Parent');

  // Sessions & Ledger
  const [sessions, setSessions] = useState([]);
  const [ledger, setLedger] = useState(null);

  useEffect(() => {
    if (user && user.cuid) {
      loadUserData(user.cuid);
    }
  }, [user]);

  const loadUserData = async (cuid) => {
    try {
      const [sessRes, ledgRes] = await Promise.all([
        api.getSessions(cuid),
        api.getCitizenLedger(cuid)
      ]);
      if (sessRes.success) setSessions(sessRes.sessions || []);
      if (ledgRes.success) {
        setLedger(ledgRes);
        if (ledgRes.familyMembers) setFamilyMembers(ledgRes.familyMembers);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await api.sendJanKhataOtp(phone);
      if (res.success) {
        setOtpSent(true);
        setStatusMessage({ type: 'success', text: `OTP sent! Use demo OTP: ${res.otp}` });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error sending OTP' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleDigiLockerPull = async () => {
    setDigiLockerLoading(true);
    try {
      const res = await api.pullDigiLocker();
      if (res.success) {
        setDigiLockerDoc(res.digiLockerDoc);
        setName(res.digiLockerDoc.verifiedName);
        setCity(res.digiLockerDoc.residentDistrict.includes('Noida') ? 'Greater Noida' : 'Delhi');
        setStatusMessage({ type: 'success', text: 'DigiLocker verified! +70 Citizen Trust Score unlocked.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'DigiLocker service unreachable' });
    } finally {
      setDigiLockerLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (otpSent && otpInput !== '8241') {
      setStatusMessage({ type: 'error', text: "Invalid OTP. Please enter '8241'." });
      return;
    }

    try {
      const res = await api.registerJanKhata({
        name,
        phone,
        city,
        ward,
        digiLockerVerified: Boolean(digiLockerDoc),
        familyMembers
      });

      if (res.success) {
        loginAsCitizen(res.user);
        if (onUserRegistered) onUserRegistered(res.user);
        setStatusMessage({ type: 'success', text: `Account created successfully! Permanent C-UID: ${res.user.cuid}` });
        setTimeout(() => onClose(), 1800);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Registration failed: ' + err.message });
    }
  };

  const handleAddFamilyMember = async () => {
    if (!famName.trim()) return;
    try {
      if (user && user.cuid) {
        const res = await api.addFamilyMember(user.cuid, famName, famRelation);
        if (res.success) {
          setFamilyMembers(res.familyMembers || []);
          setFamName('');
          setStatusMessage({ type: 'success', text: `${famName} linked under your C-UID profile.` });
        }
      } else {
        setFamilyMembers([...familyMembers, { id: Date.now(), name: famName, relation: famRelation }]);
        setFamName('');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  const handleRevokeSession = async (sessId) => {
    try {
      const res = await api.revokeSession(sessId);
      if (res.success) {
        setSessions(sessions.filter(s => s.id !== sessId));
        setStatusMessage({ type: 'success', text: 'Session invalidated across all edge nodes.' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDpdpScrub = async () => {
    if (!window.confirm("Exercise Section 12 DPDP Right to be Forgotten? Your name, phone, and email will be permanently scrambled. Ticket records remain preserved anonymously.")) {
      return;
    }
    try {
      const res = await api.dpdpScrub(user?.cuid || 'C-UID-2026-IND-08241');
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          window.location.reload();
        }, 2200);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-md">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight font-mono">Create Account</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase font-mono">
                  Permanent C-UID
                </span>
              </div>
              <p className="text-xs text-slate-300">Open Public Citizen Onboarding, Digital Identity &amp; DPDP Ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 text-xs font-semibold overflow-x-auto">
          <button 
            onClick={() => setActiveTab('register')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'register' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Self-Signup (C-UID)</span>
          </button>
          <button 
            onClick={() => setActiveTab('family')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'family' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Users className="w-4 h-4" />
            <span>Family Profiles</span>
          </button>
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ledger' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Award className="w-4 h-4" />
            <span>Trust Score &amp; Ledger</span>
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'sessions' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Active Sessions</span>
          </button>
          <button 
            onClick={() => setActiveTab('dpdp')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'dpdp' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-rose-600'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Privacy</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className={`p-3 text-xs flex items-center gap-2 border-b ${statusMessage.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200'}`}>
            {statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">

          {/* TAB 1: SELF SIGNUP */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {/* DigiLocker 1-Click Pull Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-600 text-white flex-shrink-0">
                    <FileBadge className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-bold text-blue-950 dark:text-blue-200">DigiLocker Instant KYC (Feature 103)</div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-300">Pull verified resident district &amp; full name to claim Tier-2 Civic Guardian badge.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDigiLockerPull}
                  disabled={digiLockerLoading || !!digiLockerDoc}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold whitespace-nowrap shadow-xs"
                >
                  {digiLockerDoc ? 'Verified ✓' : digiLockerLoading ? 'Syncing...' : 'Fetch DigiLocker'}
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name (पूरा नाम)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Manish Pandey"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone Number (OTP Ingestion)</label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="px-2.5 py-2 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 whitespace-nowrap"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className="animate-in fade-in">
                      <label className="block font-semibold text-emerald-700 dark:text-emerald-300 mb-1">4-Digit Carrier OTP (Demo: 8241)</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="8241"
                        className="w-full px-3 py-2 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-mono text-center text-sm font-bold tracking-widest"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City Jurisdiction</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Greater Noida">Greater Noida</option>
                      <option value="Delhi">Delhi NCT</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Lucknow">Lucknow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ward Auto-Binding</label>
                    <input
                      type="text"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 text-sm mt-3"
                >
                  Generate Tamper-Proof Citizen Unique ID (C-UID)
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: FAMILY PROFILES */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <strong>Feature 104: Dynamic Family Profile Linking:</strong> Manage grievances on behalf of senior citizens and student dependents without needing separate phones or accounts.
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={famName}
                  onChange={(e) => setFamName(e.target.value)}
                  placeholder="Dependent Full Name (e.g. Smt. Kamala Devi)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <select
                  value={famRelation}
                  onChange={(e) => setFamRelation(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Parent">Parent</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Senior Dependent">Senior Citizen</option>
                </select>
                <button
                  onClick={handleAddFamilyMember}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Add Dependent
                </button>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">Linked Family Dependents ({familyMembers.length})</div>
                {familyMembers.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400">
                    No family members linked yet. Add seniors or children to lodge grievances on their behalf.
                  </div>
                ) : (
                  familyMembers.map((fam, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{fam.name}</div>
                        <div className="text-[10px] text-slate-500">Relationship: {fam.relation} · Linked to Primary C-UID</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                        Authorized Proxy
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRUST SCORE & LEDGER */}
          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                  <div className="text-xl font-black text-amber-700 dark:text-amber-300 font-mono">145</div>
                  <div className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase">Trust Score</div>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                  <div className="text-sm font-black text-blue-700 dark:text-blue-300 font-mono">Tier-2</div>
                  <div className="text-[10px] font-bold text-blue-800 dark:text-blue-200 uppercase">Civic Guardian</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 font-mono">4</div>
                  <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200 uppercase">Lodged Issues</div>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                  <div className="text-xl font-black text-indigo-700 dark:text-indigo-300 font-mono">18</div>
                  <div className="text-[10px] font-bold text-indigo-800 dark:text-indigo-200 uppercase">Endorsements</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">Permanent Citizen Ledger Timeline (Feature 109)</div>
                <div className="space-y-2">
                  {[
                    { id: "TX-01", desc: "Reported dangerous open trench on Gamma 2", pts: "+25 Trust Score", date: "28 Mar 2026", color: "emerald" },
                    { id: "TX-02", desc: "Upvoted transformer sparking alert in Alpha 1", pts: "+5 Trust Score", date: "29 Mar 2026", color: "blue" },
                    { id: "TX-03", desc: "Signed off on pothole repair with OTP 8241", pts: "+50 Trust Score", date: "01 Apr 2026", color: "amber" },
                    { id: "TX-04", desc: "Verified identity with DigiLocker Aadhaar KYC", pts: "+70 Trust Score", date: "02 Apr 2026", color: "indigo" }
                  ].map((tx, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{tx.desc}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.id} · {tx.date}</div>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        {tx.pts}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <strong>Feature 108: Multi-Session Active Device Manager:</strong> View all browsers and mobile apps currently authorized for your C-UID. Instantly revoke lost or public devices.
              </div>

              <div className="space-y-2">
                {sessions.map((sess, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <Smartphone className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold uppercase font-mono">
                              This Device
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">IP: {sess.ip} · {sess.city} · {sess.lastActive}</div>
                      </div>
                    </div>
                    {!sess.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold text-[11px]"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DPDP PRIVACY */}
          {activeTab === 'dpdp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2">
                <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-5 h-5 text-rose-600" />
                  <span>Digital Personal Data Protection (DPDP) Act 2023 Compliance</span>
                </div>
                <p className="text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
                  Under Section 12 of India's DPDP Act, every citizen reserves the unconditional right to erase and anonymize personal metadata. Exercising this right will permanently scrub your name, mobile phone number, and residential coordinates while retaining public municipal grievance records for civic accountability.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200">1-Click Right to Erasure Action (Feature 110)</div>
                <p className="text-slate-500">
                  This action is irreversible. Your citizen profile will be replaced with an anonymized cryptographic hash, and all active sessions will be terminated.
                </p>
                <button
                  onClick={handleDpdpScrub}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-sm shadow-rose-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Exercise Right to be Forgotten (Scrub PII)</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

