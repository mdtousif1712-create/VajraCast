import React from "react";
import { X, Activity, TrendingUp, Navigation } from "lucide-react";
import { useStorms } from "../../services/api";
import { cn } from "../../lib/utils";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { useLocationContext } from "../../context/LocationContext";

interface StormPanelProps {
  stormId: string | null;
  onClose: () => void;
}

// Removed hardcoded mockChartData

export function StormPanel({ stormId, onClose }: StormPanelProps) {
  const { location } = useLocationContext();
  const { data: activeStorms, isLoading } = useStorms(location);

  if (!stormId || isLoading || !activeStorms) return null;

  const storm = activeStorms.find((s) => s.id === stormId);
  if (!storm) return null;

  const chartData = [
    { time: "T-40", val: Math.max(0, storm.reflectivity - 20) },
    { time: "T-30", val: Math.max(0, storm.reflectivity - 15) },
    { time: "T-20", val: Math.max(0, storm.reflectivity - 10) },
    { time: "T-10", val: Math.max(0, storm.reflectivity - 5) },
    { time: "Now", val: storm.reflectivity },
  ];

  return (
    <div className="absolute top-4 left-4 right-4 md:left-auto md:w-[340px] glass-panel shadow-lg flex flex-col z-10 max-h-[calc(100%-6rem)] overflow-y-auto animate-in slide-in-from-right-4">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-20">
        <div>
          <h3 className="font-mono text-[10px] text-white uppercase tracking-widest font-semibold">
            Storm Cell
          </h3>
          <p className="font-serif text-xl tracking-tight text-white">
            {storm.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-surface-muted rounded-full text-white hover:text-white transition-colors btn-primary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3 bg-surface-muted/50 p-3 rounded-xl border border-border/50">
          <div className="w-10 h-10 rounded-full bg-weather-severe/20 flex items-center justify-center border border-weather-severe/30 shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">{storm.location}</span>
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-white px-1.5 py-0.5 bg-weather-severe/10 rounded">
                {storm.risk} RISK
              </span>
            </div>
            <div className="font-mono text-xs text-white mt-0.5">
              Confidence: {storm.confidence}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-mono text-[10px] text-white uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-3 h-3" /> Intensity
            </span>
            <div className="font-medium text-white mt-1">{storm.intensity}</div>
          </div>
          <div>
            <span className="font-mono text-[10px] text-white uppercase tracking-widest flex items-center gap-1">
              <Navigation className="w-3 h-3" /> Movement
            </span>
            <div className="font-medium text-white mt-1">
              {storm.movement} @ {storm.speed} km/h
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] text-white uppercase tracking-widest">
              Max Reflectivity
            </span>
            <div className="font-medium text-white mt-1 font-mono">
              {storm.reflectivity} dBZ
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] text-white uppercase tracking-widest">
              Lightning Rate
            </span>
            <div className="font-medium text-white mt-1 font-mono">
              {storm.lightningRate} /min
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[10px] text-white uppercase tracking-widest font-semibold mb-2 flex items-center justify-between">
            <span>Reflectivity Trend</span>
            <span className="text-white flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{storm.growth}%
            </span>
          </h4>
          <div className="h-24 w-full bg-surface-muted/30 rounded-lg border border-border/50 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="var(--fog)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "var(--surface)",
                    stroke: "var(--fog)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
