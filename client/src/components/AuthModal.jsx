import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  UserPlus, 
  Building2, 
  X, 
  CheckCircle, 
  UserCheck, 
  KeyRound, 
  Fingerprint, 
  Users, 
  HardHat, 
  Briefcase 
} from 'lucide-react';

export default function AuthModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authPromptMessage, 
    accountsData, 
    loginAsCitizen, 
    loginAsRoleAccount,
    registerNewCitizen,
    continueAsGuest 
  } = useAuth();

  const [authTab, setAuthTab] = useState('demo'); // 'demo' | 'register'
  const [selectedRoleCategory, setSelectedRoleCategory] = useState('citizen'); // 'citizen' | 'desk_officer' | 'field_crew' | 'ward_engineer' | 'commissioner'
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('Greater Noida');
  const [regWard, setRegWard] = useState('Ward 12 (Knowledge Park)');
  const [regKyc, setRegKyc] = useState(true);
  const [regOtp, setRegOtp] = useState('123456');
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(null);

  if (!authModalOpen) return null;

  const wards = accountsData?.cityWards?.[regCity] || [
    "Ward 1 (Alpha 1)", "Ward 4 (Beta 2)", "Ward 12 (Knowledge Park)"
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert("Name and Phone number are required.");
      return;
    }

    setRegLoading(true);
    const result = await registerNewCitizen({
      name: regName,
      phone: regPhone,
      email: regEmail,
      city: regCity,
      ward: regWard,
      verifyKyc: regKyc
    });
    setRegLoading(false);

    if (result.success) {
      setRegSuccess(result.user);
      setTimeout(() => {
        setAuthModalOpen(false);
        setRegSuccess(null);
      }, 1800);
    } else {
      alert("Registration failed: " + result.error);
    }
  };

  const filteredRoleAccounts = accountsData?.allAccounts?.filter(a => a.role === selectedRoleCategory) || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 uppercase font-mono">
                RBAC Access Gateway
              </span>
              <span className="text-xs text-slate-500">C-UID &amp; Municipal Credentials</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Authenticate Persona</h3>
          </div>
          <button onClick={() => setAuthModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {authPromptMessage && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs font-semibold">
            {authPromptMessage}
          </div>
        )}

        {/* Tab Switcher: Demo Roles vs Register Citizen */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
          <button
            onClick={() => setAuthTab('demo')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${authTab === 'demo' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Role-Based Persona Switcher (5 Roles)
          </button>
          <button
            onClick={() => setAuthTab('register')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${authTab === 'register' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Register Citizen (Generate C-UID)
          </button>
        </div>

        {/* Tab 1: Role-Based Accounts Switcher */}
        {authTab === 'demo' && (
          <div className="space-y-4">
            
            {/* 5 Distinct Roles Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-semibold">
              {[
                { id: 'citizen', label: 'Citizen', icon: '👤' },
                { id: 'desk_officer', label: 'Desk Officer', icon: '📋' },
                { id: 'field_crew', label: 'Field Crew', icon: '👷' },
                { id: 'ward_engineer', label: 'Ward Engineer', icon: '📐' },
                { id: 'commissioner', label: 'Commissioner', icon: '🏛' }
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleCategory(role.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedRoleCategory === role.id
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-base">{role.icon}</div>
                  <div className="text-[10px] mt-0.5 leading-tight">{role.label}</div>
                </button>
              ))}
            </div>

            {/* List of accounts for selected role */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              
              {selectedRoleCategory === 'citizen' && (
                <div className="space-y-2">
                  {accountsData?.registeredCitizens?.map((c, idx) => (
                    <div 
                      key={c.id || idx}
                      onClick={() => loginAsCitizen(c)}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer flex items-center justify-between text-xs transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-emerald-700 font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                            {c.cuid || c.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">{c.ward}, {c.city} · {c.phone}</div>
                      </div>
                      <span className="text-emerald-600 font-semibold text-xs">Login &rarr;</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedRoleCategory !== 'citizen' && (
                <div className="space-y-2">
                  {filteredRoleAccounts.map((acc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => loginAsRoleAccount(acc)}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/30 cursor-pointer flex items-center justify-between text-xs transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">{acc.city} — {acc.title}</div>
                        <div className="text-[11px] text-slate-500">Officer: {acc.name} · {acc.dept}</div>
                      </div>
                      <span className="text-indigo-600 font-semibold text-xs">Switch &rarr;</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Guest Action */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <button 
                onClick={continueAsGuest}
                className="text-slate-500 hover:text-slate-800 underline font-medium"
              >
                Browse Public Board as Anonymous Guest
              </button>
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

        {/* Tab 2: Register New Citizen Form */}
        {authTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            
            {regSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Citizen ID Generated Successfully!</span>
                </div>
                <div className="font-mono font-bold text-xs">{regSuccess.cuid}</div>
                <p className="text-[11px]">Bound to your phone number and DigiLocker profile.</p>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name *</label>
              <input 
                type="text" 
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Pooja Sharma"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (OTP Binding) *</label>
                <input 
                  type="tel" 
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91-9876543210"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address (Optional)</label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="pooja.sharma@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Default City *</label>
                <select 
                  value={regCity}
                  onChange={(e) => {
                    setRegCity(e.target.value);
                    const w = accountsData?.cityWards?.[e.target.value] || [];
                    if (w.length > 0) setRegWard(w[0]);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                >
                  <option value="Greater Noida">Greater Noida</option>
                  <option value="Delhi">Delhi NCT</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Lucknow">Lucknow</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Home Ward Sector *</label>
                <select 
                  value={regWard}
                  onChange={(e) => setRegWard(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                >
                  {wards.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DigiLocker KYC Check */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">DigiLocker / Aadhaar Verification</div>
                  <div className="text-[11px] text-slate-500">Grants verified community reporting trust badge.</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={regKyc} 
                onChange={(e) => setRegKyc(e.target.checked)} 
                className="w-4 h-4 text-blue-600 rounded" 
              />
            </div>

            {/* OTP Simulation */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-200">One-Time Password (OTP)</div>
                  <div className="text-[10px] text-slate-500">Demo Code: 123456</div>
                </div>
              </div>
              <input 
                type="text" 
                required
                maxLength={6}
                value={regOtp}
                onChange={(e) => setRegOtp(e.target.value)}
                className="w-24 text-center font-mono font-bold px-2 py-1 border rounded bg-white text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button 
                type="button" 
                onClick={() => setAuthTab('demo')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 dark:text-slate-300 font-semibold"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={regLoading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {regLoading ? 'Creating C-UID...' : 'Complete Registration &rarr;'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
