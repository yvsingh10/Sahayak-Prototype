import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

// Components
import Navbar from './components/Navbar';
import MetricsRibbon from './components/MetricsRibbon';
import TicketFeed from './components/TicketFeed';
import InteractiveMapHub from './components/InteractiveMapHub';
import Leaderboard from './components/Leaderboard';
import CitizenPortal from './components/CitizenPortal';
import AuthorityDashboard from './components/AuthorityDashboard';
import PenaltyTracker from './components/PenaltyTracker';
import AnalyticsHealth from './components/AnalyticsHealth';
import ArchitectureSpec from './components/ArchitectureSpec';

// Phase-3 New Components
import IoTDashboard from './components/IoTDashboard';
import AiDamageScanner from './components/AiDamageScanner';
import JanKhataModal from './components/JanKhataModal';

// Modals
import AuthModal from './components/AuthModal';
import SubmitModal from './components/SubmitModal';
import TicketDetailModal from './components/TicketDetailModal';
import TriageModal from './components/TriageModal';
import ResolutionProofModal from './components/ResolutionProofModal';
import ConfirmClosureModal from './components/ConfirmClosureModal';
import DisputeModal from './components/DisputeModal';
import ForwardModal from './components/ForwardModal';

import { 
  Megaphone, 
  AlertTriangle, 
  ShieldAlert, 
  Plus, 
  Layers, 
  Map, 
  Cpu, 
  Sparkles, 
  User, 
  Building2 
} from 'lucide-react';

