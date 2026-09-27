import React from "react";
import { Layers, Plus, Minus, Crosshair } from "lucide-react";
import { cn } from "../../lib/utils";

export function MapControls() {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      {/* We will let react-map-gl handle zoom controls for MVP via NavigationControl or implement custom ones here if desired.
          But user asked for floating controls that are designed like GIS. */}
      <div className="card flex flex-col overflow-hidden bg-surface/90 backdrop-blur-sm">
        <button className="p-2 text-white hover:text-white hover:bg-surface-muted transition-colors border-b border-border btn-primary">
          <Plus className="w-5 h-5" />
        </button>
        <button className="p-2 text-white hover:text-white hover:bg-surface-muted transition-colors border-b border-border btn-primary">
          <Minus className="w-5 h-5" />
        </button>
        <button className="p-2 text-white hover:text-white hover:bg-surface-muted transition-colors border-b border-border btn-primary">
          <Crosshair className="w-5 h-5" />
        </button>
        <button className="p-2 text-white hover:text-white hover:bg-surface-muted transition-colors group relative btn-primary">
          <Layers className="w-5 h-5" />
          <div className="absolute right-full top-0 mr-2 bg-surface border border-border shadow-md rounded-lg p-3 hidden group-hover:block w-48 animate-in fade-in slide-in-from-right-2">
            <h4 className="font-mono text-[10px] font-semibold text-white tracking-widest uppercase mb-2">
              Layers
            </h4>
            <div className="space-y-2">
              {["Radar", "Satellite", "Lightning", "Storm Cells", "Risk"].map(
                (layer, i) => (
                  <label
                    key={layer}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={i > 1}
                      className="rounded border-border text-white focus:ring-fog"
                    />
                    <span className="text-white">{layer}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
