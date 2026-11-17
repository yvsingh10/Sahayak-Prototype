import React from 'react';
import {
  Info,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  GitBranch,
  Layers,
  Map,
  TrendingUp,
  Star,
  BookOpen,
  Cpu,
  Code2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
} from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Yash Vardhan Singh',
    role: 'Lead Developer & System Architect',
    contribution: 'React frontend, Node.js REST API, 5-stage FSM lifecycle, SLA auto-escalation engine, Geospatial Map Hub',
    avatar: 'YS',
    color: 'bg-blue-600',
  },
  {
    name: 'Vikrant Singh',
    role: 'Backend Developer & Testing Lead',
    contribution: 'Express REST endpoints, priority scoring engine, Haversine duplicate detection, automated test suite',
    avatar: 'VS',
    color: 'bg-indigo-600',
  },
];

const TECH_STACK = [
  {
    name: 'React 19',
    category: 'Frontend',
    icon: (
      <svg className="w-6 h-6" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    ),
    desc: 'SPA with fast responsive render loop'
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#06B6D4">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    ),
    desc: 'Utility-first modern design system'
  },
  {
    name: 'Leaflet.js',
    category: 'Maps',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
        <path d="M16 2C9.5 2 4 10.5 4 19c0 7 5 11 12 11s12-4 12-11c0-8.5-5.5-17-12-17z" fill="#78C257" fillOpacity="0.25"/>
        <path d="M16 2C9.5 2 4 10.5 4 19c0 7 5 11 12 11s12-4 12-11c0-8.5-5.5-17-12-17z" stroke="#5F9E38" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 6v21M16 14c3.5-2.5 7.5-1.5 9 .5M16 19c-3.5-2-7.5-1-9 1M16 10c3-1.8 6.5-.8 8 1" stroke="#48782B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'OpenStreetMap vector cartography'
  },
  {
    name: 'Node.js',
    category: 'Backend',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
        <path d="M16 2l12 7v14l-12 7-12-7V9l12-7z" fill="#339933" fillOpacity="0.2" stroke="#339933" strokeWidth="2"/>
        <path d="M16 5.5l9 5.2v10.6l-9 5.2-9-5.2V10.7l9-5.2z" fill="#339933"/>
        <path d="M13 13.5v5l3 1.8 3-1.8v-5l-3-1.8-3 1.8z" fill="#ffffff"/>
      </svg>
    ),
    desc: 'Async event-driven server runtime'
  },
  {
    name: 'Express.js',
    category: 'API',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#1e293b"/>
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#f8fafc" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" letterSpacing="-0.5">ex</text>
      </svg>
    ),
    desc: 'RESTful API gateway framework'
  },
  {
    name: 'JSON Store',
    category: 'Database',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
      </svg>
    ),
    desc: 'File-backed atomic persistence'
  },
  {
    name: 'Haversine',
    category: 'Algorithm',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
    ),
    desc: 'Spherical duplicate detection'
  },
  {
    name: 'Vite',
    category: 'Tooling',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
        <path d="M29.5 5.5L16.5 29a.8.8 0 0 1-1.4 0L2.5 5.5a.8.8 0 0 1 .9-1.2h25.2a.8.8 0 0 1 .9 1.2z" fill="#41D1FF" fillOpacity="0.2" stroke="#41D1FF" strokeWidth="1.5"/>
        <path d="M19.5 3L11 17h6l-3 11 11-15h-6.5l1-10z" fill="#FFD62E" stroke="#BD34FE" strokeWidth="1"/>
      </svg>
    ),
    desc: 'Lightning fast HMR & module bundler'
  },
];