export default function App() {
  const { user, requireAuth, setAuthModalOpen, darkMode } = useAuth();

  // Navigation & Filters
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'mapHub' | 'iotHub' | 'aiScanner' | 'leaderboard' | 'citizenPortal' | 'authorityDashboard' | 'penalties' | 'analytics' | 'specs'
  const [activeCity, setActiveCity] = useState('Greater Noida');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('priority_desc');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Data State
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [departmentWorkload, setDepartmentWorkload] = useState([]);
  const [wardRankings, setWardRankings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [cityWards, setCityWards] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isJanKhataOpen, setIsJanKhataOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [triageTicket, setTriageTicket] = useState(null);
  const [proofTicket, setProofTicket] = useState(null);
  const [closureTicket, setClosureTicket] = useState(null);
  const [disputeTicket, setDisputeTicket] = useState(null);
  const [forwardTicket, setForwardTicket] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3800);
  };

  // Fetch tickets and stats from REST API
  const loadData = async () => {
    try {
      const [ticketRes, statsRes, accountsRes] = await Promise.all([
        api.getTickets({
          city: activeCity,
          category: categoryFilter,
          status: statusFilter,
          search: searchKeyword,
          sort: sortOrder
        }),
        api.getStats(activeCity),
        api.getAccounts()
      ]);

      if (ticketRes.success) setTickets(ticketRes.tickets);
      if (statsRes.success) {
        setStats(statsRes.stats || {});
        setDepartmentWorkload(statsRes.departmentWorkload || []);
        setWardRankings(statsRes.wardRankings || []);
        setAnnouncements(statsRes.announcements || []);
      }
      if (accountsRes.success) setCityWards(accountsRes.cityWards || {});
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 10 seconds for live SLA countdowns and daemon auto-escalations
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [activeCity, categoryFilter, statusFilter, searchKeyword, sortOrder]);

  // Handle Upvote
  const handleUpvote = async (ticketId) => {
    if (!user || user.role !== 'citizen') {
      requireAuth("Citizen Authentication Required: Log in as a citizen to add community endorsements.");
      return;
    }

    try {
      const res = await api.upvoteTicket(ticketId, user);
      if (res.success) {
        showToast(res.voted ? "Community endorsement verified! Urgency amplified." : "Endorsement removed.");
        loadData();
        if (selectedTicket && selectedTicket.id === ticketId) {
          const fresh = await api.getTicketById(ticketId);
          if (fresh.success) setSelectedTicket(fresh.ticket);
        }
      }
    } catch (err) {
      showToast("Upvote failed: " + err.message);
    }
  };

  // Handle Reset Database
  const handleResetPrompt = async () => {
    if (window.confirm("Reset municipal database to initial clean 5-stage seed tickets?")) {
      const res = await api.resetDatabase();
      if (res.success) {
        showToast("Database reset to verified 5-stage seed tickets.");
        loadData();
      }
    }
  };

  const handleReportClick = () => {
    setIsSubmitOpen(true);
  };

  const handleTrackTicket = (idOrKeyword) => {
    const clean = idOrKeyword.trim().toLowerCase();
    const exactMatch = tickets.find(t => 
      t.id.toLowerCase() === clean || 
      t.id.toLowerCase().includes(clean)
    );
    if (exactMatch) {
      setSelectedTicket(exactMatch);
      showToast(`Tracking record loaded for ${exactMatch.id} (Stage ${exactMatch.stage})`);
    } else {
      showToast(`No exact match for "${idOrKeyword}". Filtered public search active.`);
    }
  };

  // Proximity alerts check: Active escalated hazards in this city
  const escalatedHazards = tickets.filter(t => t.city === activeCity && (t.status === 'ESCALATED' || t.isEmergencySos));

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors pb-16 sm:pb-0`}>
      
      {/* Header & Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCity={activeCity}
        setActiveCity={setActiveCity}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onReportClick={handleReportClick}
        onResetPrompt={handleResetPrompt}
        onOpenJanKhata={() => setIsJanKhataOpen(true)}
        onTrackTicket={handleTrackTicket}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Feature 80: Community Announcement Broadcast Banner */}
        {announcements.length > 0 && activeTab === 'feed' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white flex-shrink-0">
                <Megaphone className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 mr-2">
                  Municipal Bulletin ({announcements[0].city}):
                </span>
                <span className="text-amber-800 dark:text-amber-300">
                  {announcements[0].title} — {announcements[0].details}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-200/60 dark:bg-amber-900 px-2 py-0.5 rounded uppercase">
              {announcements[0].severity}
            </span>
          </div>
        )}

        {/* Feature 20: Proximity Hazard Alert Banner */}
        {escalatedHazards.length > 0 && (activeTab === 'feed' || activeTab === 'mapHub') && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse flex-shrink-0" />
              <span>
                <strong>Proximity Hazard Alert ({activeCity}):</strong> {escalatedHazards.length} active critical hazards in this jurisdiction under Tier-1 / Tier-2 auto-escalation.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="text-rose-700 dark:text-rose-300 font-bold hover:underline flex-shrink-0"
            >
              View Urgency Index &rarr;
            </button>
          </div>
        )}

        {/* 6-Card Telemetry Metrics Ribbon */}
        <MetricsRibbon stats={stats} />

        {/* Dynamic View Tabs */}
        {activeTab === 'feed' && (
          <TicketFeed 
            tickets={tickets}
            loading={loading}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onUpvote={handleUpvote}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            activeCity={activeCity}
          />
        )}

        {activeTab === 'mapHub' && (
          <InteractiveMapHub 
            tickets={tickets}
            activeCity={activeCity}
            onSelectTicket={(t) => setSelectedTicket(t)}
          />
        )}

        {/* Feature 181–190: Smart City IoT Tab */}
        {activeTab === 'iotHub' && (
          <IoTDashboard 
            activeCity={activeCity}
            onTicketCreated={(newTicket) => {
              showToast(`IoT Auto-Alarm created ticket #${newTicket.id}!`);
              loadData();
              setSelectedTicket(newTicket);
            }}
          />
        )}

        {/* Feature 121–130: AI Damage Scanner Tab */}
        {activeTab === 'aiScanner' && (
          <AiDamageScanner 
            onScanComplete={(res) => {
              showToast("Neural scan complete! YOLOv8 pothole & waste density calculated.");
            }}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard 
            tickets={tickets}
            wardRankings={wardRankings}
            onSelectTicket={(t) => setSelectedTicket(t)}
          />
        )}

        {activeTab === 'citizenPortal' && (
          <CitizenPortal 
            tickets={tickets}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onOpenReport={handleReportClick}
            onOpenClosure={(t) => setClosureTicket(t)}
            onOpenDispute={(t) => setDisputeTicket(t)}
          />
        )}

        {activeTab === 'authorityDashboard' && (
          <AuthorityDashboard 
            tickets={tickets}
            departmentWorkload={departmentWorkload}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onOpenTriage={(t) => setTriageTicket(t)}
            onOpenProof={(t) => setProofTicket(t)}
            onOpenForward={(t) => setForwardTicket(t)}
          />
        )}

        {activeTab === 'penalties' && (
          <PenaltyTracker />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsHealth 
            stats={stats}
            departmentWorkload={departmentWorkload}
          />
        )}

        {activeTab === 'specs' && (
          <ArchitectureSpec />
        )}

      </main>

      {/* Feature 160: Sticky Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <button
          onClick={handleReportClick}
          className="p-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:scale-105 active:scale-95 text-white shadow-xl shadow-blue-500/30 flex items-center gap-2.5 font-bold text-sm transition-transform"
          title="Lodge Municipal Grievance with Hardware GPS"
        >
          <Plus className="w-5 h-5" />
          <span>Report Issue (F-160)</span>
        </button>
      </div>

      {/* Feature 157: Mobile-Optimized Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2 flex items-center justify-around text-[10px] font-semibold">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'feed' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
        >
          <Layers className="w-4 h-4" />
          <span>Feed</span>
        </button>
        <button 
          onClick={() => setActiveTab('mapHub')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'mapHub' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
        >
          <Map className="w-4 h-4" />
          <span>Map</span>
        </button>
        <button 
          onClick={handleReportClick}
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('iotHub')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'iotHub' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
        >
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span>IoT</span>
        </button>
        <button 
          onClick={() => setIsJanKhataOpen(true)}
          className="flex flex-col items-center gap-0.5 text-slate-500"
        >
          <User className="w-4 h-4 text-teal-600" />
          <span>Account</span>
        </button>
      </div>

      {/* Clean UI Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">S</div>
            <span className="font-bold text-slate-700 dark:text-slate-300">SAHAYAK Platform</span>
            <span>· Phase-3 GovTech Enterprise (Features 101–200)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Clean UI Directive Active</span>
            <span>·</span>
            <span>Strict 5-Stage Life-Cycle Pipeline</span>
            <span>·</span>
            <button onClick={handleResetPrompt} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Re-seed Database
            </button>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <AuthModal />

      {/* Phase-3: Jan Khata Modal */}
      <JanKhataModal 
        isOpen={isJanKhataOpen}
        onClose={() => setIsJanKhataOpen(false)}
        onUserRegistered={(newUser) => {
          showToast(`Jan Khata C-UID created: ${newUser.cuid}`);
          loadData();
        }}
      />

      <SubmitModal 
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onTicketCreated={(newTicket) => {
          showToast(`Grievance ${newTicket.id} lodged! 48h SLA Gateway initiated.`);
          loadData();
          setSelectedTicket(newTicket);
        }}
      />

      <TicketDetailModal 
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpvote={handleUpvote}
        onOpenTriage={(t) => {
          setSelectedTicket(null);
          setTriageTicket(t);
        }}
        onOpenProof={(t) => {
          setSelectedTicket(null);
          setProofTicket(t);
        }}
        onOpenClosure={(t) => {
          setSelectedTicket(null);
          setClosureTicket(t);
        }}
        onOpenDispute={(t) => {
          setSelectedTicket(null);
          setDisputeTicket(t);
        }}
        onOpenForward={(t) => {
          setSelectedTicket(null);
          setForwardTicket(t);
        }}
        onRefreshData={loadData}
      />

      <TriageModal 
        ticket={triageTicket}
        isOpen={!!triageTicket}
        onClose={() => setTriageTicket(null)}
        onTriageComplete={(updated) => {
          showToast(`Triage approved for ticket ${updated.id}. Stage ${updated.stage} bound.`);
          loadData();
        }}
      />

      <ResolutionProofModal 
        ticket={proofTicket}
        isOpen={!!proofTicket}
        onClose={() => setProofTicket(null)}
        onProofUploaded={(updated) => {
          showToast(`Resolution proof recorded! Ticket ${updated.id} moved to Stage 4 (Work Completed).`);
          loadData();
        }}
      />

      <ConfirmClosureModal 
        ticket={closureTicket}
        isOpen={!!closureTicket}
        onClose={() => setClosureTicket(null)}
        onClosureConfirmed={(updated) => {
          showToast(`Ticket ${updated.id} signed off with OTP and officially Resolved!`);
          loadData();
        }}
      />

      <DisputeModal
        ticket={disputeTicket}
        isOpen={!!disputeTicket}
        onClose={() => setDisputeTicket(null)}
        onDisputeCompleted={(updated) => {
          showToast(`Repair disputed! Ticket ${updated.id} reverted to Stage 3 with escalated priority.`);
          loadData();
        }}
      />

      <ForwardModal
        ticket={forwardTicket}
        isOpen={!!forwardTicket}
        onClose={() => setForwardTicket(null)}
        onForwardCompleted={(updated) => {
          showToast(`Complaint ${updated.id} forwarded to ${updated.category}.`);
          loadData();
        }}
      />

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
