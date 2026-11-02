import React from 'react';
import { 
  CheckCircle2, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Users, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

const MODULES = [
  {
    num: "Module 1",
    title: "Authentication, C-UID & Citizen Profile (Features 1–10)",
    features: [
      "Citizen Onboarding & Self-Registration via Phone, Email, and Name",
      "Cryptographically secure Citizen Unique ID (e.g., C-UID-2026-IND-08241)",
      "Multi-Factor Auth (MFA): 6-digit OTP verification simulation",
      "Secure Login & Session Management with Biometric / WebAuthn simulation",
      "Single-Click Secure Logout & session invalidation",
      "Citizen KYC & DigiLocker trust badge integration",
      "Profile Management & Emergency Contact preferences",
      "Ward & Zone Auto-Binding based on address with commuter override",
      "Role-Based Access Control (RBAC): 5 distinct isolated dashboards",
      "Data Privacy & DPDP Compliance: Phone masking and cryptographic hashes"
    ]
  },
  {
    num: "Module 2",
    title: "Hardware Geo-Location & GPS Telemetry (Features 11–20)",
    features: [
      "Phone Sensor GPS Extraction via HTML5 navigator.geolocation",
      "GPS Accuracy Validation: strictly enforces <15m horizontal error threshold",
      "Tamper & Anti-Spoofing Guard with timestamp & cell bounds checking",
      "Automated Reverse Geocoding into State, District, Ward, and Postal Code",
      "Offline Coordinate Cache in LocalStorage / IndexedDB for low-connectivity zones",
      "Sub-Meter Marker Drag: micro-pin adjustment on vector cartography",
      "Ward Polygon Boundary Matching confirming municipal jurisdiction",
      "Exif Metadata Scrubber & Extractor: stripping personal EXIF metadata",
      "Haversine Location Distance Calculator computing distance to issue & offices",
      "Proximity Alerts: background banner notification when viewing active hazard zones"
    ]
  },
  {
    num: "Module 3",
    title: "Google Maps, Navigation & Government Office Directory (Features 21–30)",
    features: [
      "Interactive Google Maps / Leaflet Vector Hub with department-colored pins",
      "Nearest Government Office Locator with dynamic distance and routing",
      "Turn-by-Turn Route Navigation polyline with driving and walking directions",
      "Live Traffic Congestion Overlay simulation along dispatch paths",
      "Ward Heatmap Clustering with density counts and hotspot indicators",
      "Office Contact Card: nodal officer name, designated email, direct phone & hours",
      "Street View Integration: 360-degree panoramic view launch directly on coordinates",
      "One-Tap 'Take Me There': mobile deep-linking to native Google/Apple Maps",
      "Jurisdiction Boundary Overlays: GeoJSON borders for administrative zones",
      "Nearby Essential Facilities: secondary pins for fire stations, hospitals, and water tankers"
    ]
  },
  {
    num: "Module 4",
    title: "Grievance Submission & Evidence Ingestion (Features 31–40)",
    features: [
      "Camera In-App Capture triggering hardware camera to prevent stock photo fraud",
      "Dual-Photo Evidence Support: wide-angle view and close-up detail photos",
      "Short Video Clips: 10-second compressed video clip attachment",
      "Audio Voice-Note Description: 30-second speech-to-text recording in native dialects",
      "Client-Side WebP Compression reducing upload payload by 70%",
      "SHA-256 File Hashing per asset to guarantee cryptographic chain of custody",
      "50-Meter Duplicate Complaint Blocker alerting users to existing nearby tickets",
      "Issue Category Dropdown spanning all 5 segregated municipal bodies",
      "Public vs. Confidential Toggle obscuring citizen identity on public boards",
      "Draft Auto-Save in LocalStorage preventing data loss during network drops"
    ]
  },
  {
    num: "Module 5",
    title: "Clean UI & Citizen Experience (Features 41–50)",
    features: [
      "Clean UI Directive: Raw mathematical formulas strictly hidden from public view",
      "Human-Readable Urgency Meter: color-coded priority bar and clean badges",
      "Bilingual / Multilingual Switcher: one-click toggle between English and Hindi",
      "Dark & WCAG High-Contrast Mode for night accessibility",
      "Modern Card-Based Feed styled with clean Tailwind typography and status chips",
      "Instant Search & Multi-Filter by Ward, Category, Status, and Date",
      "Human-Friendly 48-Hour SLA Countdown timer chip",
      "Smooth visual transitions and reactive state updates",
      "Visual 5-Stage Life-Cycle Pipeline Stepper tracking ticket progress",
      "Quick-Share Generator creating WhatsApp and Twitter / X summary cards"
    ]
  },
  {
    num: "Module 6",
    title: "Five-Stage Tracking Life-Cycle (Features 51–60)",
    features: [
      "Stage 1 [PENDING_TRIAGE]: GPS locked, 48-Hour SLA gate initiated",
      "Stage 2 [IN_REVIEW]: Desk officer verifies jurisdiction and assigns Ward Engineer",
      "Stage 3 [IN_PROGRESS]: Work order dispatched, field crew mobilized, contractor ID logged",
      "Stage 4 [WORK_COMPLETED]: Field team uploads mandatory 'After Repair' photo proof",
      "Stage 5 [RESOLVED_CLOSED]: Complainant verifies quality, rates work (1–5 stars) & OTP sign-off",
      "Stage Reversion & Dispute: Citizen rejection returns ticket to Stage 3 with escalation",
      "Stage Transition Timestamps: Immutable audit trail logged for every milestone shift",
      "Automated Stage Push Notifications and floating toast alerts",
      "Stage Delay Warnings: yellow alert badge when a ticket spends >24h in a single stage",
      "Interactive 5-Stage Visual Stepper inside ticket details modal"
    ]
  },
  {
    num: "Module 7",
    title: "Departmental Segregation & Authority Portals (Features 61–70)",
    features: [
      "Water Supply & Sewage Portal: pipeline bursts, contamination, valve leaks",
      "Electricity & Power Board Portal: tripping transformers, high-voltage exposed cables",
      "Roads & Infrastructure Authority Portal: asphalt cave-ins, potholes, resurfacing",
      "Solid Waste & Cleanliness Portal: dumpster overflows, compactor routing",
      "Public Health & Safety Portal: hazardous encroachments, fire access blockages",
      "1-Click Inter-Departmental Forwarding when issue spans multiple bodies",
      "Department Workload Matrix: real-time queue volume comparison across divisions",
      "Contractor / Field Crew Assignment with registered vendor ID binding",
      "Internal Private Notes: authority comments invisible to the public complainant",
      "Executive Commissioner Oversight: master umbrella inspection of all backlogs"
    ]
  },
  {
    num: "Module 8",
    title: "Community Amplification & Public Transparency (Features 71–80)",
    features: [
      "1-Vote Community Endorsement per C-UID to highlight neighborhood urgency",
      "Anti-Brigading Vote Limiter enforcing strict 1 vote per account",
      "Public Transparency Board: Open Kanban view with 5 milestone columns",
      "Neighborhood Comment Thread with secondary photos for local corroboration",
      "Priority Amplification Daemon automatically increasing visibility with upvotes",
      "Ward Hall of Fame & Shame: rankings of fastest-resolving vs delayed wards",
      "Citizen Resolution Confirmation: 1-to-5 star quality grading and feedback",
      "Social Proof Count: counter showing impacted nearby residents",
      "Interactive Before/After Photo Comparison Slider evaluating repair quality",
      "Community Announcement Broadcast: municipal bulletin for planned maintenance"
    ]
  },
  {
    num: "Module 9",
    title: "48-Hour SLA Gateway & Auto-Escalation Engine (Features 81–90)",
    features: [
      "Mandatory 48-Hour Triage Clock starting the millisecond ticket enters Stage 1",
      "Tier-1 Auto-Escalation: unacknowledged tickets at 48h escalate to Ward Engineers",
      "Tier-2 Super-Escalation: unresolved tickets at 96h escalate to Municipal Commissioner",
      "Urgency Score Spike Trigger: auto-escalates if community endorsements climb",
      "SLA Breach Visual Alert: escalated tickets pulse red and rank at top of action queue",
      "Departmental Penalty Ledger: automatic fine calculations against officer registers",
      "Automated Breach Alerts and escalation notifications",
      "SLA Pause Guard blocking arbitrary pauses unless classified as severe disaster",
      "Escalation Reversal Lock: cannot de-escalate without verified work proof",
      "Overdue Grievance Export: 1-click CSV download for legislative oversight"
    ]
  },
  {
    num: "Module 10",
    title: "Analytics, Auditing & Administrative Control (Features 91–100)",
    features: [
      "Tamper-Proof Audit Log: append-only ledger of every status change and dispatch note",
      "Departmental KPI Analytics: resolution time, SLA compliance %, citizen satisfaction",
      "GeoJSON Spatial Data Export: standardized complaint export for GIS analysis",
      "Automated Before/After Photo Pair Verification with interactive split slider",
      "Field Worker Geofence Check-In verifying crew was physically within 20m of site",
      "Municipal Expense Tracking: itemized repair cost and material quantities",
      "Emergency SOS Disaster Flag bypassing triage to rapid response squad",
      "1-Click PDF Report Card Generator with PO1–PO11 Program Outcome mapping",
      "Automated Daily Backups indicator & point-in-time state recovery",
      "Live System Health Monitor: real-time ping monitor tracking database, map API, daemon"
    ]
  }
];

export default function ArchitectureSpec() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 uppercase font-mono">
            Enterprise Architecture Specification
          </span>
          <span className="text-xs text-slate-500">100 Enterprise Features Across 10 Modules</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          SAHAYAK Civic Grievance &amp; Geospatial Resolution Architecture
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive breakdown of all 100 features implemented across the full-stack architecture — featuring strict 5-stage life-cycle enforcement, direct hardware geo-lock (&lt;15m accuracy), clean UI directive, and full role segregation.
        </p>
      </div>

      {/* 10 Modules Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MODULES.map(m => (
          <div key={m.num} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {m.num}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {m.title}
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs">
              {m.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 leading-snug">
                  <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
}
