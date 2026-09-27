import React from "react";
import {
  X,
  Cloud,
  Zap,
  AlertTriangle,
  Wind,
  Droplets,
  Car,
  Eye,
  ArrowUpRight,
  Navigation,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { DEMO_DATA } from "../../data/demoData";
import { useLocationContext } from "../../context/LocationContext";
import { useAIExplanation } from "../../services/api";
import type { LocationData } from "../../context/LocationContext";

interface LocationPanelProps {
  location: LocationData | null;
  onClose: () => void;
}

export function LocationPanel({ location, onClose }: LocationPanelProps) {
  const { fullData } = useLocationContext();
  const { data: aiData, isLoading: aiLoading } = useAIExplanation(location || { name: "", state: "", coordinates: { lat: 0, lng: 0 } }, fullData);

  if (!location || (location.coordinates.lat === 0 && location.coordinates.lng === 0)) return null;

  // Try to find matching city data for localized metrics
  let cityData: any = null;
  if (location.name) {
    const searchStr = location.name.split(',')[0].toLowerCase().replace(/[^a-z]/g, "");
    Object.keys(DEMO_DATA).forEach(key => {
      const demoCityName = DEMO_DATA[key].location.name.split(',')[0].toLowerCase().replace(/[^a-z]/g, "");
      if (
        searchStr.includes(key) || 
        key.includes(searchStr) ||
        searchStr.includes(demoCityName) ||
        demoCityName.includes(searchStr)
      ) {
        cityData = DEMO_DATA[key];
      }
      if ((searchStr.includes('bangalore') || searchStr.includes('banglore')) && key === 'bengaluru') {
        cityData = DEMO_DATA[key];
      }
    });
  }

  // Use localized metrics if available, otherwise fallback to global
  const metrics = cityData ? cityData.nowcast : fullData.nowcast;
  const locationTitle = cityData ? cityData.location.name.split(',')[0] : (location.name || "Selected Location");

  return (
    <div className="absolute top-4 left-4 right-4 md:left-auto md:w-[420px] glass-panel shadow-lg flex flex-col z-10 max-h-[calc(100%-6rem)] overflow-y-auto animate-in slide-in-from-right-4 rounded-2xl custom-scroll bg-white/90 backdrop-blur-xl border border-white/20">
      {/* Header Graphic Area */}
      <div className="p-6 pb-4 relative overflow-hidden shrink-0 border-b border-black/5 flex justify-between items-start">
        <div className="relative z-10">
          <h2 className="text-4xl font-serif text-[#0f172a] tracking-tight">
            {locationTitle}
          </h2>
          <p className="text-sm text-[#475569] font-medium mt-1">
            {location.state}
          </p>
          <p className="text-[11px] text-[#94a3b8] font-mono mt-1">
            {location.coordinates.lat.toFixed(2)}° N, {location.coordinates.lng.toFixed(2)}° E
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-black/5 rounded-full text-black hover:text-black transition-colors relative z-20 btn-primary"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Decorative background visual to simulate the image */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-slate-100 rounded-full opacity-50 pointer-events-none"></div>
      </div>

      <div className="px-6 flex-1 flex flex-col gap-6 py-5">
        {/* Current Conditions */}
        <div>
          <div className="flex justify-between items-end mb-2.5">
            <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider">
              Current Conditions
            </h3>
            <span className="text-[9px] text-[#94a3b8]">
              Updated 10:42 AM IST
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col gap-1.5 border border-black/5">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] text-[#475569] font-semibold leading-tight">
                  Thunderstorm
                  <br />
                  Probability
                </span>
              </div>
              <div className="text-3xl font-black text-[#0f172a] mt-1">
                {metrics?.thunderstormProbability ?? "--"}%
              </div>
            </div>
            <div className="bg-[#fffbeb] rounded-xl p-4 flex flex-col gap-1.5 border border-red-500/10">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-500" />
                <span className="text-[10px] text-[#475569] font-semibold leading-tight">
                  Lightning
                  <br />
                  Probability
                </span>
              </div>
              <div className="text-3xl font-black text-[#0f172a] mt-1">
                {metrics?.lightningProbability ?? "--"}%
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className={`rounded-xl p-4 border flex gap-3 shadow-sm ${metrics?.highRiskZones > 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
          <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 ${metrics?.highRiskZones > 0 ? 'text-rose-500' : 'text-slate-500'}`} />
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wide ${metrics?.highRiskZones > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
              {metrics?.highRiskZones > 0 ? "HIGH RISK" : "NORMAL"}
            </h4>
            <p className={`text-[11px] mt-1 leading-relaxed font-medium ${metrics?.highRiskZones > 0 ? 'text-rose-700/80' : 'text-slate-700/80'}`}>
              {metrics?.highRiskZones > 0 
                ? `A strong thunderstorm cell is near ${locationTitle} and moving southeast. Lightning activity is increasing.`
                : "No severe weather alerts active for this region."}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-black/10 py-4">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[9px] font-semibold text-black/80">
              Wind Speed
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-black">
              <Wind className="w-3.5 h-3.5 text-black/60" />
              {metrics?.windSpeed ?? "--"} km/h
            </div>
            <span className="text-[10px] text-black/80">Surface Wind</span>
          </div>
          <div className="flex flex-col gap-1 text-left border-l border-black/10 pl-3">
            <span className="text-[9px] font-semibold text-black/80">
              Humidity
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <Droplets className="w-3.5 h-3.5 text-rose-500" />
              {metrics?.humidity ?? "--"}%
            </div>
            <span className="text-[10px] text-black/80">
              Relative Humidity
            </span>
          </div>
          <div className="flex flex-col gap-1 text-left border-l border-black/10 pl-3">
            <span className="text-[9px] font-semibold text-black/80">
              Temperature
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-black">
              <div className="w-4 h-4 rounded-full border-[3px] border-[#3b82f6] border-r-white/50"></div>
              {metrics?.temperature ?? "--"}°C
            </div>
          </div>
        </div>

        {/* Forecast Timeline */}
        <div>
          <h3 className="text-xs font-bold text-black mb-5">
            Forecast Timeline
          </h3>
          <div className="flex justify-between relative px-2">
            <div className="absolute top-5 left-4 right-4 h-[3px] bg-black/10 -z-10 rounded-full"></div>

            {[
              { time: "Now", state: metrics.highRiskZones > 0 ? "High" : "Low", color: metrics.highRiskZones > 0 ? "bg-rose-500" : "bg-emerald-500" },
              { time: "+1h", state: metrics.highRiskZones > 0 ? "High" : "Low", color: metrics.highRiskZones > 0 ? "bg-red-500" : "bg-emerald-500" },
              { time: "+2h", state: metrics.highRiskZones > 0 ? "Moderate" : "Low", color: metrics.highRiskZones > 0 ? "bg-amber-400" : "bg-emerald-500" },
              { time: "+3h", state: metrics.highRiskZones > 0 ? "Low" : "Low", color: "bg-emerald-500" },
              { time: "+4h", state: "Low", color: "bg-emerald-500" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 bg-transparent"
              >
                <span className="text-[10px] font-semibold text-black">
                  {item.time}
                </span>
                <div
                  className={cn(
                    "w-3 h-3 rounded-full ring-[4px] ring-white/50",
                    item.color,
                  )}
                ></div>
                <span
                  className={cn(
                    "text-[9px] font-bold mt-1",
                    item.state === "High"
                      ? "text-rose-600"
                      : item.state === "Moderate"
                        ? "text-black/80"
                        : "text-emerald-700",
                  )}
                >
                  {item.state}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Impact */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-700">
                <Car className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-black">
                Travel Impact
              </h4>
            </div>
            <span className={cn(
              "px-2 py-0.5 rounded border text-[9px] font-bold tracking-wide",
              metrics.highRiskZones > 1 ? "bg-rose-200/50 text-rose-800 border-rose-500/20" :
              metrics.highRiskZones > 0 ? "bg-amber-200/50 text-amber-800 border-amber-500/20" :
              "bg-emerald-200/50 text-emerald-800 border-emerald-500/20"
            )}>
              {metrics.highRiskZones > 1 ? "SEVERE" : metrics.highRiskZones > 0 ? "MODERATE" : "LOW"}
            </span>
          </div>
          <p className="text-[11px] text-black/80 font-medium leading-relaxed mb-4">
            {metrics.highRiskZones > 0
              ? `Thunderstorms may affect travel around ${locationTitle} during the next 1-2 hours.`
              : `Conditions are clear for travel around ${locationTitle}.`}
          </p>
          <div className="flex justify-between border-t border-black/10 pt-3">
            {[
              { icon: Eye, label: "Reduced\nvisibility" },
              { icon: Droplets, label: "Water\naccumulation" },
              { icon: Wind, label: "Strong\nwinds" },
              { icon: Zap, label: "Lightning\nexposure" },
              { icon: Car, label: "Possible\ntraffic delays" },
            ].map((risk, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <risk.icon
                  className={cn(
                    "w-3.5 h-3.5",
                    i === 3 ? "text-rose-600" : "text-black/60",
                  )}
                />
                <span className="text-[8px] text-black/80 font-medium leading-tight whitespace-pre-line">
                  {risk.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="mt-2 bg-transparent pb-2">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-[11px] font-bold text-black">
              {metrics.highRiskZones > 0 ? "Why is risk increasing?" : "Current AI Assessment"}
            </h3>
            <span className="text-[9px] text-black/60 font-mono tracking-tighter">
              AI-Generated Insight
            </span>
          </div>
          <p className="text-[11px] text-black/90 font-medium leading-relaxed mb-3">
            {aiLoading ? "Vajra Saathi is analyzing conditions..." : aiData?.explanation}
          </p>
          <div className="flex gap-2">
            {metrics.highRiskZones > 0 ? [
              {
                icon: ArrowUpRight,
                label: "Radar\nStrengthening",
                color: "text-red-600",
                bg: "bg-white/40",
              },
              {
                icon: ArrowUpRight,
                label: "Lightning\nIncreasing",
                color: "text-rose-600",
                bg: "bg-white/40",
              },
              {
                icon: Navigation,
                label: "Storm movement\nToward location",
                color: "text-rose-600",
                bg: "bg-white/40",
              },
            ].map((tag, i) => (
              <div key={i} className="flex items-center gap-2 flex-1 p-1">
                <div
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0 border border-white/20",
                    tag.bg,
                  )}
                >
                  <tag.icon className={cn("w-3.5 h-3.5", tag.color)} />
                </div>
                <span className="text-[9px] text-black font-semibold leading-tight whitespace-pre-line">
                  {tag.label}
                </span>
              </div>
            )) : [
              {
                icon: Cloud,
                label: "Clear\nSkies",
                color: "text-emerald-600",
                bg: "bg-white/40",
              },
              {
                icon: Navigation,
                label: "Stable\nAtmosphere",
                color: "text-teal-600",
                bg: "bg-white/40",
              }
            ].map((tag, i) => (
              <div key={i} className="flex items-center gap-2 flex-1 p-1">
                <div
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0 border border-white/20",
                    tag.bg,
                  )}
                >
                  <tag.icon className={cn("w-3.5 h-3.5", tag.color)} />
                </div>
                <span className="text-[9px] text-black font-semibold leading-tight whitespace-pre-line">
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

