# SAHAYAK (सहायक) — Public Problem Reporting & Geospatial Resolution Platform

> **Project-Based Learning (PBL) — Evaluation 2 Prototype**  
> **Course:** CSCR2600 (Project Design & Implementation) | **Target:** 2nd Year B.Tech CSE  
> **Stack:** React 19 (Vite) + Node.js (Express REST API) + Leaflet Geospatial Maps

---

## 📌 1. Project Overview & Problem Statement

In most urban and semi-urban localities, everyday civic issues (such as potholes, overflowing garbage dumps, sewage leaks, broken streetlights, and contaminated water pipelines) remain unresolved for weeks. 

### Core Issues Identified:
1. **Zero Transparency:** Citizens submit complaints into a bureaucratic black box with no visibility into which department or officer is assigned.
2. **No Priority Mechanism:** Urgent, hazardous problems (e.g., an open manhole on a busy road) are treated with the same priority as minor routine repairs.
3. **Delayed Approvals & Lack of SLAs:** Complaints languish for days without acknowledgment because there is no enforced deadline.
4. **Status Unawareness & Fake Closures:** Citizens have no way to verify whether the work was actually completed on the ground before a ticket is closed.

**SAHAYAK** solves this by establishing a transparent, time-bound, 5-stage civic grievance redressal gateway with a **mandatory 48-hour SLA approval guarantee**, community-driven urgency prioritization, interactive geospatial mapping, and two-factor closure verification.

---

## 🏛 2. System Architecture

SAHAYAK follows an industry-standard **3-Tier Client-Server Architecture**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER (React 19 SPA)                     │
│  · Vite Fast Build Engine · Tailwind CSS Utility Styling               │
│  · Interactive Leaflet Cartography Hub (OpenStreetMap / Custom Pins)   │
│  · Role-Segregated Dashboards (Citizen, Desk Officer, Field Crew, etc.)│
│  · Bilingual Localization (English / Hindi) & Responsive Dark Mode    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON REST API
┌───────────────────────────────────▼────────────────────────────────────┐
│                    APPLICATION TIER (Node.js & Express)                │
│  · RESTful API Gateway (/api/tickets, /api/auth, /api/stats)           │
│  · 5-Stage Lifecycle State Machine (PENDING → IN_PROGRESS → RESOLVED)  │
│  · Dynamic Priority Engine: P = Base + 10·log2(1 + Upvotes) + Escalation│
│  · 48-Hour SLA Tracking Daemon with 2-Tier Auto-Escalation Engine     │
│  · Haversine Spatial Duplicate Detection (< 50 meters)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ File I/O Persistence
┌───────────────────────────────────▼────────────────────────────────────┐
│                      DATA TIER (Structured JSON Stores)                │
│  · tickets.json · citizens.json · announcements.json · audit.json      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 3. Key Core Modules & Features

### Module 1: Citizen Grievance Submission & Telemetry
* **Browser Geolocation API (`navigator.geolocation`):** Captures high-precision latitude and longitude coordinates directly from the client device.
* **Automated Reverse Geocoding:** Translates raw coordinates into human-readable Street, Ward, City, and Pincode via OpenStreetMap Nominatim.
* **Haversine Duplicate Detection:** Calculates the spherical distance between a newly reported issue and active complaints within a 50-meter radius to eliminate duplicate reports.
* **Photo Evidence Upload:** Citizens can upload or take live camera photos with client-side WebP compression.

### Module 2: Strict 5-Stage Life-Cycle Pipeline (Finite State Machine)
Every civic ticket transitions through an immutable 5-stage lifecycle:
1. **Stage 1 [PENDING_TRIAGE]:** Problem lodged by citizen; 48-Hour SLA countdown begins.
2. **Stage 2 [IN_REVIEW]:** Desk Officer verifies jurisdiction, tags competent department, and assigns the Ward Engineer.
3. **Stage 3 [IN_PROGRESS]:** Ward Engineer dispatches Field Crew and logs Contractor Work Order ID.
4. **Stage 4 [WORK_COMPLETED]:** Field Crew finishes repairs and uploads mandatory "After Repair" photographic proof with cost and material receipts.
5. **Stage 5 [RESOLVED_CLOSED]:** Original citizen inspects the repair proof, rates quality (1–5 stars), and verifies completion with a 6-digit OTP sign-off.
   * *Stage Reversion on Dispute:* If the citizen disputes the repair quality, the ticket automatically reverts to Stage 3 with an elevated priority badge.

### Module 3: 48-Hour SLA & 2-Tier Auto-Escalation Engine
* **Non-Pausable 48h Countdown:** Every ticket must be acknowledged and triaged within 48 hours.
* **Tier-1 Escalation (48h Breach):** If untreated past 48 hours, the ticket escalates to the Ward Executive Engineer.
* **Tier-2 Super-Escalation (96h Breach):** Unresolved tickets past 96 hours escalate directly to the Municipal Commissioner's radar, generating an overdue audit record.
* **SLA Breach Ledger:** Tracks overdue hours and generates downloadable CSV audit logs for administrative accountability.

### Module 4: Dynamic Priority Calculation Engine
Instead of arbitrary manual sorting, urgency is computed dynamically:
$$\text{Priority Score} = W_{\text{base}}(\text{Severity}) + 10 \cdot \log_2(1 + \text{Community Upvotes}) + \text{SLA Penalty}$$
* **Hazard Categories:** Roads (Potholes), Water/Sewage leaks, Electrical hazards, Solid waste dumping, Public safety.
* **Community Endorsements (Upvotes):** Local residents can upvote an issue to push pressing neighborhood hazards higher up the municipal priority queue.
* **Clean UI Directive:** The system hides raw mathematical formulas from citizens and displays intuitive badges: *Critical Hazard*, *High Urgency*, *Elevated Priority*, and *Normal Maintenance*.

