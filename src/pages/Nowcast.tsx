import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/maplibre";
import { cn } from "../lib/utils";
import {
  Search,
  X,
  Radar,
  CloudLightning,
  AlertTriangle,
  Satellite,
  Wind,
  ShieldAlert,
  ArrowUpRight,
  ChevronRight,
  Navigation,
  Cloud,
  Zap,
  Car,
  Eye,
  Droplets,
  FastForward,
} from "lucide-react";
import { useLocationContext } from "../context/LocationContext";
import { useMetrics, useStorms, useAIExplanation } from "../services/api";
import { DEMO_DATA } from "../data/demoData";

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 19,
      paint: {
        "raster-saturation": -0.1,
        "raster-contrast": 0.1,
        "raster-brightness-min": 0.3,
        "raster-brightness-max": 0.9,
      },
    },
  ],
};

export function Nowcast() {
  const [activeLayer, setActiveLayer] = useState("radar");
  const { location, setLocation, fullData, stormsData } = useLocationContext();
  const [searchInput, setSearchInput] = useState(location.name);
  
  // Use global context data
  const metrics = fullData.nowcast;
  
  const activeStorms = stormsData;
  const { data: aiData, isLoading: aiLoading } = useAIExplanation(location, fullData);



  return (
    <div className="flex flex-col h-full text-[#2c3e50] overflow-y-auto lg:overflow-hidden w-full relative z-50 rounded-2xl">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 min-h-0">
        {/* Map Area */}
        <div className="min-h-[400px] lg:min-h-0 flex-1 relative rounded-2xl overflow-hidden bg-[#e2e8f0] border border-black/5 shadow-sm flex shrink-0 lg:shrink">
          <Map
            initialViewState={{
              longitude: location.coordinates.lng,
              latitude: location.coordinates.lat,
              zoom: 6,
            }}
            mapStyle={MAP_STYLE as any}
            style={{ width: "100%", height: "100%" }}
          >
            {/* India States Boundaries */}
            <Source id="india-states" type="geojson" data="/india-states.geojson">
              <Layer
                id="india-states-line"
                type="line"
                paint={{
                  "line-color": "#22393C", // text-primary equivalent for borders
                  "line-width": 1,
                  "line-opacity": 0.3,
                }}
              />
            </Source>

            {/* Pulsing Marker for Selected Location */}
            <Marker longitude={location.coordinates.lng} latitude={location.coordinates.lat}>
              <div className="relative flex items-center justify-center pointer-events-none">
                <div className="absolute w-32 h-32 bg-rose-500/10 rounded-full animate-ping"></div>
                <div className="absolute w-16 h-16 bg-rose-500/20 rounded-full"></div>
                <div className="relative bg-[#0f172a] text-white p-1 rounded-full border-2 border-white shadow-lg pointer-events-auto cursor-pointer">
                  <div className="w-3 h-3 bg-rose-500 rounded-full" />
                </div>
              </div>
            </Marker>

            {/* Floating Label for Selected Location */}
            <Marker longitude={location.coordinates.lng + 0.2} latitude={location.coordinates.lat}>
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-[#0f172a] shadow-sm border border-black/10 flex items-center gap-2">
                <div className="w-2.5 h-2.5 border-[2px] border-slate-700 rounded-full bg-transparent flex items-center justify-center">
                  <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                </div>
                {location.name}
              </div>
            </Marker>

            {/* Dynamic Storm Cells */}
            {activeStorms?.map((storm) => (
              <Marker key={storm.id} longitude={storm.coordinates[0]} latitude={storm.coordinates[1]}>
                <div className="bg-[#1e293b] text-white p-3.5 rounded-xl shadow-2xl flex items-center gap-4 border border-white/10 cursor-pointer hover:bg-[#273549] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">
                      {storm.id}
                    </span>
                    <span className="text-[10px] text-rose-400 font-semibold mt-0.5">
                      {storm.intensity} Intensity
                    </span>
                    <span className="text-[10px] text-slate-300 mt-0.5">
                      Moving {storm.movement} · {storm.speed} km/h
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </Marker>
            ))}
          </Map>

          {/* Floating Search Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 z-10">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchInput.trim()) {
                  const normalizedSearch = searchInput.toLowerCase();
                  let matchedKey = "";
                  
                  const allData = DEMO_DATA;
                  Object.keys(allData).forEach(key => {
                    const cityName = allData[key].location.name.split(',')[0].toLowerCase();
                    if (
                      normalizedSearch.includes(key) || 
                      normalizedSearch.includes(cityName) ||
                      key.includes(normalizedSearch) ||
                      cityName.includes(normalizedSearch)
                    ) {
                      matchedKey = key;
                    }
                    if ((normalizedSearch.includes('bangalore') || normalizedSearch.includes('banglore')) && key === 'bengaluru') {
                      matchedKey = key;
                    }
                  });

                  const match = matchedKey ? allData[matchedKey] : null;
                  
                  if (match) {
                    setLocation({
                      name: match.location.name,
                      state: match.location.region || "Region",
                      coordinates: { lat: match.location.coords[0], lng: match.location.coords[1] }
                    });
                  } else {
                    const pseudoLat = 12 + Math.random() * 5;
                    const pseudoLng = 77 + Math.random() * 5;
                    setLocation({
                      name: searchInput.trim(),
                      state: "Custom Region",
                      coordinates: { lat: pseudoLat, lng: pseudoLng }
                    });
                  }
                }
              }}
              className="glass-panel flex items-center rounded-full px-4 py-2.5 shadow-lg border border-white/20">
              <button type="submit" className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors mr-1">
                <Search className="w-4 h-4 text-black/70" />
              </button>
              <input
                type="text"
                placeholder="Search location (Press Enter)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none px-3 text-sm font-medium text-black placeholder:text-black/50"
              />
              <button 
                type="button"
                onClick={() => setSearchInput('')}
                className="p-1 hover:bg-black/5 rounded-full transition-colors shrink-0 btn-primary">
                <X className="w-4 h-4 text-black/70" />
              </button>
            </form>
          </div>

          {/* Bottom Left Legend */}
          <div className="absolute bottom-4 left-4 glass-panel p-4 rounded-xl shadow-lg w-72">
            <h4 className="text-[10px] font-bold text-black mb-2.5 uppercase tracking-wide">
              Radar Reflectivity (dBZ)
            </h4>
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-teal-400 via-red-400 to-rose-700"></div>
            <div className="flex justify-between mt-1.5 text-[10px] font-semibold text-[#64748b]">
              <span className="text-left">
                0<br />
                <span className="font-medium">Light</span>
              </span>
              <span className="text-center">
                20
                <br />
                <span className="font-medium">Moderate</span>
              </span>
              <span className="text-center">40</span>
              <span className="text-center">
                60
                <br />
                <span className="font-medium">Heavy</span>
              </span>
              <span className="text-right">
                80
                <br />
                <span className="font-medium">Severe</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="w-full lg:w-[420px] shrink-0 glass-panel rounded-2xl shadow-sm overflow-y-auto flex flex-col custom-scroll">
          {/* Header Graphic Area */}
          <div className="p-6 pb-4 relative overflow-hidden shrink-0 border-b border-black/5">
            <div className="relative z-10">
              <h2 className="text-4xl font-serif text-[#0f172a] tracking-tight">
                {location.name}
              </h2>
              <p className="text-sm text-[#475569] font-medium mt-1">
                {location.state}
              </p>
              <p className="text-[11px] text-[#94a3b8] font-mono mt-1">
                {location.coordinates.lat.toFixed(2)}° N, {location.coordinates.lng.toFixed(2)}° E
              </p>
            </div>
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
                    ? `A strong thunderstorm cell is near ${location.name} and moving southeast. Lightning activity is increasing.`
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
                  ? `Thunderstorms may affect travel around ${location.name} during the next 1-2 hours.`
                  : `Conditions are clear for travel around ${location.name}.`}
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
      </div>
    </div>
  );
}
