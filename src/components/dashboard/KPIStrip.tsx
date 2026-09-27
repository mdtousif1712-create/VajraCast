import React from "react";
import { useMetrics } from "../../services/api";

import { useLocationContext } from "../../context/LocationContext";

export function KPIStrip() {
  const { location } = useLocationContext();
  const { data: globalMetrics, isLoading } = useMetrics(location);

  if (isLoading || !globalMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 card px-4 py-2.5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div className="card px-4 py-2.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-black uppercase tracking-widest font-semibold">
          Active Storm Cells
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-serif text-2xl text-black">
            {globalMetrics.activeStorms < 10
              ? `0${globalMetrics.activeStorms}`
              : globalMetrics.activeStorms}
          </span>
          <span className="font-mono text-[9px] text-black bg-moss/10 px-1.5 py-0.5 rounded flex items-center">
            ↑ {globalMetrics.stormsIncrease} since 10:00
          </span>
        </div>
      </div>

      <div className="card px-4 py-2.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-black uppercase tracking-widest font-semibold">
          Active Thunderstorm
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-serif text-2xl text-black">
            {globalMetrics.thunderstormProbability}%
          </span>
        </div>
      </div>

      <div className="card px-4 py-2.5 flex flex-col justify-between">
        <span className="font-mono text-[10px] text-black uppercase tracking-widest font-semibold">
          Active Lightning
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-serif text-2xl text-black">
            {globalMetrics.lightningProbability}%
          </span>
        </div>
      </div>

      <div className="card px-4 py-2.5 flex flex-col justify-between border-l-4 border-weather-severe">
        <span className="font-mono text-[10px] text-black uppercase tracking-widest font-semibold">
          High-Risk Zones
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-serif text-2xl text-black">
            {globalMetrics.highRiskZones < 10
              ? `0${globalMetrics.highRiskZones}`
              : globalMetrics.highRiskZones}
          </span>
        </div>
      </div>
    </div>
  );
}
