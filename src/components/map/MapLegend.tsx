import React from "react";

export function MapLegend() {
  return (
    <div className="absolute bottom-6 left-6 card p-3 flex flex-col gap-3 z-10 bg-surface/90 backdrop-blur-sm max-w-[200px]">
      <div>
        <span className="font-mono text-[9px] text-ink uppercase tracking-widest font-semibold block mb-1">
          Thunderstorm Probability
        </span>
        <div className="flex justify-between text-[10px] font-mono text-ink mb-1">
          <span>LOW</span>
          <span>HIGH</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-weather-low via-weather-moderate to-weather-severe"></div>
      </div>

      <div className="space-y-1.5 border-t border-border/50 pt-2">
        <div className="flex items-center gap-2 text-xs text-ink">
          <div className="w-2 h-2 rounded-full bg-weather-high animate-pulse"></div>
          Lightning
        </div>
        <div className="flex items-center gap-2 text-xs text-ink">
          <div className="w-3 h-3 rounded-full border-2 border-ink"></div>
          Storm Cell
        </div>
        <div className="flex items-center gap-2 text-xs text-ink">
          <div className="w-3 h-0.5 bg-ink"></div>
          Storm Track
        </div>
      </div>
    </div>
  );
}
