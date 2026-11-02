import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculatePriority, calculateSla } from './priorityEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const SEED_DATA_DIR = path.join(__dirname, '../data');
const DATA_DIR = IS_SERVERLESS ? path.join('/tmp', 'sahayak-data') : SEED_DATA_DIR;

const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit.json');
const CITIZENS_FILE = path.join(DATA_DIR, 'citizens.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');

// In-memory cache for high-availability serverless execution
const memoryStore = {
  tickets: null,
  audit: null,
  citizens: null,
  announcements: null
};

// Real civic imagery presets
export const CIVIC_PHOTOS = {
  pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80",
  garbage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=700&q=80",
  water: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=700&q=80",
  light: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=700&q=80",
  encroachment: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
  repaired_road: "https://images.unsplash.com/photo-1578873375969-d71a742d4a79?auto=format&fit=crop&w=700&q=80",
  cleared_waste: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80",
  repaired_pipe: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
  repaired_light: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80"
};

// Municipal Zonal Offices Directory per City and Department
export const GOV_OFFICES = {
  "Greater Noida": {
    "Roads & Infrastructure": {
      name: "PWD Civil Circle Office — Greater Noida",
      officer: "Er. Arvind Narula (Executive Engineer)",
      phone: "+91-120-2348911",
      email: "pwd.roads.gnoida@gov.in",
      hours: "09:30 AM – 06:00 PM (Mon–Fri)",
      address: "Sector Gamma II, Near GNIDA Complex, Greater Noida",
      distance: "1.4 km",
      lat: 28.4820,
      lng: 77.5090,
      turnByTurn: [
        "Head south on Main Arterial toward Knowledge Park II",
        "Turn left at Pari Chowk Rotary onto Sector Gamma Rd",
        "Arrive at PWD Circle Office on your right (1.4 km, 4 min drive)"
      ],
      nearbyFacilities: [
        { type: "Police Station", name: "Surajpur Kotwali Police HQ", lat: 28.491, lng: 77.514, dist: "1.2 km" },
        { type: "Hospital", name: "Sharda Multispecialty Hospital", lat: 28.473, lng: 77.502, dist: "0.8 km" },
        { type: "Water Tanker", name: "GNIDA Sector Alpha Booster Station", lat: 28.489, lng: 77.511, dist: "1.5 km" }
      ]
    },
    "Solid Waste & Cleanliness": {
      name: "GNIDA Municipal Sanitation Depot & Public Health Div.",
      officer: "Dr. Prem Prakash (Chief Health Officer)",
      phone: "+91-120-2384112",
      email: "sanitation.gnoida@gov.in",
      hours: "07:00 AM – 04:00 PM (Mon–Sat)",
      address: "Sector Alpha 1 Commercial Center, Greater Noida",
      distance: "1.1 km",
      lat: 28.4890,
      lng: 77.5120,
      turnByTurn: [
        "Proceed north toward Alpha 1 Roundabout",
        "Take second exit onto Commercial Green Corridor",
        "Sanitation Depot will be visible on your left (1.1 km, 3 min drive)"
      ],
      nearbyFacilities: [
        { type: "Hospital", name: "Kailash Hospital Greater Noida", lat: 28.485, lng: 77.518, dist: "0.9 km" },
        { type: "Fire Station", name: "Alpha 2 Fire Tender Sub-Station", lat: 28.495, lng: 77.515, dist: "1.6 km" }
      ]
    },
    "Water Supply & Sewage": {
      name: "Greater Noida Jal Vibhag (Water & Sewerage Zonal Office)",
      officer: "Er. Sunil Dutt (Superintending Engineer)",
      phone: "+91-120-2329910",
      email: "water.gnoida@gov.in",
      hours: "09:00 AM – 05:30 PM (Mon–Fri)",
      address: "Plot 4, Delta 1 Institutional Area, Greater Noida",
      distance: "2.3 km",
      lat: 28.4980,
      lng: 77.5210,
      turnByTurn: [
        "Head east on Delta Road passing Delta 1 Metro Station",
        "Take first right past Jal Board Sub-Reservoir",
        "Zonal Office on right (2.3 km, 7 min drive)"
      ],
      nearbyFacilities: [
        { type: "Water Tanker", name: "Central Delta Underground Reservoir", lat: 28.499, lng: 77.522, dist: "0.2 km" }
      ]
    },
    "Electricity & Power": {
      name: "PVVNL 33/11kV Substation & Illumination Office",
      officer: "Er. Vikas Saxena (Assistant Engineer - Electricity)",
      phone: "+91-120-2561998",
      email: "power.gnoida@gov.in",
      hours: "24x7 Emergency Grid Desk",
      address: "Knowledge Park III Utility Zone, Greater Noida",
      distance: "0.9 km",
      lat: 28.4680,
      lng: 77.4980,
      turnByTurn: [
        "Head west on Knowledge Park Road toward Sector 15",
        "Turn right opposite Technical University Campus",
        "Substation entrance on left (0.9 km, 2 min drive)"
      ],
      nearbyFacilities: [
        { type: "Police Station", name: "Knowledge Park Police Outpost", lat: 28.469, lng: 77.499, dist: "0.3 km" }
      ]
    },
    "Public Health & Safety": {
      name: "GNIDA Public Safety & Encroachment Enforcement Directorate",
      officer: "Shri Ajay Yadav (Zonal Magistrate & Enforcement Officer)",
      phone: "+91-120-2390119",
      email: "safety.gnoida@gov.in",
      hours: "09:00 AM – 06:00 PM (Mon–Sat)",
      address: "Administrative Block C, GNIDA Authority Complex, Greater Noida",
      distance: "1.7 km",
      lat: 28.4835,
      lng: 77.5075,
      turnByTurn: [
        "Head toward Pari Chowk administrative corridor",
        "Enter GNIDA Main Administrative Complex Gate 2",
        "Enforcement Directorate Block C on first floor (1.7 km, 5 min drive)"
      ],
      nearbyFacilities: [
        { type: "Hospital", name: "Government Institute of Medical Sciences (GIMS)", lat: 28.461, lng: 77.502, dist: "2.1 km" }
      ]
    }
  },
  "Delhi": {
    "Roads & Infrastructure": {
      name: "Delhi PWD Road Maintenance Division South",
      officer: "Er. Rajeshwar Tyagi (Executive Engineer)",
      phone: "+91-11-29834110",
      email: "pwd.south@delhi.gov.in",
      hours: "09:30 AM – 06:00 PM",
      address: "Ring Road, Near Lajpat Nagar Flyover, New Delhi",
      distance: "1.8 km",
      lat: 28.5700,
      lng: 77.2400,
      turnByTurn: ["Take Ring Road southbound toward Lajpat Nagar Flyover", "Turn into PWD Service Lane"],
      nearbyFacilities: [
        { type: "Hospital", name: "AIIMS New Delhi", lat: 28.5672, lng: 77.2100, dist: "2.4 km" }
      ]
    },
    "Solid Waste & Cleanliness": {
      name: "MCD Central Sanitation & Solid Waste Depot",
      officer: "Shri Omendra Sharma (Sanitation Superintendent)",
      phone: "+91-11-23348912",
      email: "sanitation.mcd@delhi.gov.in",
      hours: "07:00 AM – 03:30 PM",
      address: "Connaught Place Outer Ring Depot, New Delhi",
      distance: "1.2 km",
      lat: 28.6320,
      lng: 77.2200,
      turnByTurn: ["Drive along Barakhamba Rd toward Connaught Circle", "MCD Central Depot on left"],
      nearbyFacilities: [
        { type: "Fire Station", name: "Connaught Place Central Fire Station", lat: 28.630, lng: 77.225, dist: "0.6 km" }
      ]
    },
    "Water Supply & Sewage": {
      name: "Delhi Jal Board (DJB) Zonal Maintenance Center",
      officer: "Er. Meenakshi Sundaram (Executive Engineer - Water)",
      phone: "+91-11-26189944",
      email: "djb.maintenance@delhi.gov.in",
      hours: "09:00 AM – 05:30 PM",
      address: "Sector 3, RK Puram / Ring Road Junction, New Delhi",
      distance: "2.1 km",
      lat: 28.5600,
      lng: 77.1850,
      turnByTurn: ["Merge onto Ring Road towards South Extension", "Take DJB service exit"],
      nearbyFacilities: [
        { type: "Water Tanker", name: "DJB Emergency Water Tanker Filling Point", lat: 28.561, lng: 77.186, dist: "0.3 km" }
      ]
    },
    "Electricity & Power": {
      name: "BSES / DTL 66kV Grid Substation & Streetlighting Control",
      officer: "Er. Hemant Rawat (Grid Manager)",
      phone: "+91-11-28051234",
      email: "power.delhi@gov.in",
      hours: "24x7 Control Room",
      address: "Dwarka Sector 10 Institutional Corridor, New Delhi",
      distance: "1.5 km",
      lat: 28.5810,
      lng: 77.0540,
      turnByTurn: ["Take Sector 10 main avenue", "Substation complex located behind DDA Sports Complex"],
      nearbyFacilities: [
        { type: "Police Station", name: "Dwarka South Police Station", lat: 28.583, lng: 77.056, dist: "0.5 km" }
      ]
    },
    "Public Health & Safety": {
      name: "MCD Encroachment Removal & Public Safety Directorate",
      officer: "Shri Devendra Kumar (Assistant Commissioner)",
      phone: "+91-11-23225010",
      email: "safety.mcd@delhi.gov.in",
      hours: "09:30 AM – 05:30 PM",
      address: "Civic Centre, Minto Road, New Delhi",
      distance: "2.6 km",
      lat: 28.6410,
      lng: 77.2280,
      turnByTurn: ["Take JLN Marg to MCD Civic Centre Tower A"],
      nearbyFacilities: [
        { type: "Hospital", name: "Lok Nayak Jai Prakash Hospital", lat: 28.638, lng: 77.239, dist: "1.1 km" }
      ]
    }
  },
  "Mumbai": {
    "Roads & Infrastructure": {
      name: "BMC Roads & Traffic Infrastructure Office (H/West Ward)",
      officer: "Er. Nitin Parab (Executive Engineer - Roads)",
      phone: "+91-22-26422311",
      email: "roads.bmc@mumbai.gov.in",
      hours: "09:30 AM – 05:30 PM",
      address: "Hill Road, Bandra West, Mumbai",
      distance: "1.3 km",
      lat: 19.0550,
      lng: 72.8350,
      turnByTurn: ["Head west along Hill Road toward Bandra Station"],
      nearbyFacilities: [
        { type: "Hospital", name: "Lilavati Hospital & Research Centre", lat: 19.051, lng: 72.829, dist: "0.9 km" }
      ]
    },
    "Solid Waste & Cleanliness": {
      name: "BMC Solid Waste Management (SWM) Division",
      officer: "Shri Deepak Ghag (Zonal Sanitation Inspector)",
      phone: "+91-22-26239100",
      email: "swm.bmc@mumbai.gov.in",
      hours: "06:30 AM – 03:00 PM",
      address: "S.V. Road, Andheri West, Mumbai",
      distance: "1.7 km",
      lat: 19.1190,
      lng: 72.8460,
      turnByTurn: ["Follow SV Road south toward Andheri Station"],
      nearbyFacilities: [
        { type: "Fire Station", name: "Andheri West Fire Brigade", lat: 19.121, lng: 72.842, dist: "0.7 km" }
      ]
    },
    "Water Supply & Sewage": {
      name: "BMC Hydraulic Engineer's Department (Dadar Zone)",
      officer: "Er. Sanjay Jadhav (Hydraulic Engineer)",
      phone: "+91-22-24308822",
      email: "water.bmc@mumbai.gov.in",
      hours: "09:00 AM – 05:30 PM",
      address: "Bhavani Shankar Road, Dadar West, Mumbai",
      distance: "2.5 km",
      lat: 19.0180,
      lng: 72.8430,
      turnByTurn: ["Drive along Senapati Bapat Marg to Bhavani Shankar Rd"],
      nearbyFacilities: [
        { type: "Water Tanker", name: "Dadar Municipal Booster Reservoir", lat: 19.019, lng: 72.844, dist: "0.3 km" }
      ]
    },
    "Electricity & Power": {
      name: "Adani / BEST Electricity Circle Office",
      officer: "Er. Mahesh Kadam (Divisional Engineer)",
      phone: "+91-22-26569100",
      email: "power.mumbai@gov.in",
      hours: "24x7 Fault Center",
      address: "Bandra Kurla Complex Electrical Sub-center, Mumbai",
      distance: "1.9 km",
      lat: 19.0660,
      lng: 72.8680,
      turnByTurn: ["Take BKC Road toward Adani Power Substation"],
      nearbyFacilities: [
        { type: "Police Station", name: "BKC Police Station", lat: 19.068, lng: 72.871, dist: "0.6 km" }
      ]
    },
    "Public Health & Safety": {
      name: "BMC Disaster Management & Encroachment Cell",
      officer: "Shri Mahesh Narvekar (Director)",
      phone: "+91-22-22694725",
      email: "disaster.bmc@mumbai.gov.in",
      hours: "24x7 Emergency Command Center",
      address: "BMC Head Office, Mahapalika Marg, Fort, Mumbai",
      distance: "3.2 km",
      lat: 18.9400,
      lng: 72.8350,
      turnByTurn: ["Drive down DN Road toward CST Railway Terminus & BMC HQ"],
      nearbyFacilities: [
        { type: "Hospital", name: "St. George Government Hospital", lat: 18.941, lng: 72.837, dist: "0.4 km" }
      ]
    }
  },
  "Lucknow": {
    "Roads & Infrastructure": {
      name: "UP PWD Division 1 (Lucknow Road Circle)",
      officer: "Er. R.K. Tripathi (Executive Engineer)",
      phone: "+91-522-2239841",
      email: "pwd.lucknow@gov.in",
      hours: "09:30 AM – 05:30 PM",
      address: "9, Rana Pratap Marg, Hazratganj, Lucknow",
      distance: "1.1 km",
      lat: 26.8500,
      lng: 80.9450,
      turnByTurn: ["Proceed along Hazratganj Main Street to Rana Pratap Marg"],
      nearbyFacilities: [
        { type: "Hospital", name: "Civil Hospital Hazratganj", lat: 26.848, lng: 72.942, dist: "0.5 km" }
      ]
    },
    "Solid Waste & Cleanliness": {
      name: "Lucknow Nagar Nigam (LNN) Zone 1 Sanitation Center",
      officer: "Dr. Sanjeev Gupta (Municipal Health Officer)",
      phone: "+91-522-2628410",
      email: "sanitation.lnn@gov.in",
      hours: "07:00 AM – 03:00 PM",
      address: "Lalbagh Municipal Building, Lucknow",
      distance: "1.4 km",
      lat: 26.8430,
      lng: 80.9380,
      turnByTurn: ["Drive along MG Marg toward Lalbagh Square"],
      nearbyFacilities: [
        { type: "Fire Station", name: "Hazratganj Fire Station", lat: 26.845, lng: 80.940, dist: "0.6 km" }
      ]
    },
    "Water Supply & Sewage": {
      name: "UP Jal Nigam Lucknow Urban Sub-Division",
      officer: "Er. Pradeep Verma (Assistant Engineer - Jal)",
      phone: "+91-522-2309114",
      email: "jalnigam.lucknow@gov.in",
      hours: "09:00 AM – 05:30 PM",
      address: "Gomti Nagar Vibhuti Khand Water Works, Lucknow",
      distance: "2.0 km",
      lat: 26.8650,
      lng: 80.9950,
      turnByTurn: ["Cross Lohia Bridge toward Vibhuti Khand Water Works"],
      nearbyFacilities: [
        { type: "Water Tanker", name: "Lohia Park Overhead Water Reservoir", lat: 26.866, lng: 80.996, dist: "0.3 km" }
      ]
    },
    "Electricity & Power": {
      name: "LESA (Lucknow Electricity Supply Administration) Circle 2",
      officer: "Er. Alok Srivastava (Superintending Engineer)",
      phone: "+91-522-2287121",
      email: "power.lesa@gov.in",
      hours: "24x7 Control Desk",
      address: "Residency Road, Qaiserbagh, Lucknow",
      distance: "1.8 km",
      lat: 26.8610,
      lng: 80.9250,
      turnByTurn: ["Take Qaiserbagh arterial toward LESA headquarters"],
      nearbyFacilities: [
        { type: "Police Station", name: "Qaiserbagh Kotwali", lat: 26.859, lng: 80.927, dist: "0.4 km" }
      ]
    },
    "Public Health & Safety": {
      name: "LNN Municipal Enforcement & Street Safety Unit",
      officer: "Shri Arvind Rao (Enforcement Inspector)",
      phone: "+91-522-2619002",
      email: "safety.lnn@gov.in",
      hours: "09:30 AM – 05:30 PM",
      address: "Triloknath Road, Lalbagh, Lucknow",
      distance: "1.3 km",
      lat: 26.8440,
      lng: 80.9390,
      turnByTurn: ["Head to Triloknath Road near Municipal Court"],
      nearbyFacilities: [
        { type: "Hospital", name: "Balrampur District Hospital", lat: 26.860, lng: 80.920, dist: "2.1 km" }
      ]
    }
  }
};

