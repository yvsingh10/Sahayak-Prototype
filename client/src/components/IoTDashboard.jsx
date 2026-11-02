import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Cpu, 
  Activity, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Wind, 
  Compass, 
  Bus, 
  Zap, 
  AlertOctagon, 
  RefreshCw,
  BellRing,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function IoTDashboard({ activeCity, onTicketCreated }) {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggeringId, setTriggeringId] = useState(null);
  const [lastDispatchedTicket, setLastDispatchedTicket] = useState(null);

  const loadSensors = async () => {
    try {
      const res = await api.getIotSensors(activeCity);
      if (res.success) {
        setSensors(res.activeGridSensors || []);
      }
    } catch (err) {
      console.error("IoT load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
    const interval = setInterval(loadSensors, 12000);
    return () => clearInterval(interval);
  }, [activeCity]);

  const handleSimulateAnomaly = async (sensorId) => {
    setTriggeringId(sensorId);
    try {
      const res = await api.triggerIotAnomaly(sensorId);
      if (res.success) {
        setLastDispatchedTicket(res.ticket);
        loadSensors();
        if (onTicketCreated) onTicketCreated(res.ticket);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTriggeringId(null);
    }
  };

  const getSensorIcon = (type) => {
    switch (type) {
      case 'WATER_PRESSURE': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'DUMPSTER_FILL': return <Trash2 className="w-5 h-5 text-emerald-500" />;
      case 'STREETLIGHT_GRID': return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'AQI_POLLUTION': return <Wind className="w-5 h-5 text-purple-500" />;
      case 'DRAIN_FLOOD': return <Compass className="w-5 h-5 text-cyan-500" />;
      case 'ROAD_VIBRATION': return <Bus className="w-5 h-5 text-orange-500" />;
      case 'SEWAGE_PUMP': return <Activity className="w-5 h-5 text-rose-500" />;
      case 'TRAFFIC_LIGHT': return <AlertOctagon className="w-5 h-5 text-yellow-500" />;
      case 'TRANSFORMER_TEMP': return <Zap className="w-5 h-5 text-red-500" />;
      case 'WATER_QUALITY': return <Droplets className="w-5 h-5 text-teal-500" />;
      default: return <Cpu className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight font-mono">Smart City IoT &amp; Utility Sensor Grid</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase font-mono">
                Features 181–190 Active
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Real-time telemetry stream monitoring water pressure, dumpster capacity, air quality, transit vibration, and power transformers.
            </p>
          </div>
        </div>

        <button
          onClick={loadSensors}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2 border border-slate-700 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Auto-Dispatched Ticket Banner */}
      {lastDispatchedTicket && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-600 text-white animate-bounce">
              <BellRing className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-sm">
                High-Priority Municipal Ticket Dispatched: #{lastDispatchedTicket.id}
              </div>
              <div className="text-[11px] text-rose-700 dark:text-rose-300">
                {lastDispatchedTicket.title} — Dispatched to {lastDispatchedTicket.category} under 48h Mandatory SLA.
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-mono font-bold text-[11px]">
            STAGE 1: AUTO-TRIAGED
          </span>
        </div>
      )}

      {/* 10-Card Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => {
          const isCritical = sensor.status.includes('CRITICAL') || sensor.status.includes('OVERFLOW') || sensor.status.includes('SEVERE') || sensor.status.includes('TRIP');

          return (
            <div 
              key={sensor.id}
              className={`p-4 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isCritical 
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 shadow-sm shadow-rose-500/10' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {getSensorIcon(sensor.type)}
                    </span>
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 font-bold">{sensor.id}</div>
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{sensor.name}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                    isCritical ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {sensor.status}
                  </span>
                </div>

                {/* Metric Readout */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500">Live Reading</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {sensor.currentValue} <span className="text-xs text-slate-500 font-normal">{sensor.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">Normal Range</div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {sensor.normalRange}
                    </div>
                  </div>
                </div>

                {/* Location & Alert Notice */}
                <div className="text-[11px] space-y-1">
                  <div className="text-slate-500">
                    📍 {sensor.location} ({sensor.ward})
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-medium">
                    ⚠️ {sensor.alertTitle}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Dept: {sensor.department}</span>
                <button
                  onClick={() => handleSimulateAnomaly(sensor.id)}
                  disabled={triggeringId === sensor.id}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 text-[11px]"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{triggeringId === sensor.id ? 'Dispatched...' : 'Trigger Auto-Alarm'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