const FEATURES = [
  {
    icon: <MapPin className="w-5 h-5 text-blue-500" />,
    title: 'GPS Geolocation & Reverse Geocoding',
    desc: "Uses browser's navigator.geolocation to capture precise lat/lng coordinates. Automatically converts to ward/street via OpenStreetMap Nominatim API.",
    po: 'PO2',
  },
  {
    icon: <Layers className="w-5 h-5 text-indigo-500" />,
    title: '5-Stage Finite State Machine (FSM)',
    desc: 'Ticket lifecycle enforces strict sequential transitions: PENDING_TRIAGE → IN_REVIEW → IN_PROGRESS → WORK_COMPLETED → RESOLVED_CLOSED. No stage can be skipped.',
    po: 'PO3',
  },
  {
    icon: <Clock className="w-5 h-5 text-amber-500" />,
    title: '48-Hour SLA & 2-Tier Auto-Escalation',
    desc: 'Background Node.js daemon polls every 12 seconds. Tier-1 escalates to Ward Engineer at 48h breach, Tier-2 to Commissioner at 96h breach.',
    po: 'PO3',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    title: 'Dynamic Priority Scoring Engine',
    desc: 'P = Wbase(severity) + 10·log₂(1 + upvotes) + SLAPenalty. Community upvotes amplify issue priority. Displayed as human-readable badges, not raw numbers.',
    po: 'PO4',
  },
  {
    icon: <Map className="w-5 h-5 text-cyan-500" />,
    title: 'Interactive Geospatial Map Hub',
    desc: 'Leaflet.js cartography plots all civic complaints with color-coded department pins. Nearest office locator with driving route steps and ETA.',
    po: 'PO5',
  },
  {
    icon: <Users className="w-5 h-5 text-violet-500" />,
    title: 'Role-Based Access Control (RBAC)',
    desc: '5 segregated dashboards: Citizen, Desk Officer, Field Crew, Ward Engineer, Municipal Commissioner — each with distinct permissions and views.',
    po: 'PO9',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-rose-500" />,
    title: 'Two-Factor Closure Gate',
    desc: 'Stage 4 requires mandatory "After Repair" photo from Field Crew. Stage 5 closure requires 6-digit OTP verification from the original complainant.',
    po: 'PO8',
  },
  {
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    title: '50m Haversine Duplicate Detector',
    desc: 'On submission, server calculates spherical great-circle distance from all active tickets. Alerts citizen if same-category issue exists within 50 metres.',
    po: 'PO2',
  },
];

const LIFECYCLE = [
  { stage: 1, key: 'PENDING_TRIAGE', label: 'Report Submitted', color: 'bg-amber-500', desc: 'GPS-locked, 48h countdown starts' },
  { stage: 2, key: 'IN_REVIEW', label: 'Jurisdiction Assigned', color: 'bg-blue-500', desc: 'Desk Officer tags dept & Ward Engineer' },
  { stage: 3, key: 'IN_PROGRESS', label: 'Work Order Issued', color: 'bg-indigo-500', desc: 'Field Crew dispatched, Contractor logged' },
  { stage: 4, key: 'WORK_COMPLETED', label: 'Repair Proof Uploaded', color: 'bg-purple-500', desc: '"After Repair" photo within 20m geofence' },
  { stage: 5, key: 'RESOLVED_CLOSED', label: 'Citizen OTP Sign-Off', color: 'bg-emerald-500', desc: '1–5 star rating + 6-digit OTP closure' },
];

const PO_MAP = [
  { code: 'PO1', title: 'Engineering Knowledge', desc: 'Full-stack separation: React SPA + Node Express REST API + JSON persistence layer.' },
  { code: 'PO2', title: 'Problem Analysis', desc: 'Haversine duplicate detection, Reverse geocoding, Sub-15m GPS telemetry validation.' },
  { code: 'PO3', title: 'Design / Development', desc: '5-Stage Finite State Machine + 48h SLA auto-escalation background daemon.' },
  { code: 'PO4', title: 'Investigation', desc: 'Logarithmic community-weighted priority scoring rendered as clean visual indicators.' },
  { code: 'PO5', title: 'Modern Tool Usage', desc: 'Leaflet.js cartography, OpenStreetMap routing, Web Geolocation API, Vite bundler.' },
  { code: 'PO6', title: 'Engineer & Society', desc: '1-vote community endorsement and public transparency Kanban board for citizens.' },
  { code: 'PO8', title: 'Ethics & Integrity', desc: 'Two-factor closure gate: field proof + complainant OTP prevents fake resolutions.' },
  { code: 'PO9', title: 'Teamwork / RBAC', desc: '5 isolated role dashboards: Citizen, Desk Officer, Field Crew, Engineer, Commissioner.' },
  { code: 'PO10', title: 'Communication', desc: 'Bilingual (English / Hindi) interface with WhatsApp issue-share cards.' },
  { code: 'PO11', title: 'Project Management', desc: 'SLA breach ledger with penalty hours tracking and downloadable CSV audit export.' },
];

