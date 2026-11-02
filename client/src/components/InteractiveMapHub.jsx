import React, { useEffect, useRef, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Navigation, 
  Layers, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  Eye, 
  Crosshair,
  Flame,
  Hospital,
  Droplets,
  Truck,
  Compass,
  AlertTriangle,
  SplitSquareVertical
} from 'lucide-react';

// City center defaults
const CITY_CENTERS = {
  "Greater Noida": { lat: 28.4744, lng: 77.5040, zoom: 13 },
  "Delhi": { lat: 28.5800, lng: 77.2000, zoom: 12 },
  "Mumbai": { lat: 19.0600, lng: 72.8400, zoom: 12 },
  "Lucknow": { lat: 26.8500, lng: 80.9400, zoom: 13 }
};

// Department marker colors
const DEPT_COLORS = {
  "Roads & Infrastructure": "#d97706",    // amber-600
  "Water Supply & Sewage": "#2563eb",     // blue-600
  "Solid Waste & Cleanliness": "#059669", // emerald-600
  "Electricity & Power": "#9333ea",       // purple-600
  "Public Health & Safety": "#e11d48"     // rose-600
};

export default function InteractiveMapHub({ 
  tickets, 
  activeCity, 
  onSelectTicket 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routesLayerRef = useRef(null);
  const boundariesLayerRef = useRef(null);
  const vanMarkerRef = useRef(null);

  const [selectedTicket, setSelectedTicket] = useState(tickets[0] || null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showUtilitiesGrid, setShowUtilitiesGrid] = useState(false); // Feature 118
  const [activeFilterDept, setActiveFilterDept] = useState('All');
  const [vanEtaMins, setVanEtaMins] = useState(7); // Feature 112
  const [streetViewModalOpen, setStreetViewModalOpen] = useState(false); // Feature 120

  const city = activeCity === 'All' ? 'Greater Noida' : activeCity;
  const center = CITY_CENTERS[city] || CITY_CENTERS["Greater Noida"];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = window.L;

    if (!L) {
      console.warn("Leaflet library not yet loaded on window.");
      return;
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: center.zoom,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routesLayerRef.current = L.layerGroup().addTo(map);
    boundariesLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [city]);

  // Update Markers, Boundaries, Routes and Facilities
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (!map || !L) return;

    markersLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();
    boundariesLayerRef.current.clearLayers();

    // 1. Draw Simulated Ward Boundaries (GeoJSON Polygons)
    if (showBoundaries) {
      const polygonCoords = [
        [center.lat + 0.02, center.lng - 0.02],
        [center.lat + 0.02, center.lng + 0.02],
        [center.lat - 0.02, center.lng + 0.02],
        [center.lat - 0.02, center.lng - 0.02]
      ];
      L.polygon(polygonCoords, {
        color: '#3b82f6',
        weight: 2,
        dashArray: '4, 4',
        fillColor: '#3b82f6',
        fillOpacity: 0.05
      }).addTo(boundariesLayerRef.current).bindTooltip(`Official Municipal Boundary (${city})`);
    }

    // Feature 118: Custom Geospatial Utility Layers (Underground Water Pipes & 11kV Cables)
    if (showUtilitiesGrid) {
      const waterPipeCoords = [
        [center.lat + 0.015, center.lng - 0.018],
        [center.lat + 0.005, center.lng - 0.005],
        [center.lat - 0.012, center.lng + 0.015]
      ];
      L.polyline(waterPipeCoords, {
        color: '#0284c7',
        weight: 3,
        dashArray: '8, 6'
      }).addTo(boundariesLayerRef.current).bindTooltip("Underground 350mm Water Feeder Trunk Grid");

      const powerCableCoords = [
        [center.lat - 0.015, center.lng - 0.012],
        [center.lat, center.lng + 0.008],
        [center.lat + 0.018, center.lng + 0.012]
      ];
      L.polyline(powerCableCoords, {
        color: '#eab308',
        weight: 3,
        dashArray: '4, 4'
      }).addTo(boundariesLayerRef.current).bindTooltip("PVVNL 11kV Subterranean Distribution Line");
    }

    // 2. Add Grievance Markers
    const filteredTickets = tickets.filter(t => {
      if (activeFilterDept !== 'All' && t.category !== activeFilterDept) return false;
      if (city !== 'All' && t.city && t.city.toLowerCase() !== city.toLowerCase()) return false;
      return true;
    });

    filteredTickets.forEach(ticket => {
      const isSelected = selectedTicket && selectedTicket.id === ticket.id;
      const color = DEPT_COLORS[ticket.category] || '#2563eb';
      const isCritical = ticket.isEmergencySos || ticket.status === 'ESCALATED';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background-color: ${color};
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            border-radius: 50%;
            border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${isSelected ? '14px' : '10px'};
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
            ${isCritical ? 'animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}
          ">
            ${ticket.isEmergencySos ? '🚨' : ticket.stage}
          </div>
        `,
        iconSize: isSelected ? [32, 32] : [24, 24],
        iconAnchor: isSelected ? [16, 16] : [12, 12]
      });

      const marker = L.marker([ticket.lat, ticket.lng], { icon: customIcon }).addTo(markersLayerRef.current);

      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
          <strong>#${ticket.id}</strong>: ${ticket.title}<br/>
          <span style="color: ${color}">● ${ticket.category}</span> · Stage ${ticket.stage}
        </div>
      `, { direction: 'top', offset: [0, -10] });

      marker.on('click', () => {
        setSelectedTicket(ticket);
      });
    });

    // 3. Draw Route & Facilities for Selected Ticket
    if (selectedTicket) {
      const office = selectedTicket.nearestOffice;

      if (office && office.lat && office.lng) {
        const officeIcon = L.divIcon({
          className: 'custom-gov-pin',
          html: `
            <div style="
              background: linear-gradient(135deg, #1e3a8a, #3b82f6);
              width: 36px;
              height: 36px;
              border-radius: 10px;
              border: 2px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 16px;
            ">
              🏛️
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        L.marker([office.lat, office.lng], { icon: officeIcon })
          .addTo(routesLayerRef.current)
          .bindTooltip(`<strong>${office.name}</strong><br/>${office.officer}`, { permanent: false });

        // Route Polyline
        const midLat = (office.lat + selectedTicket.lat) / 2 + 0.001;
        const midLng = (office.lng + selectedTicket.lng) / 2;
        const routeCoords = [
          [office.lat, office.lng],
          [midLat, midLng],
          [selectedTicket.lat, selectedTicket.lng]
        ];

        L.polyline(routeCoords, {
          color: '#2563eb',
          weight: 4,
          opacity: 0.85
        }).addTo(routesLayerRef.current);

        // Feature 112: Live Maintenance Van Tracker (Moving Vehicle Icon)
        const vanIcon = L.divIcon({
          className: 'custom-van-marker',
          html: `
            <div style="
              background-color: #f59e0b;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 4px 12px rgba(245, 158, 11, 0.6);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              animation: bounce 1s infinite;
            ">
              🚚
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        // Van positioned midway along the response corridor
        L.marker([midLat, midLng], { icon: vanIcon })
          .addTo(routesLayerRef.current)
          .bindTooltip(`<strong>Van GN-04-J-8812 En Route</strong><br/>ETA: ${vanEtaMins} mins (1.1 km away)`, { direction: 'top', permanent: true });

        // Facilities
        if (showFacilities && office.nearbyFacilities) {
          office.nearbyFacilities.forEach(fac => {
            const facIcon = L.divIcon({
              className: 'custom-facility-pin',
              html: `
                <div style="
                  background-color: #475569;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.25);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 10px;
                ">
                  ${fac.type === 'Hospital' ? '🏥' : fac.type === 'Fire Station' ? '🚒' : '💧'}
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            L.marker([fac.lat, fac.lng], { icon: facIcon })
              .addTo(routesLayerRef.current)
              .bindTooltip(`<strong>${fac.type}</strong>: ${fac.name} (${fac.dist})`, { direction: 'top' });
          });
        }
      }
    }
  }, [tickets, selectedTicket, showTraffic, showBoundaries, showFacilities, showUtilitiesGrid, activeFilterDept, city, vanEtaMins]);

  const currentOffice = selectedTicket?.nearestOffice;
  const mapsUrl = selectedTicket && currentOffice 
    ? `https://www.google.com/maps/dir/?api=1&origin=${currentOffice.lat},${currentOffice.lng}&destination=${selectedTicket.lat},${selectedTicket.lng}`
    : '#';

  return (
    <div className="space-y-4 text-xs">
      
      {/* Feature 119: Transit Hazard Warning Banner */}
      {selectedTicket && selectedTicket.transitDetourNotice && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 animate-bounce" />
            <span>
              <strong>Transit Route Hazard Warning (Feature 119):</strong> {selectedTicket.transitDetourNotice}
            </span>
          </div>
          <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900 font-mono font-bold px-2 py-0.5 rounded uppercase">
            TRAFFIC DIVERSION ACTIVE
          </span>
        </div>
      )}

      {/* Layer Toggles Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold mr-1">Layer:</span>
          {["All", "Roads & Infrastructure", "Water Supply & Sewage", "Solid Waste & Cleanliness", "Electricity & Power", "Public Health & Safety"].map(dept => (
            <button
              key={dept}
              onClick={() => setActiveFilterDept(dept)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeFilterDept === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {dept === "All" ? "All Hazards" : dept.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Feature 118: Custom Geospatial Layers & Toggles */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={showBoundaries} 
              onChange={(e) => setShowBoundaries(e.target.checked)} 
              className="rounded text-blue-600"
            />
            <span>Ward Polygons</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={showUtilitiesGrid} 
              onChange={(e) => setShowUtilitiesGrid(e.target.checked)} 
              className="rounded text-blue-600"
            />
            <span>Pipe/Cable Grid (F-118)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={showFacilities} 
              onChange={(e) => setShowFacilities(e.target.checked)} 
              className="rounded text-blue-600"
            />
            <span>Essential Facilities</span>
          </label>
        </div>

      </div>

      {/* Main Map & Office Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Vector Map Container */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative min-h-[460px] h-[520px]">
          <div ref={mapContainerRef} className="h-full w-full z-0" />
          
          {/* Overlay Map Badge */}
          <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live GPS Telemetry ({city})</span>
          </div>

          {/* Feature 113: Dynamic Nearest Authority Floating Compass */}
          {currentOffice && (
            <div className="absolute top-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white animate-spin-slow" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-blue-300 font-bold uppercase">Authority Compass (F-113)</div>
                <div className="text-[11px] font-bold">750m NNE to {currentOffice.name.split('—')[0]}</div>
              </div>
            </div>
          )}

          {/* Feature 112: Floating Live Maintenance Van Status */}
          <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-slate-700 text-[11px] shadow-lg flex items-center gap-3">
            <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Truck className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="font-bold flex items-center gap-2">
                <span>Van Tracker GN-04-J-8812</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 rounded font-mono font-black">EN ROUTE</span>
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                ETA: {vanEtaMins} mins · Dispatched by PWD Civil Works
              </div>
            </div>
          </div>
        </div>

        {/* Selected Issue & Government Office Directory Sidebar */}
        <div className="space-y-4 flex flex-col justify-between">
          
          {selectedTicket ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex-1">
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-600">{selectedTicket.id}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                    Stage {selectedTicket.stage}: {selectedTicket.status}
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1 leading-snug">
                  {selectedTicket.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  📍 {selectedTicket.location} ({selectedTicket.ward})
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                  <span>GPS: {selectedTicket.lat}, {selectedTicket.lng}</span>
                  <span>·</span>
                  <span>Alt: {selectedTicket.elevationMeters || 198}m</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-bold">Geofence: &lt;15m ✓</span>
                </div>
              </div>

              {/* Nearest Office Card */}
              {currentOffice ? (
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs space-y-2">
                  <div className="flex items-center justify-between text-blue-900 dark:text-blue-300 font-bold text-[11px] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Nearest Competent Office
                    </span>
                    <span className="font-mono">{currentOffice.distance}</span>
                  </div>

                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {currentOffice.name}
                  </div>
                  
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    {currentOffice.address}
                  </div>

                  <div className="pt-1 border-t border-blue-200 dark:border-blue-900 space-y-1 text-[11px]">
                    <div><strong>Nodal Officer:</strong> {currentOffice.officer}</div>
                    <div><strong>Emergency Phone:</strong> {currentOffice.phone}</div>
                    <div><strong>Operating Hours:</strong> {currentOffice.hours || '09:30 AM – 06:00 PM'}</div>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Turn-by-Turn GPS</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>

                    {/* Feature 120: Street View Comparison Trigger */}
                    <button
                      onClick={() => setStreetViewModalOpen(true)}
                      className="py-2 px-3 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <SplitSquareVertical className="w-3.5 h-3.5" />
                      <span>Street View Compare</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* View Full Ticket Action */}
              <button
                onClick={() => onSelectTicket(selectedTicket)}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Inspect Full Evidence &amp; Audit Trail &rarr;
              </button>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 text-xs">
              Click any pin on the map to inspect details
            </div>
          )}

        </div>

      </div>

      {/* Feature 120: Side-by-Side Street View Comparison Modal */}
      {streetViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SplitSquareVertical className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Google Street View Historical Comparison (Feature 120)
                </h3>
              </div>
              <button onClick={() => setStreetViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Historical Street View (Baseline)</span>
                  <span className="text-[10px] text-slate-400 font-mono">June 2024 Archive</span>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700">
                  <img 
                    src={selectedTicket.streetViewBaselineUrl || "https://images.unsplash.com/photo-1578873375969-d71a742d4a79?auto=format&fit=crop&w=700&q=80"} 
                    alt="Historical Street View"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Pristine intact asphalt road surface before underground trench collapse.</p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between">
                  <span>Citizen Uploaded Damage Photo</span>
                  <span className="text-[10px] font-mono">Current Hardware Capture</span>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-video border border-rose-300 dark:border-rose-800">
                  <img 
                    src={selectedTicket.photoUrl} 
                    alt="Current Damage"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Severely cratered pothole detected by YOLOv8 (14.2cm depth).</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
