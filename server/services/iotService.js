/**
 * SAHAYAK Smart City IoT & Utility Sensor Integration Service
 * Features 181–190
 */

// In-memory telemetry cache for real-time sensor streams
export const IOT_SENSORS = [
  {
    id: "IOT-WATER-091",
    name: "Main Water Feed Line A2 — Pari Chowk Sector Gamma",
    type: "WATER_PRESSURE",
    unit: "PSI",
    normalRange: "45–60 PSI",
    currentValue: 18.2,
    threshold: 25.0,
    status: "CRITICAL_DROP",
    location: "Pari Chowk Junction, Greater Noida",
    lat: 28.4820,
    lng: 77.5090,
    ward: "Ward 15 (Pari Chowk)",
    city: "Greater Noida",
    lastPing: Date.now() - 4000,
    alertTitle: "Sudden Pressure Loss: Underground 350mm Water Main Burst Detected",
    department: "Water Supply & Sewage"
  },
  {
    id: "IOT-WASTE-404",
    name: "Smart Dumpster Ultrasonic Level Radar #14",
    type: "DUMPSTER_FILL",
    unit: "% Fill Level",
    normalRange: "0–75%",
    currentValue: 94.2,
    threshold: 90.0,
    status: "OVERFLOW_TRIGGER",
    location: "Sector Alpha 1 Commercial Complex",
    lat: 28.4890,
    lng: 77.5120,
    ward: "Ward 1 (Alpha 1)",
    city: "Greater Noida",
    lastPing: Date.now() - 8000,
    alertTitle: "Dumpster 94% Capacity Exceeded: Auto-Dispatched Compactor Truck GN-03",
    department: "Solid Waste & Cleanliness"
  },
  {
    id: "IOT-LIGHT-112",
    name: "Knowledge Park III Smart Grid Feeder Pillar #6",
    type: "STREETLIGHT_GRID",
    unit: "Active Poles",
    normalRange: "24/24 Online",
    currentValue: "18 Tripped (6 Online)",
    threshold: 20,
    status: "BREAKER_TRIP",
    location: "Knowledge Park III Institutional Belt",
    lat: 28.4680,
    lng: 77.4980,
    ward: "Ward 12 (Knowledge Park)",
    city: "Greater Noida",
    lastPing: Date.now() - 15000,
    alertTitle: "Feeder 33kV Phase Loss: 18 Consecutive Streetlights Dark",
    department: "Electricity & Power"
  },
  {
    id: "IOT-AQI-880",
    name: "Continuous Ambient Air Quality Monitoring Station (CAAQMS)",
    type: "AQI_POLLUTION",
    unit: "AQI (PM2.5)",
    normalRange: "0–150 AQI",
    currentValue: 428,
    threshold: 400,
    status: "SEVERE_SMOG",
    location: "Connaught Place Outer Circle, Delhi",
    lat: 28.6328,
    lng: 77.2197,
    ward: "Ward 2 (Connaught Place)",
    city: "Delhi",
    lastPing: Date.now() - 2000,
    alertTitle: "AQI 428 Severe Category: Automated Water Mist Cannon Spraying Dispatched",
    department: "Public Health & Safety"
  },
  {
    id: "IOT-DRAIN-301",
    name: "Central Stormwater Nullah Level Radar",
    type: "DRAIN_FLOOD",
    unit: "% Inundation",
    normalRange: "10–50%",
    currentValue: 88.5,
    threshold: 80.0,
    status: "FLOOD_RISK",
    location: "Ring Road Lajpat Nagar Underpass",
    lat: 28.5700,
    lng: 77.2400,
    ward: "Ward 25 (Lajpat Nagar)",
    city: "Delhi",
    lastPing: Date.now() - 5000,
    alertTitle: "Stormwater Nullah Inundation at 88%: Sump Pumps Switched to Emergency Max",
    department: "Water Supply & Sewage"
  },
  {
    id: "IOT-BUS-042",
    name: "Transit Fleet Bus #DL-1P-9082 IMU Accelerometer",
    type: "ROAD_VIBRATION",
    unit: "m/s² G-Spike",
    normalRange: "<1.2 m/s²",
    currentValue: 4.8,
    threshold: 3.0,
    status: "POTHOLE_DETECTED",
    location: "Beta 2 Inner Radial Arterial",
    lat: 28.4715,
    lng: 77.5020,
    ward: "Ward 4 (Beta 2)",
    city: "Greater Noida",
    lastPing: Date.now() - 10000,
    alertTitle: "Bus Suspension 4.8G Impact: Deep Pothole Auto-Logged at Coordinates",
    department: "Roads & Infrastructure"
  },
  {
    id: "IOT-PUMP-019",
    name: "Zonal Sewage Lift Pumping Station Pump #3",
    type: "SEWAGE_PUMP",
    unit: "Motor Temp °C",
    normalRange: "40–70 °C",
    currentValue: 92.4,
    threshold: 85.0,
    status: "THERMAL_OVERLOAD",
    location: "Bandra Reclamation Sewerage Outfall",
    lat: 28.4980,
    lng: 77.5210,
    ward: "Ward 8 (Delta 1)",
    city: "Greater Noida",
    lastPing: Date.now() - 12000,
    alertTitle: "Sewage Pump 3 Thermal Overheat (92°C): Auto-Shifted to Standby Pump 4",
    department: "Water Supply & Sewage"
  },
  {
    id: "IOT-TRAFFIC-102",
    name: "Hazratganj Multi-Way Traffic Signal Controller",
    type: "TRAFFIC_LIGHT",
    unit: "Status",
    normalRange: "Synchronized",
    currentValue: "Flashing Amber Warning Mode",
    threshold: "FAIL",
    status: "SIGNAL_FAILURE",
    location: "Hazratganj Main Intersection, Lucknow",
    lat: 26.8500,
    lng: 80.9500,
    ward: "Ward 3 (Hazratganj)",
    city: "Lucknow",
    lastPing: Date.now() - 3000,
    alertTitle: "PLC Traffic Signal Outage: Traffic Police HQ & Electrical Squad Dual-Alerted",
    department: "Electricity & Power"
  },
  {
    id: "IOT-TRANS-774",
    name: "11kV Distribution Transformer #44",
    type: "TRANSFORMER_TEMP",
    unit: "Oil Temp °C",
    normalRange: "55–75 °C",
    currentValue: 98.6,
    threshold: 90.0,
    status: "CRITICAL_OVERHEAT",
    location: "Alpha 2 Sub-station Sector Yard",
    lat: 28.4840,
    lng: 77.5140,
    ward: "Ward 1 (Alpha 1)",
    city: "Greater Noida",
    lastPing: Date.now() - 7000,
    alertTitle: "Transformer Oil Temp 98.6°C: Emergency Load Shedding & Cooling Sprinklers Engaged",
    department: "Electricity & Power"
  },
  {
    id: "IOT-WATER-QUAL-005",
    name: "Municipal Potable Water Line Spectrometer",
    type: "WATER_QUALITY",
    unit: "TDS / Turbidity NTU",
    normalRange: "TDS < 300, NTU < 5",
    currentValue: "TDS: 512, NTU: 14.8",
    threshold: "NTU > 10",
    status: "TURBIDITY_SPIKE",
    location: "Delta 1 Pumping Booster Station",
    lat: 28.4985,
    lng: 77.5215,
    ward: "Ward 8 (Delta 1)",
    city: "Greater Noida",
    lastPing: Date.now() - 6000,
    alertTitle: "Turbidity 14.8 NTU Exceeds BIS 10500: Chlorination Unit Boosted",
    department: "Water Supply & Sewage"
  }
];

export function getIotSensors(city = null) {
  if (city && city !== 'All') {
    return IOT_SENSORS.filter(s => s.city.toLowerCase() === city.toLowerCase());
  }
  return IOT_SENSORS;
}

export function simulateSensorAnomaly(sensorId) {
  const sensor = IOT_SENSORS.find(s => s.id === sensorId);
  if (!sensor) return null;

  sensor.lastPing = Date.now();
  return {
    success: true,
    sensor,
    ticketSuggested: {
      title: `[IoT Auto-Alarm] ${sensor.alertTitle}`,
      category: sensor.department,
      city: sensor.city,
      ward: sensor.ward,
      location: sensor.location,
      lat: sensor.lat,
      lng: sensor.lng,
      baseSeverity: "High",
      description: `Automated IoT Telemetry Alert generated by hardware device ${sensor.id} (${sensor.name}). Measured reading: ${sensor.currentValue} ${sensor.unit} (Permissible threshold: ${sensor.threshold}). Real-time municipal auto-dispatch triggered.`,
      isEmergencySos: sensor.status.includes('CRITICAL') || sensor.status.includes('OVERHEAT')
    }
  };
}