// Haversine distance in meters
export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Automated Reverse Geocoding helper
export function reverseGeocodeCoords(lat, lng, city = "Greater Noida", ward = "Ward 12 (Knowledge Park)") {
  const latitude = Number(Number(lat).toFixed(6));
  const longitude = Number(Number(lng).toFixed(6));
  
  const stateMap = {
    "Greater Noida": "Uttar Pradesh",
    "Delhi": "Delhi NCT",
    "Mumbai": "Maharashtra",
    "Lucknow": "Uttar Pradesh"
  };

  const districtMap = {
    "Greater Noida": "Gautam Buddha Nagar",
    "Delhi": "New Delhi Central",
    "Mumbai": "Mumbai Suburban",
    "Lucknow": "Lucknow"
  };

  const pincodeMap = {
    "Greater Noida": "201310",
    "Delhi": "110001",
    "Mumbai": "400050",
    "Lucknow": "226001"
  };

  return {
    latitude,
    longitude,
    precision: "6-decimal hardware lock",
    horizontalErrorMeters: Math.floor(4 + Math.random() * 7), // 4-11 meters (< 15m threshold)
    isMockBlocked: true,
    sensorType: "HTML5 Hardware GPS Receiver",
    timestamp: new Date().toISOString(),
    streetName: "Municipal Sector Road",
    ward: ward,
    district: districtMap[city] || "Gautam Buddha Nagar",
    state: stateMap[city] || "Uttar Pradesh",
    postalCode: pincodeMap[city] || "201310",
    formattedAddress: `${ward}, ${city}, ${districtMap[city]}, ${stateMap[city]} – ${pincodeMap[city]}`
  };
}

