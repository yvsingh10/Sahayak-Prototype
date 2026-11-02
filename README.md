# SAHAYAK (सहायक) — Enterprise Civic Complaint Redressal & Geospatial Resolution Platform

> **Next-Generation Civic Infrastructure Grievance Gateway**  
> Full-Stack Architecture (React 19 + Node.js Express REST API + PostGIS-Ready Spatial Engine)

---

## 🏛 Executive Architectural Summary

**SAHAYAK** is an enterprise-grade civic grievance reporting and municipal resolution platform connecting citizens directly with competent government departments. It enforces strict identity assurance through Citizen Unique IDs (`C-UID`), hardware sensor GPS locks with sub-15m accuracy validation, an immutable 5-stage finite state machine lifecycle, non-pausable 48-Hour SLA auto-escalations, and a 100% Clean UI Directive.

```
SAHAYAK Platform Architecture:
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT PRESENTATION LAYER                       │
│  React 19 SPA · Tailwind CSS · Vector Maps (Leaflet / Google Maps)     │
│  5 Segregated Role Dashboards · Bilingual (EN/HI) · Dark Mode (WCAG)   │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ REST API / WebSocket
┌─────────────────────────────────▼──────────────────────────────────────┐
│                        NODE.JS EXPRESS API GATEWAY                     │
│  /api/tickets · /api/auth · /api/stats · 5-Stage Life-Cycle Pipeline   │
├────────────────────────────────────────────────────────────────────────┤
│  ⚡ Dynamic Priority Engine   │ ⏱ 48h SLA & Auto-Escalation Daemon    │
│  🔒 Anti-Spoofing Geo-Lock    │ 📜 Immutable Append-Only Audit Trail   │
│  🚫 50m Duplicate Blocker     │ 💰 Department Penalty Ledger           │
├────────────────────────────────────────────────────────────────────────┤
│                    PERSISTENT SPATIAL & DATA STORES                    │
│  tickets.json · audit.json · citizens.json · announcements.json        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Core Architectural Constraints & Implementation

### 1. Strict Identity & RBAC (5 Distinct Personas)
* **Permanent C-UID**: Generated cryptographically upon sign-up (e.g., `C-UID-2026-IND-08241`, `C-UID-2026-UP-39469`).
* **DigiLocker / Aadhaar KYC**: Verified community reporter trust badge.
* **5 Dedicated Dashboards**:
  1. **Citizen Portal**: My complaints, endorsements, Stage 5 OTP sign-off, dispute quality button, 1–5 star ratings.
  2. **Departmental Desk Officer**: Dedicated queue for assigned department, jurisdiction review, Ward Engineer assignment, 1-click inter-department forwarding.
  3. **Field Verification Crew**: Mobile-optimized work orders, 20m geofence check-in, "After Repair" photographic proof upload, expense & material tracking.
  4. **Ward Executive Engineer**: Zonal boundary jurisdiction, contractor work order assignment, delay warnings (>24h).
  5. **Nodal Municipal Commissioner**: Master umbrella oversight, Tier-1 & Tier-2 escalation queues, department penalty ledger, Ward Hall of Fame & Shame, 1-click PDF report card generator.

### 2. Direct Hardware Geo-Lock & Telemetry
* **Sensor-Direct Coordinates**: Extracts Latitude & Longitude down to 6-decimal precision using `navigator.geolocation`.
* **<15m Accuracy Validation**: Horizontal error strictly checked before submission is permitted.
* **Tamper & Anti-Spoofing Guard**: Rejects simulated/mock coordinates through timestamp checking and antenna corroboration.
* **Automated Reverse Geocoding**: Translates (lat, lng) into official Street, Ward, District, State, and Pincode.
* **50-Meter Duplicate Complaint Blocker**: Haversine distance spatial check alerting citizen if identical failure is already logged within 50 meters.

### 3. Clean UI Directive
* **Zero Formula Clutter**: Strictly removes raw mathematical equations ($P(t) = W_{\text{base}} + 10 \cdot \log_2(1+U)$) from public view.
* **Human-Readable Indicators**:
  * **Priority Badges**: "Critical Hazard", "High Urgency", "Elevated Priority", "Normal Maintenance".
  * **Urgency Progress Meter**: Visual progress bar (0–100%) with color gradations (Emerald $\rightarrow$ Amber $\rightarrow$ Rose).
  * **SLA Countdown Chips**: "18 Hours Remaining for Review", "Tier-1 Auto-Escalated (4h Overdue)".

### 4. Google Maps, Navigation & Government Office Directory
* **Interactive Cartography Hub**: Vector map with high-contrast custom pins color-coded by the 5 departments.
* **Nearest Office Query**: Dynamic lookup for nearest PWD Circle, Jal Vibhag, Sanitation Depot, or Electricity Substation.
* **Turn-by-Turn Navigation**: Fastest driving and walking route polyline with ETA, distance, and direction instructions.
* **Live Traffic Congestion Simulation**: Visualized green/amber/red road segments along dispatch route.
* **Street View 360 Integration**: Direct 360 panoramic view launch on issue coordinates.
* **Nearby Essential Facilities**: Secondary pins displaying nearest Fire Station, Public Hospital, and Water Tank Station.

### 5. Strict 5-Stage Life-Cycle Pipeline (FSM)
1. **Stage 1: [Report Submitted / PENDING_TRIAGE]**: GPS hardware locked, 48-Hour SLA gate initiated.
2. **Stage 2: [Jurisdiction Assigned & Desk Verified / IN_REVIEW]**: Desk Officer identifies competent department and assigns Ward Engineer.
3. **Stage 3: [Work Order Issued & Field Dispatched / IN_PROGRESS]**: Field crew mobilized, Contractor ID logged.
4. **Stage 4: [Resolution Proof Uploaded / WORK_COMPLETED]**: Field crew uploads mandatory "After Repair" photo within 20m geofence.
5. **Stage 5: [Citizen Satisfied & Biometric/OTP Sign-off / RESOLVED & CLOSED]**: Original complainant verifies quality, rates 1–5 stars, and signs off with 6-digit OTP.
* **Stage Reversion & Dispute**: Complainant rejection returns ticket to Stage 3 with escalated priority.

### 6. Departmental Segregation
Strict isolation across 5 municipal bodies:
1. `Water Supply & Sewage`
2. `Electricity & Power`
3. `Roads & Infrastructure`
4. `Solid Waste & Cleanliness`
5. `Public Health & Safety`

---

## 📋 Complete Breakdown of the 100 Enterprise Features

| Module | Features Included |
|---|---|
| **Module 1: Authentication, C-UID & Profile** | 1. Self-Registration · 2. Cryptographic C-UID (`C-UID-2026-IND-XXXX`) · 3. MFA 6-digit OTP · 4. JWT & Biometric WebAuthn · 5. Single-Click Logout · 6. DigiLocker KYC · 7. Profile Management · 8. Home Ward Auto-Binding · 9. 5-Role RBAC · 10. DPDP Phone Masking |
| **Module 2: Hardware Geo-Location & Telemetry** | 11. Sensor GPS Extraction · 12. Accuracy `<15m` Check · 13. Anti-Spoofing Guard · 14. Server Reverse Geocode · 15. Offline LocalStorage Cache · 16. Sub-Meter Micro Drag · 17. Polygon Boundary Match · 18. EXIF Metadata Scrubber · 19. Haversine Distance Calc · 20. Proximity Hazard Alerts |
| **Module 3: Maps, Routing & Office Directory** | 21. Vector Map Hub · 22. Nearest Government Office Locator · 23. Turn-by-Turn Navigation · 24. Live Traffic Congestion · 25. Ward Density Clusters · 26. Office Contact Card · 27. Street View 360 Launch · 28. 'Take Me There' Deep-Link · 29. GeoJSON Jurisdiction Overlays · 30. Nearby Facilities (Hospital, Fire, Tanker) |
| **Module 4: Grievance Submission & Evidence** | 31. Hardware Camera In-App Capture · 32. Dual-Photo Evidence (Wide & Close-up) · 33. Short Video Clips · 34. 30s Speech-to-Text Voice Notes · 35. Client WebP Compression · 36. SHA-256 Asset Checksum · 37. 50m Duplicate Blocker · 38. 5-Dept Dropdown · 39. Public vs. Confidential Toggle · 40. Draft Auto-Save |
| **Module 5: Clean UI & Citizen Experience** | 41. No-Formula Display Policy · 42. Visual Urgency Meter · 43. English / Hindi Bilingual Toggle · 44. Dark & High-Contrast Mode · 45. Tailwind Card Feed · 46. Instant Search & Filters · 47. SLA Countdown Chips · 48. Reactive Transitions · 49. Visual 5-Stage Stepper · 50. WhatsApp & Twitter Quick-Share Cards |
| **Module 6: Five-Stage Tracking Life-Cycle** | 51. Stage 1 PENDING_TRIAGE · 52. Stage 2 IN_REVIEW · 53. Stage 3 IN_PROGRESS · 54. Stage 4 WORK_COMPLETED · 55. Stage 5 RESOLVED_CLOSED · 56. Citizen Dispute Reversion · 57. Immutable Transition Audit · 58. Real-time Toast Notifications · 59. >24h Stage Delay Warning · 60. Interactive Lifecycle Stepper |
| **Module 7: Segregation & Authority Portals** | 61. Water & Sewage Portal · 62. Electricity & Power Portal · 63. Roads & Highways Portal · 64. Solid Waste Portal · 65. Public Safety Portal · 66. 1-Click Inter-Dept Forwarding · 67. Department Workload Matrix · 68. Contractor Assignment · 69. Authority Private Notes · 70. Commissioner Master Oversight |
| **Module 8: Amplification & Transparency** | 71. 1-Vote Community Endorsement · 72. Anti-Brigading Limiter · 73. Public 5-Stage Kanban Board · 74. Neighborhood Comment Thread · 75. Priority Amplification Daemon · 76. Ward Hall of Fame & Shame · 77. 1–5 Star Quality Grading · 78. Impacted Residents Counter · 79. Before/After Split Comparison Slider · 80. Community Bulletin Broadcast |
| **Module 9: 48-Hour SLA & Auto-Escalation** | 81. Mandatory 48h Countdown Clock · 82. Tier-1 Auto-Escalation (Ward Engineer) · 83. Tier-2 Super-Escalation (Commissioner) · 84. Urgency Score Spike Trigger · 85. Red Pulsing Breach Alerts · 86. Department Penalty Ledger · 87. Automated Breach Dispatcher · 88. SLA Pause Guard · 89. Escalation Reversal Lock · 90. Overdue Grievance CSV Export |
| **Module 10: Analytics, Auditing & Control** | 91. Append-Only Audit Ledger · 92. KPI Analytics (Avg Turnaround & Compliance) · 93. GeoJSON Spatial Export · 94. Before/After Photo Pair Verification · 95. 20m Field Geofence Check-In · 96. Municipal Expense Tracking · 97. Emergency SOS Disaster Flag · 98. PDF Report Card Generator (PO1–PO11) · 99. Point-in-Time Data Recovery · 100. Live System Health Ping Monitor |

---

## 🚀 Quickstart & Verification

### 1. Running the Integrated Full-Stack Server
```bash
# Start Node.js Express server & serves compiled React application
npm start
# Access at: http://localhost:7000
```

### 2. Running Automated Test Suite
```bash
# Runs in-memory regression suite verifying all 10 modules
node test_direct.js
```

### 3. Key Interactive Flows to Evaluate
1. **Public Board & Kanban**: Open [http://localhost:7000](http://localhost:7000) $\rightarrow$ explore the feed, switch to **5-Stage Kanban** to see complaints partitioned across columns.
2. **Interactive Map Hub**: Switch to **Interactive Map & Hub** $\rightarrow$ click any civic pin to view turn-by-turn dispatch route to the nearest government office, live traffic overlay, and 360&deg; Street View launcher.
3. **Hardware Geo-Lock Grievance Submission**: Click "+ Report Problem" $\rightarrow$ verify native GPS latitude & longitude down to 6 decimals, $<15$m accuracy lock, automated reverse geocoding, and duplicate complaint blocker.
4. **Authority Desk Verification & Proof Upload**: Switch role to **Desk Officer (Arvind Narula)** $\rightarrow$ approve triage and assign Ward Engineer $\rightarrow$ switch to **Field Crew** $\rightarrow$ upload "After Repair" photograph with 20m geofence validation and repair costs.
5. **Citizen Closure & Dispute**: Switch to **Yash Singh (Citizen)** $\rightarrow$ inspect ticket `SAH-MUM-6088` (Work Completed) $\rightarrow$ interact with the **Before/After Photo Comparison Slider** $\rightarrow$ click **Confirm Closure ✓** to rate 5 stars and sign off with OTP.

---

## 🏆 Program Outcomes (PO1–PO11) Mapping

* **PO1 (Engineering Knowledge)**: Full-stack separation (React 19 + Node.js Express REST API) with cryptographic C-UID generation and SHA-256 asset hashing.
* **PO2 (Problem Analysis)**: Automated reverse geocoding and sub-15m GPS telemetry verification.
* **PO3 (Design/Development)**: Strict 5-Stage Life-Cycle Finite State Machine with 48h SLA auto-escalation daemon.
* **PO4 (Investigations of Complex Problems)**: Dynamic logarithmic priority server calculation rendered into clean formula-free visual indicators.
* **PO5 (Modern Tool Usage)**: Leaflet vector cartography, Google Maps Directions routing, and Web Speech API voice notes.
* **PO6 (Engineer & Society)**: 1-vote community endorsement and public transparency Kanban view.
* **PO7 (Environment & Sustainability)**: Municipal expense and material quantity tracking for civic infrastructure durability.
* **PO8 (Ethics & Integrity)**: Two-factor closure gate requiring field proof within 20m and citizen OTP sign-off.
* **PO9 (Team Work & RBAC)**: Strict separation across Citizens, Desk Officers, Field Crews, Ward Engineers, and Commissioners.
* **PO10 (Communication)**: Bilingual interface (English & Hindi) with WhatsApp/Twitter mobilization cards.
* **PO11 (Project Management & Finance)**: Municipal penalty ledger enforcing statutory fines for SLA delays.
