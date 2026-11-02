import React from 'react';

export default function HeatmapView({ tickets, activeCity, cityWards, onSelectWard }) {
  const city = activeCity === 'All' ? 'Greater Noida' : activeCity;
  const wards = cityWards[city] || [
    "Ward 1 (Alpha 1)", "Ward 4 (Beta 2)", "Ward 8 (Delta 1)", "Ward 12 (Knowledge Park)", "Ward 15 (Pari Chowk)"
  ];

  return (
    <div className="space-y-6">
      
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Civic Problem Density & Ward Clustering</h2>
          <p className="text-xs text-slate-500">Spatial grievance concentration across municipal sectors in {city}</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Low (&lt;3)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400 inline-block"></span> Moderate (3-5)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-600 inline-block"></span> Critical Hotspot (&gt;5)</span>
        </div>
      </div>

      {/**/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wards.map(ward => {
          const wardTickets = tickets.filter(t => t.city === city && t.ward === ward);
          const count = wardTickets.length;
          const escalated = wardTickets.filter(t => t.status === 'ESCALATED').length;

          let colorTheme = "border-emerald-200 bg-emerald-50/40 text-emerald-900";
          let badgeText = "Low Density";
          let badgeClass = "bg-emerald-100 text-emerald-800";

          if (count >= 3 && count < 5) {
            colorTheme = "border-amber-200 bg-amber-50/40 text-amber-900";
            badgeText = "Moderate Density";
            badgeClass = "bg-amber-100 text-amber-800";
          } else if (count >= 5 || escalated > 0) {
            colorTheme = "border-rose-300 bg-rose-50/50 text-rose-900";
            badgeText = "Critical Cluster";
            badgeClass = "bg-rose-100 text-rose-800 font-bold";
          }

          return (
            <div key={ward} className={`p-4 rounded-xl border ${colorTheme} shadow-sm space-y-3`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeClass}`}>{badgeText}</span>
                <span className="text-xs font-mono font-bold">{count} Active Tickets</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{ward}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{city} Municipal Zone</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Escalated: <strong>{escalated}</strong></span>
                <button 
                  onClick={() => onSelectWard(ward)}
                  className="text-blue-600 hover:underline font-semibold text-xs"
                >
                  View Ward Tickets →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/**/}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Hotspot Intelligence Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800">Greater Noida Hotspot:</div>
            <div className="text-slate-600 mt-1">Knowledge Park II & Alpha 1 Commercial Belt (Ward 12, Ward 1). Major asphalt distress & solid waste backlogs.</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800">Delhi NCT Hotspot:</div>
            <div className="text-slate-600 mt-1">Dwarka Sector 10 & Ring Road Intersection (Ward 7, Ward 18). Ruptured high-pressure lines & unlit pockets.</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800">Lucknow Hotspot:</div>
            <div className="text-slate-600 mt-1">Hazratganj Pedestrian Corridor & Charbagh Overbridge (Ward 3, Ward 9). High-voltage exposed streetlighting cables.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