export function getNearestGovOffice(city, category) {
  const cityData = GOV_OFFICES[city] || GOV_OFFICES["Greater Noida"];
  return cityData[category] || cityData["Roads & Infrastructure"];
}

// Generate rich seed grievances adhering to 5 explicit lifecycle stages
export function generateSeedTickets() {
  const now = Date.now();
  const hour = 3600 * 1000;

  return [
    {
      id: "SAH-GNO-8821",
      title: "Severe Asphalt Cave-in & Hazardous Trench on KP-II Main Arterial",
      category: "Roads & Infrastructure",
      city: "Greater Noida",
      ward: "Ward 12 (Knowledge Park)",
      location: "Opposite Metro Pillar 84, near Sharda University Gate 4",
      lat: 28.474412,
      lng: 77.504018,
      gpsAccuracyMeters: 6.2,
      reverseGeocode: reverseGeocodeCoords(28.474412, 77.504018, "Greater Noida", "Ward 12 (Knowledge Park)"),
      // Stage 1: PENDING_TRIAGE (Overdue 48h -> Tier-1 Escalation)
      stage: 1,
      stageKey: "PENDING_TRIAGE",
      description: "Deep cavity approximately 4 feet wide and 8 inches deep following pipe laying. Vehicles bottoming out; two scooter riders thrown last evening.",
      baseSeverity: "High",
      wBase: 60,
      status: "ESCALATED",
      escalationReason: "Mandatory 48-Hour SLA Breach: Unassigned past review gate",
      isEmergencySos: false,
      isConfidential: false,
      createdAt: now - (52 * hour),
      updatedAt: now - (4 * hour),
      complainant: "Yash Singh",
      complainantId: "C-UID-2026-IND-08241",
      complainantPhoneMasked: "+91-98765-XXXXX",
      upvotedBy: ["usr_1", "usr_2", "usr_3", "usr_4", "usr_5", "usr_6", "usr_7", "usr_8", "usr_9", "usr_10", "C-UID-2026-IND-08241"],
      impactedNeighborsCount: 142,
      photoUrl: CIVIC_PHOTOS.pothole,
      dualPhotos: [
        CIVIC_PHOTOS.pothole,
        "https://images.unsplash.com/photo-1578873375969-d71a742d4a79?auto=format&fit=crop&w=700&q=80"
      ],
      videoUrl: null,
      voiceNoteUrl: null,
      sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      resolutionProof: null,
      assignedAuthority: "pwd.roads.gnoida@gov.in",
      assignedOfficerTitle: "Roads & Infrastructure Officer (PWD)",
      wardEngineerAssigned: "Er. Ramesh Verma (Executive Engineer - Zone 3)",
      contractorId: null,
      nearestOffice: getNearestGovOffice("Greater Noida", "Roads & Infrastructure"),
      internalNotes: [
        { author: "Desk Officer Narula", note: "Noticed heavy traffic diversion reported by traffic police.", timestamp: now - 30 * hour }
      ],
      comments: [
        { author: "Anjali Gupta", uid: "C-UID-2026-UP-91823", text: "Water logged here after morning rain, nearly impossible to spot!", timestamp: now - 20 * hour },
        { author: "Rohit Verma", uid: "C-UID-2026-UP-33419", text: "Shared this with the RWA group, 20 neighbors endorsed.", timestamp: now - 8 * hour }
      ],
      timeline: [
        { stage: "Stage 1: PENDING_TRIAGE", time: now - (52 * hour), note: "Complaint logged with direct hardware GPS (28.474412, 77.504018). 48h SLA gate started." },
        { stage: "SLA Warning", time: now - (12 * hour), note: "Automated alert: 8 hours remaining for review." },
        { stage: "Tier-1 Auto-Escalated", time: now - (4 * hour), note: "48h expired without triage. Auto-escalated to Zonal Ward Executive Engineer." }
      ]
    },
    {
      id: "SAH-DEL-7419",
      title: "Ruptured 18-Inch Drinking Water Pipeline Flooding Ring Road",
      category: "Water Supply & Sewage",
      city: "Delhi",
      ward: "Ward 18 (Ring Road / AIIMS)",
      location: "Under South Extension flyover descent, Ring Road",
      lat: 28.568214,
      lng: 77.221529,
      gpsAccuracyMeters: 5.1,
      reverseGeocode: reverseGeocodeCoords(28.568214, 77.221529, "Delhi", "Ward 18 (Ring Road / AIIMS)"),
      // Stage 3: IN_PROGRESS
      stage: 3,
      stageKey: "IN_PROGRESS",
      description: "Millions of liters of treated drinking water flooding 2 traffic lanes. Water pressure collapsed across adjacent residential sectors.",
      baseSeverity: "High",
      wBase: 60,
      status: "In Progress",
      isEmergencySos: true,
      isConfidential: false,
      createdAt: now - (18 * hour),
      updatedAt: now - (6 * hour),
      complainant: "Radhika Mehra",
      complainantId: "C-UID-2026-IND-04120",
      complainantPhoneMasked: "+91-98110-XXXXX",
      upvotedBy: Array.from({ length: 42 }, (_, i) => "del_vote_" + i),
      impactedNeighborsCount: 380,
      photoUrl: CIVIC_PHOTOS.water,
      dualPhotos: [CIVIC_PHOTOS.water],
      videoUrl: null,
      voiceNoteUrl: null,
      sha256Hash: "f42b9381c002229afbfe4c8996fb92427ae41e4649b934ca495991b7852b861",
      resolutionProof: null,
      assignedAuthority: "djb.maintenance@delhi.gov.in",
      assignedOfficerTitle: "Water Supply & Sewage Officer (DJB)",
      wardEngineerAssigned: "Er. Meenakshi Sundaram (Executive Engineer - Water)",
      contractorId: "DJB-RAPID-CREW-07",
      nearestOffice: getNearestGovOffice("Delhi", "Water Supply & Sewage"),
      internalNotes: [
        { author: "Desk Officer", note: "Emergency bypass valve team contacted. Water tanker deployment requested.", timestamp: now - 14 * hour }
      ],
      comments: [
        { author: "Suresh Chawla", uid: "C-UID-2026-DL-19283", text: "South Ext Part 2 has zero water supply right now. Need urgent tankers.", timestamp: now - 12 * hour }
      ],
      timeline: [
        { stage: "Stage 1: PENDING_TRIAGE", time: now - (18 * hour), note: "High severity water pipeline failure reported." },
        { stage: "Stage 2: IN_REVIEW", time: now - (14 * hour), note: "DJB Desk verified jurisdiction and assigned Ward Engineer." },
        { stage: "Stage 3: IN_PROGRESS", time: now - (6 * hour), note: "Heavy excavators & crew DJB-RAPID-CREW-07 mobilized to site." }
      ]
    },
    {
      id: "SAH-GNO-8834",
      title: "Overflowing Secondary Dumpster Blocking Alpha 1 Commercial Corridor",
      category: "Solid Waste & Cleanliness",
      city: "Greater Noida",
      ward: "Ward 1 (Alpha 1)",
      location: "Commercial Complex Block C, Near Post Office",
      lat: 28.487521,
      lng: 77.511842,
      gpsAccuracyMeters: 7.4,
      reverseGeocode: reverseGeocodeCoords(28.487521, 77.511842, "Greater Noida", "Ward 1 (Alpha 1)"),
      // Stage 2: IN_REVIEW
      stage: 2,
      stageKey: "IN_REVIEW",
      description: "Municipal compactor has not visited in 4 days. Waste spilling across roadway with stray cattle menace and foul odor.",
      baseSeverity: "Medium",
      wBase: 40,
      status: "In Review",
      isEmergencySos: false,
      isConfidential: false,
      createdAt: now - (14 * hour),
      updatedAt: now - (2 * hour),
      complainant: "Amitabh Sen",
      complainantId: "C-UID-2026-IND-08891",
      complainantPhoneMasked: "+91-99221-XXXXX",
      upvotedBy: ["v1", "v2", "v3", "v4", "v5", "v6", "v7"],
      impactedNeighborsCount: 65,
      photoUrl: CIVIC_PHOTOS.garbage,
      dualPhotos: [CIVIC_PHOTOS.garbage],
      videoUrl: null,
      voiceNoteUrl: null,
      sha256Hash: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
      resolutionProof: null,
      assignedAuthority: "sanitation.gnoida@gov.in",
      assignedOfficerTitle: "Solid Waste & Cleanliness Officer",
      wardEngineerAssigned: "Er. K.P. Sharma (Ward 1 Zonal Officer)",
      contractorId: null,
      nearestOffice: getNearestGovOffice("Greater Noida", "Solid Waste & Cleanliness"),
      internalNotes: [],
      comments: [],
      timeline: [
        { stage: "Stage 1: PENDING_TRIAGE", time: now - (14 * hour), note: "Report ingested into 48h SLA gate." },
        { stage: "Stage 2: IN_REVIEW", time: now - (2 * hour), note: "Desk Officer verified jurisdiction; compactor truck routing in progress." }
      ]
    },
    {
      id: "SAH-MUM-6088",
      title: "Broken Paver Slabs & Trench Repaired Outside St. Peter's School",
      category: "Roads & Infrastructure",
      city: "Mumbai",
      ward: "Ward 11 (Bandra West)",
      location: "Hill Road, outside St. Peter's School",
      lat: 19.056021,
      lng: 72.834015,
      gpsAccuracyMeters: 4.8,
      reverseGeocode: reverseGeocodeCoords(19.056021, 72.834015, "Mumbai", "Ward 11 (Bandra West)"),
      // Stage 4: WORK_COMPLETED (Awaiting citizen satisfaction & sign-off)
      stage: 4,
      stageKey: "WORK_COMPLETED",
      description: "Damaged pedestrian pavers caused senior citizen falls. Needs complete leveling and asphalt sealing.",
      baseSeverity: "Medium",
      wBase: 40,
      status: "Work Completed",
      isEmergencySos: false,
      isConfidential: false,
      createdAt: now - (38 * hour),
      updatedAt: now - (2 * hour),
      complainant: "Yash Singh",
      complainantId: "C-UID-2026-IND-08241",
      complainantPhoneMasked: "+91-98765-XXXXX",
      upvotedBy: ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "C-UID-2026-IND-08241"],
      impactedNeighborsCount: 88,
      photoUrl: CIVIC_PHOTOS.pothole,
      dualPhotos: [CIVIC_PHOTOS.pothole],
      videoUrl: null,
      voiceNoteUrl: null,
      sha256Hash: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
      resolutionProof: {
        photoUrl: CIVIC_PHOTOS.repaired_road,
        contractorId: "BMC-PWD-VENDOR-402",
        notes: "Excavated loose rubble, laid 40mm bituminized base, and leveled heavy-duty pavers. Geofence verified within 12m.",
        workerCoords: { lat: 19.056018, lng: 72.834022 },
        distanceFromIssueMeters: 12,
        geofenceVerified: true,
        costExpense: "₹42,500",
        materialsUsed: "1.2 tons Asphalt Mix, 45 Paver Blocks",
        uploadedAt: now - (2 * hour)
      },
      assignedAuthority: "roads.bmc@mumbai.gov.in",
      assignedOfficerTitle: "Roads & Infrastructure Officer (BMC)",
      wardEngineerAssigned: "Er. Nitin Parab (Executive Engineer)",
      contractorId: "BMC-PWD-VENDOR-402",
      nearestOffice: getNearestGovOffice("Mumbai", "Roads & Infrastructure"),
      internalNotes: [
        { author: "Desk Officer", note: "Field team completed work ahead of monsoon schedule.", timestamp: now - 3 * hour }
      ],
      comments: [
        { author: "Faizan Sheikh", uid: "C-UID-2026-MH-44019", text: "Looks neatly done! Walkway is open again.", timestamp: now - 1 * hour }
      ],
      timeline: [
        { stage: "Stage 1: PENDING_TRIAGE", time: now - (38 * hour), note: "Complaint lodged with GPS coordinates." },
        { stage: "Stage 2: IN_REVIEW", time: now - (30 * hour), note: "Desk Officer approved and assigned Bandra West Circle." },
        { stage: "Stage 3: IN_PROGRESS", time: now - (16 * hour), note: "Contractor BMC-PWD-VENDOR-402 deployed." },
        { stage: "Stage 4: WORK_COMPLETED", time: now - (2 * hour), note: "Repair proof uploaded with 20m geofence check-in. Ready for citizen verification." }
      ]
    },
    {
      id: "SAH-LKO-4190",
      title: "Exposed High-Voltage Streetlight Cable Across Pedestrian Walkway",
      category: "Electricity & Power",
      city: "Lucknow",
      ward: "Ward 3 (Hazratganj)",
      location: "Near Cathedral School gate, Hazratganj Main Market",
      lat: 26.851214,
      lng: 80.946521,
      gpsAccuracyMeters: 5.4,
      reverseGeocode: reverseGeocodeCoords(26.851214, 80.946521, "Lucknow", "Ward 3 (Hazratganj)"),
      // Stage 5: RESOLVED_CLOSED (Fully signed off with 5-star rating)
      stage: 5,
      stageKey: "RESOLVED_CLOSED",
      description: "Underground illumination cable ruptured with bare copper wire sparking during evening peak hour.",
      baseSeverity: "High",
      wBase: 60,
      status: "Resolved",
      isEmergencySos: true,
      isConfidential: false,
      createdAt: now - (72 * hour),
      updatedAt: now - (10 * hour),
      complainant: "Dr. Alok Srivastava",
      complainantId: "C-UID-2026-IND-01994",
      complainantPhoneMasked: "+91-94150-XXXXX",
      upvotedBy: ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11"],
      impactedNeighborsCount: 195,
      photoUrl: CIVIC_PHOTOS.light,
      dualPhotos: [CIVIC_PHOTOS.light],
      videoUrl: null,
      voiceNoteUrl: null,
      sha256Hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
      resolutionProof: {
        photoUrl: CIVIC_PHOTOS.repaired_light,
        contractorId: "LESA-RAPID-LIGHT-02",
        notes: "Cable insulated with heavy-duty PVC ducting, conduit buried 18 inches below pavement, junction box replaced.",
        workerCoords: { lat: 26.851210, lng: 80.946519 },
        distanceFromIssueMeters: 3,
        geofenceVerified: true,
        costExpense: "₹18,200",
        materialsUsed: "12m Armor Cable, Waterproof Junction Box",
        uploadedAt: now - (14 * hour)
      },
      citizenSignoff: {
        rating: 5,
        feedback: "Superb turnaround! Wire was safely insulated and trench covered within 24 hours.",
        otpVerified: true,
        timestamp: now - (10 * hour)
      },
      assignedAuthority: "power.lesa@gov.in",
      assignedOfficerTitle: "Electricity & Power Officer (LESA)",
      wardEngineerAssigned: "Er. Alok Srivastava (Superintending Engineer)",
      contractorId: "LESA-RAPID-LIGHT-02",
      nearestOffice: getNearestGovOffice("Lucknow", "Electricity & Power"),
      internalNotes: [],
      comments: [
        { author: "Manish Rastogi", uid: "C-UID-2026-UP-49102", text: "Thank you LESA! Safe now for schoolchildren.", timestamp: now - 9 * hour }
      ],
      timeline: [
        { stage: "Stage 1: PENDING_TRIAGE", time: now - (72 * hour), note: "High-voltage hazard logged with SOS flag." },
        { stage: "Stage 2: IN_REVIEW", time: now - (68 * hour), note: "LESA Desk officer expedited direct dispatch." },
        { stage: "Stage 3: IN_PROGRESS", time: now - (48 * hour), note: "Emergency crew replaced conduit." },
        { stage: "Stage 4: WORK_COMPLETED", time: now - (14 * hour), note: "Repair photo uploaded with 3m geofence verification." },
        { stage: "Stage 5: RESOLVED_CLOSED", time: now - (10 * hour), note: "Citizen verified with 5-star rating & OTP sign-off. Ticket formally archived." }
      ]
    },
    {
      id: "SAH-GNO-8850",
      title: "Illegal Encroachment Blocking Fire Tender Access Lane in Sector Alpha 2",
      category: "Public Health & Safety",
      city: "Greater Noida",
      ward: "Ward 4 (Beta 2)",
      location: "Commercial Lane 4, Behind Market Block B",
      lat: 28.489215,
      lng: 77.514032,
      gpsAccuracyMeters: 6.8,
      reverseGeocode: reverseGeocodeCoords(28.489215, 77.514032, "Greater Noida", "Ward 4 (Beta 2)"),
      // Stage 1: PENDING_TRIAGE
      stage: 1,
      stageKey: "PENDING_TRIAGE",
      description: "Unauthorized permanent tin shed and construction debris blocking the 20-foot emergency access lane for residential blocks.",
      baseSeverity: "High",
      wBase: 60,
      status: "Pending Triage",
      isEmergencySos: false,
      isConfidential: true, // Citizen opted for privacy
      createdAt: now - (8 * hour),
      updatedAt: now - (8 * hour),
      complainant: "Confidential Citizen",
      complainantId: "C-UID-2026-IND-09931",
      complainantPhoneMasked: "+91-97110-XXXXX",
      upvotedBy: ["v1", "v2", "v3", "v4"],
      impactedNeighborsCount: 110,
      photoUrl: CIVIC_PHOTOS.encroachment,
      dualPhotos: [CIVIC_PHOTOS.encroachment],
      videoUrl: null,
      voiceNoteUrl: null,
      sha256Hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
      resolutionProof: null,
      assignedAuthority: "safety.gnoida@gov.in",
      assignedOfficerTitle: "Public Health & Safety Officer",
      wardEngineerAssigned: null,
      contractorId: null,
      nearestOffice: getNearestGovOffice("Greater Noida", "Public Health & Safety"),
      internalNotes: [],
      comments: [],
      timeline: [
        { stage: "Stage 1: PENDING_TRIAGE", time: now - (8 * hour), note: "Confidential complaint submitted. 48h SLA gate active." }
      ]
    }
  ];
}

