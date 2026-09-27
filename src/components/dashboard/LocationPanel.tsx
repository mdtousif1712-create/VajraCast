import React from "react";
import { X, Info, Zap, CloudRain, Wind } from "lucide-react";
import { cn } from "../../lib/utils";
import { DEMO_DATA } from "../../data/demoData";
import type { FullLocationData } from "../../data/demoData";
import type { LocationData } from "../../context/LocationContext";

interface LocationPanelProps {
  location: LocationData | null;
  onClose: () => void;
}

export function LocationPanel({ location, onClose }: LocationPanelProps) {
  if (!location || (location.coordinates.lat === 0 && location.coordinates.lng === 0)) return null;

  // Try to find matching city data
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

  // Fallbacks if no data found
  const isHighRisk = cityData ? cityData.nowcast.highRiskZones > 0 : Math.random() > 0.5;
  const tProb = cityData ? cityData.nowcast.thunderstormProbability : Math.floor(Math.random() * 40 + 40);
  const lProb = cityData ? cityData.nowcast.lightningProbability : Math.floor(Math.random() * 40 + 40);
  const confidence = cityData ? 80 + Math.floor(Math.random() * 15) : 84;
  const riskLevel = isHighRisk ? "HIGH" : tProb > 50 ? "MODERATE" : "LOW";
  const riskColor = isHighRisk ? "bg-weather-severe/10 border-weather-severe/20" : "bg-weather-high/10 border-weather-high/20";
  const locationTitle = cityData ? cityData.location.name.split(',')[0] : (location.name || "Selected Location");

  return (
    <div className="absolute top-4 right-4 w-80 glass-panel shadow-lg flex flex-col z-10 max-h-[calc(100%-6rem)] overflow-auto animate-in slide-in-from-right-4">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-20">
        <div>
          <h3 className="font-serif text-lg tracking-tight text-ink uppercase">
            {locationTitle}
          </h3>
          <p className="font-mono text-xs text-ink">
            {location.coordinates.lat.toFixed(4)}° N, {location.coordinates.lng.toFixed(4)}° E
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-surface-muted rounded-full text-ink hover:text-ink transition-colors btn-primary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-3 bg-surface-muted/50 border-transparent">
            <span className="font-mono text-[10px] text-ink uppercase tracking-widest font-semibold flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-ink" />
              Thunderstorm
            </span>
            <div className="mt-1 font-serif text-2xl text-ink">{tProb}%</div>
          </div>
          <div className="card p-3 bg-surface-muted/50 border-transparent">
            <span className="font-mono text-[10px] text-ink uppercase tracking-widest font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-ink" />
              Lightning
            </span>
            <div className="mt-1 font-serif text-2xl text-ink">{lProb}%</div>
          </div>
          <div className={cn("card p-3 col-span-2", riskColor)}>
            <div className="flex justify-between items-end">
              <div>
                <span className="font-mono text-[10px] text-ink uppercase tracking-widest font-semibold">
                  Risk Level
                </span>
                <div className="mt-1 font-serif text-2xl text-ink">{riskLevel}</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-ink uppercase tracking-widest font-semibold">
                  Confidence
                </span>
                <div className="mt-1 font-mono text-lg text-ink font-semibold">
                  {confidence}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[10px] text-ink uppercase tracking-widest font-semibold mb-3 border-b border-border pb-1">
            Next 6 Hours
          </h4>
          <div className="space-y-2">
            {[
              {
                time: "NOW",
                risk: riskLevel,
                color: riskLevel === "HIGH" ? "bg-weather-severe" : riskLevel === "MODERATE" ? "bg-weather-high" : "bg-weather-low",
                text: "text-ink",
              },
              {
                time: "+1H",
                risk: riskLevel,
                color: riskLevel === "HIGH" ? "bg-weather-severe" : riskLevel === "MODERATE" ? "bg-weather-high" : "bg-weather-low",
                text: "text-ink",
              },
              {
                time: "+2H",
                risk: riskLevel === "HIGH" ? "MODERATE" : riskLevel === "MODERATE" ? "LOW" : "LOW",
                color: riskLevel === "HIGH" ? "bg-weather-high" : "bg-weather-low",
                text: "text-ink",
              },
              {
                time: "+3H",
                risk: riskLevel === "HIGH" ? "MODERATE" : riskLevel === "MODERATE" ? "LOW" : "LOW",
                color: riskLevel === "HIGH" ? "bg-weather-high" : "bg-weather-low",
                text: "text-ink",
              },
              {
                time: "+4H",
                risk: "LOW",
                color: "bg-weather-low",
                text: "text-ink",
              },
              {
                time: "+5H",
                risk: "LOW",
                color: "bg-weather-low",
                text: "text-ink",
              },
              {
                time: "+6H",
                risk: "LOW",
                color: "bg-weather-low",
                text: "text-ink",
              },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium w-8">
                  {f.time}
                </span>
                <div className="flex-1 mx-3 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full w-full opacity-80", f.color)}
                  ></div>
                </div>
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold tracking-wider w-14 text-right",
                    f.text,
                  )}
                >
                  {f.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-fog/5 border border-fog/10 rounded-xl p-4">
          <h4 className="font-mono text-[10px] text-ink uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            Why this prediction?
          </h4>
          <ul className="space-y-2 text-sm text-ink leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-fog shrink-0"></span>
              Radar reflectivity is {cityData?.nowcast.trend === 'rising' ? 'increasing rapidly' : 'stable'} in this cell.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-fog shrink-0"></span>
              Lightning activity is {cityData?.nowcast.trend === 'falling' ? 'decreasing' : 'accelerating'}.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-fog shrink-0"></span>
              High atmospheric instability (CAPE {">"} 1800 J/kg) detected.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
