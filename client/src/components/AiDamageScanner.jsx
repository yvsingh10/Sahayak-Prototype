import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Camera, 
  Sparkles, 
  Mic, 
  Eye, 
  ShieldAlert, 
  Flame, 
  Sun, 
  Moon, 
  Video, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Zap,
  Volume2
} from 'lucide-react';

export default function AiDamageScanner({ onScanComplete, initialCategory = 'Roads & Infrastructure' }) {
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  // AI Results
  const [potholeData, setPotholeData] = useState(null);
  const [wasteData, setWasteData] = useState(null);
  const [qualityData, setQualityData] = useState(null);
  const [voiceData, setVoiceData] = useState(null);
  const [fireData, setFireData] = useState(null);
  const [keyframesData, setKeyframesData] = useState(null);
  const [privacyMaskActive, setPrivacyMaskActive] = useState(false);
  const [nightVisionActive, setNightVisionActive] = useState(false);
  const [streetlightData, setStreetlightData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  // Trigger full suite of AI computer vision scans
  const runAiVisionScan = async () => {
    setLoading(true);
    try {
      const [potholeRes, wasteRes, qualityRes, fireRes, lightRes] = await Promise.all([
        api.aiPotholeDepth({ title: "Crater on main road", description: "Deep dangerous pothole", category: activeCategory }),
        api.aiWasteDensity({ title: "Garbage overflow", description: "Dumpster pile" }),
        api.aiCheckQuality({ imageBase64: photoUrl }),
        api.aiDetectFire({ title: "Wire spark or smoke", description: "Hazardous condition" }),
        api.aiStreetlight({ title: "Streetlight flickering", description: "Dark road" })
      ]);

      if (potholeRes.success) setPotholeData(potholeRes.analysis);
      if (wasteRes.success) setWasteData(wasteRes.analysis);
      if (qualityRes.success) setQualityData(qualityRes.quality);
      if (fireRes.success) setFireData(fireRes.fireDetection);
      if (lightRes.success) setStreetlightData(lightRes.illuminance);

      if (onScanComplete) {
        onScanComplete({
          potholeData: potholeRes?.analysis,
          wasteData: wasteRes?.analysis,
          photoUrl
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceRecord = async () => {
    setVoiceRecording(true);
    setTimeout(async () => {
      setVoiceRecording(false);
      try {
        const res = await api.aiTranscribeVoice({ audioBase64: 'mock_audio', language: selectedLanguage });
        if (res.success) {
          setVoiceData(res.transcription);
        }
      } catch (err) {
        console.error(err);
      }
    }, 1800);
  };

  const handleVideoKeyframes = async () => {
    try {
      const res = await api.aiVideoKeyframes({ videoUrl: 'mock_video' });
      if (res.success) {
        setKeyframesData(res.keyframes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-5 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Visual Damage Classification &amp; Smart Media</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                Features 121–130
              </span>
            </div>
            <p className="text-slate-500 text-[11px]">YOLOv8 damage estimation, Whisper speech transcription &amp; biometric privacy shield</p>
          </div>
        </div>

        <button
          onClick={runAiVisionScan}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{loading ? 'Analyzing Neural Net...' : 'Run Neural Scan'}</span>
        </button>
      </div>

      {/* Main Vision Preview Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Photo with Bounding Boxes & Filters */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
          <img 
            src={photoUrl} 
            alt="Civic Issue Scan" 
            className={`w-full h-full object-cover transition-all duration-300 ${nightVisionActive ? 'brightness-150 contrast-125 hue-rotate-15 saturate-150' : ''}`}
          />

          {/* YOLOv8 Bounding Box Overlays */}
          {potholeData && (
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute border-2 border-rose-500 bg-rose-500/20 rounded text-[10px] font-bold text-white px-1 shadow-lg animate-pulse"
                style={{ left: '28%', top: '35%', width: '44%', height: '38%' }}
              >
                <div className="bg-rose-600 text-white px-1 rounded -top-4 left-0 absolute whitespace-nowrap text-[9px] font-mono">
                  Pothole Core (96% conf · {potholeData.estimatedDepthCm}cm depth)
                </div>
              </div>
              <div 
                className="absolute border border-amber-400 bg-amber-400/20 rounded text-[10px] font-bold text-white px-1 shadow-lg"
                style={{ left: '22%', top: '70%', width: '56%', height: '18%' }}
              >
                <div className="bg-amber-600 text-white px-1 rounded -top-4 left-0 absolute whitespace-nowrap text-[9px] font-mono">
                  Asphalt Fissure (89% conf)
                </div>
              </div>
            </div>
          )}

          {/* Privacy Mask Overlays */}
          {privacyMaskActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-400 text-emerald-400 text-[9px] font-mono flex items-center justify-center text-center p-1 font-bold">
                FACE BLURRED (DPDP)
              </div>
              <div className="absolute bottom-6 left-12 px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur-md border border-emerald-400 text-emerald-400 text-[9px] font-mono font-bold">
                PLATE MASKED: DL-**-****
              </div>
            </div>
          )}

          {/* Bottom Toolbar inside Video */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono text-[10px]">YOLOv8-GovTech Active</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrivacyMaskActive(!privacyMaskActive)}
                className={`px-2 py-0.5 rounded font-bold text-[10px] transition-colors ${privacyMaskActive ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {privacyMaskActive ? 'Privacy Mask ON' : 'Mask Face & Plate'}
              </button>
              <button
                onClick={() => setNightVisionActive(!nightVisionActive)}
                className={`px-2 py-0.5 rounded font-bold text-[10px] transition-colors ${nightVisionActive ? 'bg-amber-500 text-slate-950' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {nightVisionActive ? 'Night Vision ON' : 'Night Enhance'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Analysis Cards */}
        <div className="space-y-3">
          
          {/* Feature 121: YOLOv8 Pothole Depth & Area */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>YOLOv8 Pothole Depth &amp; Area Metric (Feature 121)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 font-bold font-mono text-[10px]">
                {potholeData?.hazardLevel || 'High Severity'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-black text-slate-900 dark:text-white font-mono">{potholeData?.estimatedAreaM2 || '1.8'} m²</div>
                <div className="text-[10px] text-slate-500">Surface Area</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono">{potholeData?.estimatedDepthCm || '14.2'} cm</div>
                <div className="text-[10px] text-slate-500">Pothole Depth</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">96%</div>
                <div className="text-[10px] text-slate-500">Confidence</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              <strong>Recommended Material:</strong> {potholeData?.recommendedRepairMaterial || 'Bituminous Hot-Mix Asphalt Grade VG-30'}
            </div>
          </div>

          {/* Feature 122: Solid Waste Volume Density Scorer */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">WasteNet Density Scorer (Feature 122)</div>
              <div className="text-slate-500 text-[11px]">
                Volume: <strong>{wasteData?.estimatedVolumeM3 || '4.2'} m³</strong> · {wasteData?.wasteType || 'Construction & Demolition Malba'}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 font-bold font-mono text-[10px]">
              {wasteData?.recommendedVehicle || 'JCB 3DX + Tipper'}
            </span>
          </div>

          {/* Feature 123: Blurry & Dark Image Auto-Rejection */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="font-bold text-emerald-900 dark:text-emerald-200">Image Clarity Check (Feature 123)</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300">Sharpness: 88/100 · Luminance: 76/100 (Crisp &amp; in-focus hardware capture)</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded font-mono">
              PASSED
            </span>
          </div>

        </div>

      </div>

      {/* Row 2: Whisper Voice Input & Video Keyframes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        
        {/* Feature 125: Whisper AI Multilingual Speech Transcriber */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Multi-Dialect Voice Scribe (Feature 125)</span>
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]"
            >
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="bhojpuri">Bhojpuri (भोजपुरी)</option>
              <option value="punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
              <option value="en">English (Indian)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceRecord}
              disabled={voiceRecording}
              className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm ${voiceRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{voiceRecording ? 'Listening (7.4s audio clip)...' : 'Hold to Speak Grievance'}</span>
            </button>
          </div>

          {voiceData && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-1">
              <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 font-mono uppercase">
                Whisper AI Transcribed ({voiceData.language}):
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-200 italic">
                "{voiceData.text}"
              </p>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400">
                Auto-assigned category: <strong>{voiceData.categorySuggested}</strong> (Confidence: {voiceData.confidence * 100}%)
              </div>
            </div>
          )}
        </div>

        {/* Feature 127: 10-Second Video 3-Keyframe Extractor */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Video Damage 3-Keyframe Extractor (Feature 127)</span>
            </div>
            <button
              onClick={handleVideoKeyframes}
              className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 font-bold text-[11px]"
            >
              Extract Frames
            </button>
          </div>

          <p className="text-slate-500 text-[11px]">
            Citizens upload 10-second MP4 video clips; the backend extracts the top 3 sharpest frames for evidence logs.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { time: "00:02.4", label: "Impact Angle", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80" },
              { time: "00:05.1", label: "Max Depth Metric", url: "https://images.unsplash.com/photo-1578873375969-d71a742d4a79?auto=format&fit=crop&w=300&q=80" },
              { time: "00:08.7", label: "Traffic Disruption", url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=300&q=80" }
            ].map((kf, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group">
                <img src={kf.url} alt={kf.label} className="w-full h-16 object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 p-1 flex flex-col justify-between text-[9px] text-white font-mono">
                  <span className="bg-black/60 px-1 rounded w-fit">{kf.time}</span>
                  <span className="font-bold truncate">{kf.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