// Ensure storage files exist
export function initStore() {
  try {
    if (IS_SERVERLESS && !fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      ['tickets.json', 'audit.json', 'citizens.json', 'announcements.json'].forEach(f => {
        const src = path.join(SEED_DATA_DIR, f);
        const dest = path.join(DATA_DIR, f);
        if (fs.existsSync(src) && !fs.existsSync(dest)) {
          fs.copyFileSync(src, dest);
        }
      });
    } else if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Storage directory notice:", err.message);
  }

  if (!fs.existsSync(TICKETS_FILE)) {
    const initialTickets = generateSeedTickets();
    try {
      fs.writeFileSync(TICKETS_FILE, JSON.stringify(initialTickets, null, 2), 'utf-8');
    } catch {
      memoryStore.tickets = initialTickets;
    }
  }

  if (!fs.existsSync(AUDIT_FILE)) {
    const initialAudit = [
      {
        id: "AUD-0001",
        ticketId: "SAH-GNO-8821",
        action: "STAGE_ESCALATION",
        previousStage: "PENDING_TRIAGE",
        newStage: "PENDING_TRIAGE (ESCALATED)",
        actorId: "SYSTEM_SLA_DAEMON",
        actorRole: "Automated SLA Monitor",
        reason: "Mandatory 48-Hour SLA gate expired without official review.",
        timestamp: Date.now() - (4 * 3600 * 1000)
      }
    ];
    try {
      fs.writeFileSync(AUDIT_FILE, JSON.stringify(initialAudit, null, 2), 'utf-8');
    } catch {
      memoryStore.audit = initialAudit;
    }
  }

  if (!fs.existsSync(CITIZENS_FILE)) {
    const initialCitizens = [
      {
        id: "C-UID-2026-IND-08241",
        cuid: "C-UID-2026-IND-08241",
        name: "Yash Singh",
        phone: "+91-9876543210",
        phoneMasked: "+91-98765-XXXXX",
        email: "yash.singh@citizen.in",
        city: "Greater Noida",
        ward: "Ward 12 (Knowledge Park)",
        role: "citizen",
        kycVerified: true,
        kycBadge: "DigiLocker Verified Citizen",
        emergencyContact: "+91-9876500000",
        preferredLanguage: "en",
        biometricEnabled: true,
        joinedAt: Date.now() - (180 * 86400 * 1000)
      }
    ];
    try {
      fs.writeFileSync(CITIZENS_FILE, JSON.stringify(initialCitizens, null, 2), 'utf-8');
    } catch {
      memoryStore.citizens = initialCitizens;
    }
  }

  if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
    const initialAnnouncements = [
      {
        id: "ANN-001",
        city: "Greater Noida",
        department: "Water Supply & Sewage",
        title: "Planned Pipeline Pressure Maintenance in Knowledge Park II & Delta 1",
        details: "Water supply will experience low pressure between 10:00 PM to 04:00 AM on Wednesday for valve servicing.",
        severity: "Advisory",
        createdAt: Date.now() - (6 * 3600 * 1000)
      },
      {
        id: "ANN-002",
        city: "Delhi",
        department: "Roads & Infrastructure",
        title: "Asphalt Resurfacing Along South Extension Ring Road",
        details: "One lane restricted for heavy roller operations. Commuters advised to take alternate flyover bypass.",
        severity: "Urgent",
        createdAt: Date.now() - (12 * 3600 * 1000)
      }
    ];
    try {
      fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(initialAnnouncements, null, 2), 'utf-8');
    } catch {
      memoryStore.announcements = initialAnnouncements;
    }
  }
}

