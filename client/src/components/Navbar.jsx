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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors text-xs">
      
      {/* 48-Hour SLA Guarantee Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 text-[10px] uppercase font-mono">
              Phase-3 Enterprise GovTech
            </span>
            <span className="text-slate-300 hidden md:inline">
              Features 101–200 Active: Open Jan Khata, YOLOv8 Vision, IoT Telemetry &amp; 48H SLA Hard-Lock.
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
            {/* Multilingual Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              <Globe className="w-3 h-3 text-blue-400" />
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-1 py-0.2 rounded font-semibold text-[10px] ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-slate-600">|</span>
              <button 
                onClick={() => changeLanguage('hi')}
                className={`px-1 py-0.2 rounded font-semibold text-[10px] ${language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
              title="Toggle Dark / WCAG High-Contrast Mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <button 
              onClick={onResetPrompt} 
              className="text-slate-400 hover:text-amber-300 underline transition-colors hidden sm:inline"
            >
              Reset Seed Data
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-mono">
                  {t('appName')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 uppercase font-mono">
                  Phase-3 (200 F)
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Enterprise Civic Redressal &amp; Geospatial Infrastructure
              </p>
            </div>
          </div>

          {/* City Jurisdiction Selector & Instant Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg mx-2">
            
            {/* City Dropdown */}
            <div className="relative w-40 flex-shrink-0">
              <select 
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="w-full pl-7 pr-6 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                <option value="All">All Cities (National)</option>
                <option value="Greater Noida">Greater Noida</option>
                <option value="Delhi">Delhi NCT</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Lucknow">Lucknow</option>
              </select>
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Instant Search Input */}
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search complaint ID, street, or ward..."
                className="w-full pl-8 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

          {/* Action Buttons: Jan Khata, Report & Auth Persona */}
          <div className="flex items-center gap-2">
            
            {/* Create Account Button (Feature 101–110) */}
            <button
              onClick={onOpenJanKhata}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create Account</span>
              <span className="sm:hidden">Create Account</span>
            </button>

            {/* Report Problem Button */}
            <button 
              onClick={onReportClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            {/* Auth Persona Pill */}
            {!user ? (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Select Role</span>
              </button>
            ) : user.role === 'citizen' ? (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={onOpenJanKhata}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  <span className="hidden sm:inline">{user.name}</span>
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                    Citizen
                  </span>
                </button>
                <button onClick={logout} title="Sign Out" className="text-slate-400 hover:text-rose-600 p-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 text-xs font-semibold"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    GOV
                  </span>
                  <span className="hidden sm:inline truncate max-w-[130px]">{user.title}</span>
                  <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 px-1.5 py-0.2 rounded font-mono">
                    {user.role}
                  </span>
                </button>
                <button onClick={logout} title="Sign Out" className="text-slate-400 hover:text-rose-600 p-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Tab Navigation Ribbon */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 mt-1 border-t border-slate-100 dark:border-slate-800 font-medium">
          
          <button 
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'feed' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Public Board</span>
          </button>

          <button 
            onClick={() => setActiveTab('mapHub')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'mapHub' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Geospatial Hub</span>
          </button>

          {/* Feature 181–190: Smart City IoT Tab */}
          <button 
            onClick={() => setActiveTab('iotHub')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'iotHub' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>IoT Sensor Grid (F-181–190)</span>
          </button>

          {/* Feature 121–130: AI Scanner Tab */}
          <button 
            onClick={() => setActiveTab('aiScanner')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'aiScanner' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI Damage Scanner (F-121–130)</span>
          </button>

          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'leaderboard' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Urgency Index</span>
          </button>

          <button 
            onClick={() => setActiveTab('citizenPortal')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'citizenPortal' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen Desk</span>
          </button>

          <button 
            onClick={() => setActiveTab('authorityDashboard')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'authorityDashboard' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Authority Deck</span>
          </button>

          <button 
            onClick={() => setActiveTab('penalties')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'penalties' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Penalty Ledger</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'analytics' 
                ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Telemetry</span>
          </button>

        </nav>

      </div>
    </header>
  );
}
