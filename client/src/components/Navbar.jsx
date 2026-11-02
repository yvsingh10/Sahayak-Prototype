import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Search, 
  Plus, 
  User, 
  LogOut, 
  Layers, 
  TrendingUp, 
  Map, 
  CheckSquare, 
  AlertOctagon, 
  FileText,
  Moon,
  Sun,
  Globe,
  Activity,
  Flame,
  Cpu,
  Sparkles,
  UserCheck,
  UserPlus
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeCity, 
  setActiveCity, 
  searchKeyword, 
  setSearchKeyword, 
  onReportClick,
  onResetPrompt,
  onOpenJanKhata
}) {
  const { 
    user, 
    setAuthModalOpen, 
    logout, 
    language, 
    changeLanguage, 
    t, 
    darkMode, 
    toggleDarkMode 
  } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-zinc-800/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors text-xs">
      
      {/* 48-Hour SLA Guarantee Top Banner */}
      <div className="bg-slate-900 dark:bg-zinc-950 text-white text-[11px] py-1.5 px-4 border-b border-slate-800/80 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-medium border border-amber-400/20 text-[10px] tracking-wide font-mono">
              Enterprise GovTech
            </span>
            <span className="text-slate-400 dark:text-zinc-400 hidden md:inline">
              Features 101–200 Active: Open C-UID, YOLOv8 Vision, IoT Telemetry &amp; 48H SLA Hard-Lock.
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
            {/* Multilingual Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/60 dark:bg-zinc-800/60 px-2 py-0.5 rounded-md border border-slate-700/60 dark:border-zinc-700/60">
              <Globe className="w-3 h-3 text-blue-400" strokeWidth={1.75} />
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-1.5 py-0.5 rounded font-medium text-[10px] transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-slate-600">|</span>
              <button 
                onClick={() => changeLanguage('hi')}
                className={`px-1.5 py-0.5 rounded font-medium text-[10px] transition-colors ${language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} /> : <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />}
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <button 
              onClick={onResetPrompt} 
              className="text-slate-400 hover:text-amber-300 transition-colors hidden sm:inline text-[11px]"
            >
              Reset Seed
            </button>
          </div>

        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs shadow-blue-500/20 group-hover:scale-102 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  {t('appName')}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-mono">
                  Phase-3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-normal hidden sm:block">
                Civic Grievance &amp; Geospatial Infrastructure
              </p>
            </div>
          </div>

          {/* City Jurisdiction Selector & Instant Search */}
          <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-lg mx-3">
            
            {/* City Dropdown */}
            <div className="relative w-40 flex-shrink-0">
              <select 
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="w-full pl-7 pr-6 py-1.5 text-xs font-medium bg-slate-100/70 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 rounded-xl text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none transition-colors"
              >
                <option value="All">All Cities</option>
                <option value="Greater Noida">Greater Noida</option>
                <option value="Delhi">Delhi NCT</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Lucknow">Lucknow</option>
              </select>
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
            </div>

            {/* Instant Search Input */}
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search complaint ID, street, or ward..."
                className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-100/70 dark:bg-zinc-800/60 focus:bg-white dark:focus:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60 rounded-xl text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
            </div>

          </div>

          {/* Action Buttons: Create Account, Report & Auth Persona */}
          <div className="flex items-center gap-2">
            
            {/* Create Account Button */}
            <button
              onClick={onOpenJanKhata}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium text-xs shadow-xs shadow-emerald-600/20 transition-all duration-150"
            >
              <UserPlus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Create Account</span>
              <span className="sm:hidden">Account</span>
            </button>

            {/* Report Problem Button */}
            <button 
              onClick={onReportClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-xs shadow-xs shadow-blue-600/20 transition-all duration-150"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              <span>Report Issue</span>
            </button>

            {/* Auth Persona Pill */}
            {!user ? (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-800/70 hover:bg-slate-50 dark:hover:bg-zinc-700/60 text-slate-700 dark:text-zinc-200 font-medium text-xs shadow-2xs transition-all active:scale-[0.98]"
              >
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" strokeWidth={1.75} />
                <span>Select Role</span>
              </button>
            ) : user.role === 'citizen' ? (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={onOpenJanKhata}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  <span className="hidden sm:inline">{user.name}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                    Citizen
                  </span>
                </button>
                <button onClick={logout} title="Sign Out" className="text-slate-400 hover:text-rose-500 p-1 transition-colors">
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-xs font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    GOV
                  </span>
                  <span className="hidden sm:inline truncate max-w-[130px]">{user.title}</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                    {user.role}
                  </span>
                </button>
                <button onClick={logout} title="Sign Out" className="text-slate-400 hover:text-rose-500 p-1 transition-colors">
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Tab Navigation Ribbon */}
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2 mt-1 border-t border-slate-100/80 dark:border-zinc-800/60 font-medium no-scrollbar">
          
          {[
            { id: 'feed', label: 'Public Board', icon: <Layers className="w-3.5 h-3.5" strokeWidth={1.75} /> },
            { id: 'mapHub', label: 'Geospatial Hub', icon: <Map className="w-3.5 h-3.5" strokeWidth={1.75} /> },
            { id: 'iotHub', label: 'IoT Sensor Grid', icon: <Cpu className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.75} /> },
            { id: 'aiScanner', label: 'AI Damage Scanner', icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" strokeWidth={1.75} /> },
            { id: 'leaderboard', label: 'Urgency Index', icon: <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.75} /> },
            { id: 'citizenPortal', label: 'Citizen Desk', icon: <User className="w-3.5 h-3.5" strokeWidth={1.75} /> },
            { id: 'authorityDashboard', label: 'Authority Deck', icon: <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} /> },
            { id: 'penalties', label: 'Penalty Ledger', icon: <AlertOctagon className="w-3.5 h-3.5" strokeWidth={1.75} /> },
            { id: 'analytics', label: 'Telemetry', icon: <Activity className="w-3.5 h-3.5" strokeWidth={1.75} /> }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 text-xs font-medium ${
                  isActive 
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs' 
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/60 dark:hover:bg-zinc-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}

        </nav>

      </div>

    </header>
  );
}