export default function AboutSection() {
  return (
    <div className="space-y-10 pb-16">

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 md:p-12 shadow-2xl border border-blue-900/40">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #2563eb 0%, transparent 60%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-widest border border-blue-400/30 font-mono">
              Civic Technology Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            SAHAYAK <span className="text-blue-400">(सहायक)</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            A full-stack civic grievance reporting and municipal resolution platform that connects citizens directly with government authorities through a transparent, 5-stage lifecycle with a mandatory 48-Hour SLA guarantee.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            {['React 19 + Vite', 'Node.js Express REST API', 'Leaflet Geospatial Maps', 'Haversine Spatial Engine', '5-Stage FSM', 'RBAC (5 Roles)'].map(t => (
              <span key={t} className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white/80 text-xs font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Problem Statement ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Problem Statement</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
          In most Indian cities, everyday civic issues — potholes, overflowing garbage, broken streetlights, sewage leaks — remain unresolved for weeks or months due to systemic communication failures between citizens and municipal authorities.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Zero Transparency', desc: 'Once submitted, complaints enter a bureaucratic black box — citizens never know who is handling it.' },
            { title: 'No Priority Logic', desc: 'A hazardous open manhole is queued alongside a minor pothole with no urgency differentiation.' },
            { title: 'No Enforced SLA', desc: 'No fixed deadline forces officials to acknowledge or act on a complaint within any timeframe.' },
            { title: 'Fake Closures', desc: 'Authorities can mark repairs as "done" without on-site evidence, leaving issues unresolved.' },
          ].map(p => (
            <div key={p.title} className="flex gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <div>
                <div className="font-bold text-rose-800 dark:text-rose-300 text-sm">{p.title}</div>
                <div className="text-rose-700/80 dark:text-rose-400 text-xs mt-0.5 leading-relaxed">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5-Stage Lifecycle ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <GitBranch className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5-Stage Finite State Machine (FSM)</h2>
        </div>
        <div className="relative">
          {/* connector line */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="space-y-4">
            {LIFECYCLE.map((s, i) => (
              <div key={s.stage} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${s.color} text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm z-10`}>
                  {s.stage}
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{s.label}</span>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                      {s.key}
                    </span>
                    {i < LIFECYCLE.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
          <strong>Stage Reversion on Dispute:</strong> If the citizen disputes incomplete repair quality at Stage 5, the ticket automatically reverts to Stage 3 (<code>IN_PROGRESS</code>) with an escalated priority score — preventing permanent closure of unresolved issues.
        </div>
      </div>

      {/* ── Core Features ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Core Features & Engineering Decisions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="flex gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{f.title}</span>
                  <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">{f.po}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Architecture Diagram ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Architecture (3-Tier)</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              tier: 'Tier 1 — Presentation (Client)',
              color: 'border-blue-400 bg-blue-50 dark:bg-blue-950/30',
              badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
              items: ['React 19 SPA (Vite Build)', 'Tailwind CSS — Responsive, Dark Mode', 'Leaflet.js — Interactive Maps (OpenStreetMap)', 'Role-Segregated Dashboards × 5', 'Bilingual UI (EN / HI)'],
            },
            {
              tier: 'Tier 2 — Application (Server)',
              color: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30',
              badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
              items: ['Node.js + Express REST API Gateway', '5-Stage FSM Ticket Lifecycle Engine', 'Dynamic Priority Score Calculator', '48h SLA Background Polling Daemon', 'Haversine 50m Duplicate Blocker'],
            },
            {
              tier: 'Tier 3 — Data (Persistence)',
              color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
              badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
              items: ['tickets.json — Complaint registry', 'citizens.json — Registered citizen accounts', 'audit.json — Immutable transition log', 'announcements.json — Municipal broadcasts'],
            },
          ].map(tier => (
            <div key={tier.tier} className={`p-4 rounded-2xl border-l-4 ${tier.color}`}>
              <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded mb-3 ${tier.badge}`}>
                {tier.tier}
              </div>
              <div className="flex flex-wrap gap-2">
                {tier.items.map(item => (
                  <span key={item} className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech Stack ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-cyan-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TECH_STACK.map(t => (
            <div key={t.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center hover:shadow-sm transition-all group flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
                {t.icon}
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-xs">{t.name}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono uppercase">{t.category}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed hidden sm:block">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PO Mapping ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Program Outcomes (PO) Mapping</h2>
        </div>
        <div className="space-y-2">
          {PO_MAP.map(po => (
            <div key={po.code} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <span className="flex-shrink-0 font-black text-xs font-mono bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-lg min-w-[42px] text-center">
                {po.code}
              </span>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{po.title}: </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">{po.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-violet-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Team</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {TEAM_MEMBERS.map(m => (
            <div key={m.name} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex-1">
              <div className={`w-12 h-12 rounded-2xl ${m.color} text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm`}>
                {m.avatar}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{m.role}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{m.contribution}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Quick Links ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <h2 className="text-xl font-bold mb-2">Quick Navigation</h2>
        <p className="text-blue-100 text-sm mb-5">Jump to any section of the SAHAYAK platform to explore the demo.</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '📋 Public Complaint Feed', tab: 'feed' },
            { label: '🗺️ Geospatial Map Hub', tab: 'mapHub' },
            { label: '📊 Urgency Leaderboard', tab: 'leaderboard' },
            { label: '👤 Citizen Desk', tab: 'citizenPortal' },
            { label: '🏛️ Authority Dashboard', tab: 'authorityDashboard' },
            { label: '⏱️ SLA Tracker', tab: 'penalties' },
          ].map(link => (
            <a
              key={link.tab}
              href={`#${link.tab}`}
              onClick={e => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('sahayak:navigate', { detail: link.tab }));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-sm font-medium transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