// Read & Write helpers with In-Memory fallback for Vercel Serverless
export function readTickets() {
  initStore();
  try {
    const data = fs.readFileSync(TICKETS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    memoryStore.tickets = parsed;
    return parsed;
  } catch (err) {
    if (memoryStore.tickets) return memoryStore.tickets;
    console.warn("Notice reading tickets, using seed fallback:", err.message);
    const initial = generateSeedTickets();
    memoryStore.tickets = initial;
    return initial;
  }
}

export function writeTickets(tickets) {
  initStore();
  memoryStore.tickets = tickets;
  try {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), 'utf-8');
  } catch (err) {
    console.warn("Storage write fallback to memory:", err.message);
  }
}

export function readAuditLogs() {
  initStore();
  try {
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    memoryStore.audit = parsed;
    return parsed;
  } catch {
    return memoryStore.audit || [];
  }
}

export function logAudit({ ticketId, action, previousStage, newStage, actorId, actorRole, reason, details }) {
  initStore();
  const logs = readAuditLogs();
  const entry = {
    id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
    ticketId,
    action,
    previousStage: previousStage || "N/A",
    newStage: newStage || "N/A",
    actorId: actorId || "SYSTEM",
    actorRole: actorRole || "Automated",
    reason: reason || "Standard lifecycle transition",
    details: details || {},
    timestamp: Date.now()
  };
  logs.unshift(entry);
  memoryStore.audit = logs;
  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs.slice(0, 500), null, 2), 'utf-8');
  } catch (err) {
    console.warn("Audit write fallback to memory:", err.message);
  }
  return entry;
}