### Module 5: Interactive Geospatial Cartography (Leaflet.js)
* **Visual Map Hub:** Interactive map plotting all active complaints with color-coded department markers.
* **Nearest Municipal Office Locator:** Dynamically queries and pins the nearest PWD Circle Office, Jal Sansthan, or Sanitation Depot.
* **Routing & Directions:** Displays driving distance, estimated transit time, and turn-by-turn route steps from the issue site to the handling authority.

### Module 6: Role-Based Access Control (RBAC)
Includes 5 pre-configured demo personas to showcase end-to-end multi-role workflows:
1. **Citizen (Yash Singh):** File complaints, track active tickets, endorse neighborhood issues, sign off on repairs with OTP.
2. **Desk Officer (Arvind Narula):** Triage complaints, assign competent municipal department, or forward across departments.
3. **Field Crew (Ramesh Kumar):** View mobile work orders, upload completion photos and material costs.
4. **Ward Engineer (Er. Vikram Malhotra):** Monitor zonal complaints, assign contractors, review SLA warnings.
5. **Municipal Commissioner (Dr. Neha Saxena):** Master oversight, city-wide compliance metrics, escalated grievances, and SLA audit reports.

---

## 🛠 4. Technology Stack & Implementation Details

| Layer | Technology | Role & Justification |
|---|---|---|
| **Frontend Framework** | React 19 (SPA) with Vite | Fast component re-renders, reactive state management, high performance |
| **Styling** | Tailwind CSS | Clean, responsive, mobile-first design with built-in Dark Mode |
| **Geospatial Mapping** | Leaflet.js & OpenStreetMap | Lightweight vector cartography with zero third-party paid API dependencies |
| **Backend Framework** | Node.js with Express.js | Asynchronous, event-driven REST API handling ticket CRUD and SLA tracking |
| **Data Persistence** | In-Memory + JSON Stores | Fast filesystem-backed atomic persistence (`tickets.json`, `audit.json`) |
| **Mathematical Engine** | Haversine Formula & Log Scoring | Spatial distance calculation and community-weighted priority scoring |
| **Icons & Localization** | Lucide-React & Custom i18n | Clean UI icons, English and Hindi bilingual interface |

---

## 📊 5. Evaluation Rubric & Program Outcome (PO) Mapping

This project is directly mapped to the standard **Engineering Program Outcomes (PO1–PO11)** for CSCR2600 Evaluation:

* **PO1 (Engineering Knowledge):** Applied client-server REST architecture, Haversine spatial trigonometry, and logarithmic scaling.
* **PO2 (Problem Analysis):** Identified lack of civic transparency and designed a 48-Hour SLA gate to resolve administrative bottlenecks.
* **PO3 (Design / Development of Solutions):** Built a 5-Stage Finite State Machine ensuring no complaint is closed without citizen OTP confirmation.
* **PO5 (Modern Tool Usage):** Integrated modern web development tools: React 19, Vite, Tailwind CSS, Leaflet.js, and Node Express.
* **PO6 (The Engineer & Society):** Direct community impact: empowers citizens to mobilize action on hazardous civic infrastructure.
* **PO8 (Ethics & Integrity):** Two-factor closure gate prevents authorities from falsely marking unfinished work as completed.
* **PO10 (Communication):** Clean UI with bilingual support (English/Hindi) and structured presentation script for technical viva.

---

## 💻 6. Quickstart: How to Run Locally

### Prerequisites:
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Steps:

1. **Install Dependencies:**
   ```bash
   # In the root project directory:
   npm install
   ```

2. **Build the React Frontend:**
   ```bash
   npm run build
   ```

3. **Start the Integrated Server:**
   ```bash
   npm start
   ```

4. **Access the Application:**
   Open your browser and navigate to:
   ```
   http://localhost:7000
   ```

5. **Run Automated Test Suite (Optional):**
   ```bash
   node test_direct.js
   ```

---

## 🎯 7. Suggested Viva Demonstration Flow (For Evaluation)

1. **Step 1 — Public Grievance Feed:** Open [http://localhost:7000](http://localhost:7000) $\rightarrow$ demonstrate the public card feed, instant search, city filter, and the 5-Stage Kanban view.
2. **Step 2 — Submit a Grievance:** Click **+ Report Grievance** $\rightarrow$ show automatic latitude/longitude capture via browser GPS $\rightarrow$ show reverse geocoding to ward/street $\rightarrow$ submit ticket.
3. **Step 3 — Desk Officer Triage:** Click **Select Role** $\rightarrow$ switch to **Desk Officer (Arvind Narula)** $\rightarrow$ open the newly submitted complaint $\rightarrow$ approve triage and assign Ward Engineer.
4. **Step 4 — Field Crew Proof Upload:** Switch role to **Field Crew (Ramesh Kumar)** $\rightarrow$ upload "After Repair" photograph and log material costs $\rightarrow$ ticket moves to Stage 4 (Work Completed).
5. **Step 5 — Citizen Verification & OTP Closure:** Switch back to **Citizen (Yash Singh)** $\rightarrow$ open the complaint $\rightarrow$ inspect Before/After photo comparison slider $\rightarrow$ verify with 6-digit OTP to officially close the ticket (Stage 5).
6. **Step 6 — Geospatial Hub & SLA Tracker:** Show the **Geospatial Map** tab (Leaflet markers and route directions) and the **SLA Tracker** tab (48-hour compliance and overdue complaints).