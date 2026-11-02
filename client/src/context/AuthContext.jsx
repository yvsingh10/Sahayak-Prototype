import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEFAULT_CITIZEN = {
  id: "C-UID-2026-IND-08241",
  cuid: "C-UID-2026-IND-08241",
  name: "Yash Singh",
  role: "citizen",
  ward: "Ward 12 (Knowledge Park)",
  city: "Greater Noida",
  email: "yash.singh@citizen.in",
  phone: "+91-9876543210",
  phoneMasked: "+91-98765-XXXXX",
  kycVerified: true,
  kycBadge: "DigiLocker Verified Citizen"
};

// Clean UI Multilingual Translations dictionary
export const TRANSLATIONS = {
  en: {
    appName: "SAHAYAK",
    tagline: "Enterprise Civic Redressal & Geospatial Resolution Platform",
    reportIssue: "Report Problem",
    publicBoard: "Public Transparency Board",
    kanbanView: "5-Stage Pipeline Kanban",
    leaderboard: "Civic Urgency Leaderboard",
    mapView: "Interactive Map & Hub",
    citizenPortal: "Citizen Portal",
    authorityDashboard: "Authority Portals",
    penaltyTracker: "SLA Breach & Penalty Ledger",
    analytics: "KPI Analytics & Health",
    searchPlaceholder: "Search tickets by ID, ward, road, keyword...",
    stage1: "Pending Triage",
    stage2: "In Review",
    stage3: "In Progress",
    stage4: "Work Completed",
    stage5: "Resolved & Closed",
    criticalHazard: "Critical Hazard",
    highUrgency: "High Urgency",
    normalMaintenance: "Normal Maintenance",
    lowPriority: "Low Priority",
    slaCountdown: "SLA Gateway",
    upvote: "Upvote",
    confirmClosure: "Confirm Closure & Sign Off",
    reopenDispute: "Dispute Quality & Revert",
    switchRole: "Switch Persona"
  },
  hi: {
    appName: "सहायक (SAHAYAK)",
    tagline: "नागरिक शिकायत निवारण एवं भू-स्थानिक समाधान प्रणाली",
    reportIssue: "समस्या दर्ज करें",
    publicBoard: "सार्वजनिक पारदर्शिता पटल",
    kanbanView: "५-चरणीय समाधान पाइपलाइन",
    leaderboard: "नागरिक प्राथमिकता सूची",
    mapView: "मानचित्र एवं सरकारी कार्यालय",
    citizenPortal: "नागरिक पोर्टल",
    authorityDashboard: "विभागीय प्राधिकरण पोर्टल",
    penaltyTracker: "एस.एल.ए उल्लंघन एवं जुर्माना",
    analytics: "प्रदर्शन विश्लेषण एवं स्थिति",
    searchPlaceholder: "आईडी, वार्ड, सड़क या कीवर्ड से खोजें...",
    stage1: "जांच लंबित (चरण १)",
    stage2: "समीक्षाधीन (चरण २)",
    stage3: "कार्य प्रगति पर (चरण ३)",
    stage4: "कार्य संपन्न (चरण ४)",
    stage5: "समाधान एवं बंद (चरण ५)",
    criticalHazard: "गंभीर संकट",
    highUrgency: "अति आवश्यक",
    normalMaintenance: "सामान्य रखरखाव",
    lowPriority: "नियमित कार्य",
    slaCountdown: "४८-घंटे की समय सीमा",
    upvote: "समर्थन दें",
    confirmClosure: "समाधान सत्यापित करें",
    reopenDispute: "असंतोष / पुनर्विचार",
    switchRole: "भूमिका बदलें"
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('SAHAYAK_REACT_USER');
    return saved ? JSON.parse(saved) : DEFAULT_CITIZEN;
  });

  const [accountsData, setAccountsData] = useState({
    citizen: DEFAULT_CITIZEN,
    registeredCitizens: [DEFAULT_CITIZEN],
    allAccounts: [],
    cityWards: {}
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('SAHAYAK_LANG') || 'en';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('SAHAYAK_DARK') === 'true';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [proximityAlert, setProximityAlert] = useState(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('SAHAYAK_DARK', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('SAHAYAK_LANG', lang);
  };

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  const loadAccounts = () => {
    api.getAccounts().then(data => {
      if (data.success) {
        setAccountsData(data);
      }
    }).catch(err => console.error("Accounts load failed:", err));
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const loginAsCitizen = (citizenAccount = null) => {
    const target = citizenAccount || accountsData.citizen || DEFAULT_CITIZEN;
    setUser(target);
    localStorage.setItem('SAHAYAK_REACT_USER', JSON.stringify(target));
    setAuthModalOpen(false);
  };

  const loginAsRoleAccount = (account) => {
    setUser(account);
    localStorage.setItem('SAHAYAK_REACT_USER', JSON.stringify(account));
    setAuthModalOpen(false);
  };

  const registerNewCitizen = async (formData) => {
    try {
      const res = await api.registerCitizen(formData);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('SAHAYAK_REACT_USER', JSON.stringify(res.user));
        setAuthModalOpen(false);
        loadAccounts();
        return { success: true, user: res.user };
      } else {
        return { success: false, error: res.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const continueAsGuest = () => {
    setUser(null);
    localStorage.removeItem('SAHAYAK_REACT_USER');
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('SAHAYAK_REACT_USER');
  };

  const requireAuth = (promptMsg = "Authentication required for this operation.") => {
    setAuthPromptMessage(promptMsg);
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      accountsData,
      authModalOpen,
      setAuthModalOpen,
      authPromptMessage,
      loginAsCitizen,
      loginAsRoleAccount,
      registerNewCitizen,
      continueAsGuest,
      logout,
      requireAuth,
      language,
      changeLanguage,
      t,
      darkMode,
      toggleDarkMode,
      proximityAlert,
      setProximityAlert
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