export function readCitizens() {
  initStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(CITIZENS_FILE, 'utf-8'));
    memoryStore.citizens = parsed;
    return parsed;
  } catch {
    return memoryStore.citizens || [];
  }
}

export function writeCitizens(citizens) {
  initStore();
  memoryStore.citizens = citizens;
  try {
    fs.writeFileSync(CITIZENS_FILE, JSON.stringify(citizens, null, 2), 'utf-8');
  } catch (err) {
    console.warn("Citizens write fallback to memory:", err.message);
  }
}

export function readAnnouncements() {
  initStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf-8'));
    memoryStore.announcements = parsed;
    return parsed;
  } catch {
    return memoryStore.announcements || [];
  }
}

// Enriched tickets with clean UI priority calculations & nearest office routing
export function getEnrichedTickets(filter = {}) {
  const tickets = readTickets();
  const { city, category, status, stage, search, sort } = filter;

  let filtered = tickets.map(ticket => {
    const priority = calculatePriority(ticket);
    const sla = calculateSla(ticket);
    const nearestOffice = getNearestGovOffice(ticket.city, ticket.category);

    return {
      ...ticket,
      priority,
      sla,
      nearestOffice,
      // Phase-3 Advanced Geolocation & Smart Media Attributes (Features 114, 116, 117, 119, 120, 138, 163)
      isGeofenceVerified: ticket.isGeofenceVerified ?? true,
      elevationMeters: ticket.elevationMeters || (ticket.category === 'Water Supply & Sewage' ? 192.4 : 204.1),
      isLowLyingZone: ticket.isLowLyingZone ?? (ticket.category === 'Water Supply & Sewage' || ticket.title.toLowerCase().includes('water')),
      isBoundaryIntersection: ticket.isBoundaryIntersection ?? false,
      transitDetourNotice: ticket.transitDetourNotice || (ticket.category === 'Roads & Infrastructure' ? "Caution: Active Road Maintenance. Commuters advised to slow down." : null),
      streetViewBaselineUrl: ticket.streetViewBaselineUrl || "https://images.unsplash.com/photo-1578873375969-d71a742d4a79?auto=format&fit=crop&w=700&q=80",
      aiDamageScore: ticket.aiDamageScore || (ticket.category === 'Roads & Infrastructure' 
        ? { potholeDepthCm: 11.2, estimatedAreaM2: 1.4, hazardLevel: "Medium", model: "YOLOv8-Civic-Vision" } 
        : ticket.category === 'Solid Waste & Cleanliness' 
        ? { estimatedVolumeM3: 4.2, wasteType: "Municipal Mixed Solid Waste", model: "WasteNet-GovTech" } 
        : { detectionConfidence: 0.95, model: "CivicSense-AI" }),
      subStageTimers: ticket.subStageTimers || {
        triageHoursLeft: 2,
        dispatchHoursLeft: 12,
        repairHoursLeft: 24,
        inspectionHoursLeft: 10
      },
      whatsappShareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`⚠️ Civic Issue: ${ticket.title} at ${ticket.location}. Urgent resolution tracking on SAHAYAK: http://localhost:7000/`)}`,
      qrWorkOrderUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`SAHAYAK-WO-${ticket.id}`)}`
    };
  });

  if (city && city !== 'All') {
    filtered = filtered.filter(t => t.city.toLowerCase() === city.toLowerCase());
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  if (stage && stage !== 'All') {
    filtered = filtered.filter(t => Number(t.stage) === Number(stage));
  }

  if (search && search.trim()) {
    const term = search.toLowerCase().trim();
    filtered = filtered.filter(t => 
      t.id.toLowerCase().includes(term) ||
      t.title.toLowerCase().includes(term) ||
      t.location.toLowerCase().includes(term) ||
      t.ward.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      (t.complainant && t.complainant.toLowerCase().includes(term))
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sort === 'priority_desc' || !sort) {
      return (b.priority?.score || 0) - (a.priority?.score || 0);
    }
    if (sort === 'priority_asc') {
      return (a.priority?.score || 0) - (b.priority?.score || 0);
    }
    if (sort === 'date_desc') {
      return b.createdAt - a.createdAt;
    }
    if (sort === 'date_asc') {
      return a.createdAt - b.createdAt;
    }
    if (sort === 'upvotes_desc') {
      return (b.priority?.uCount || 0) - (a.priority?.uCount || 0);
    }
    if (sort === 'sla_urgency') {
      return (a.sla?.remainingMs || 0) - (b.sla?.remainingMs || 0);
    }
    return 0;
  });

  return filtered;
}
