import React, { useState } from "react";
import { KPIStrip } from "../components/dashboard/KPIStrip";
import { WeatherMap } from "../components/map/WeatherMap";
import { MapLegend } from "../components/map/MapLegend";
import { MapControls } from "../components/map/MapControls";
import { ForecastTimeline } from "../components/dashboard/ForecastTimeline";
import { MapSearchBar } from "../components/map/MapSearchBar";
import { LocationPanel } from "../components/dashboard/LocationPanel";
import { StormPanel } from "../components/dashboard/StormPanel";
import { useLocationContext } from "../context/LocationContext";

export function Dashboard() {
  const { location, setLocation } = useLocationContext();
  const [selectedStormId, setSelectedStormId] = useState<string | null>(null);

  const handleLocationClick = (loc: { lat: number; lng: number }) => {
    setSelectedStormId(null);
    setLocation({ name: "Map Location", state: "Custom", coordinates: loc });
  };

  const handleStormClick = (stormId: string) => {
    setSelectedStormId(stormId);
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 p-4 md:p-6 overflow-y-auto custom-scroll">
      <div className="mb-3 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl tracking-tight text-black mb-0.5">
            India Atmospheric Nowcast
          </h1>
          <p className="font-mono text-xs text-black">
            AI-generated thunderstorm and lightning intelligence for the next
            0–6 hours.
          </p>
        </div>
      </div>

      <KPIStrip />

      <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/50 shadow-lg bg-white/20 backdrop-blur-md min-h-[500px] md:min-h-0">
        <WeatherMap
          onLocationClick={handleLocationClick}
          onStormClick={handleStormClick}
          selectedStormId={selectedStormId || undefined}
        />

        {/* Custom Map Controls Layer since react-map-gl doesn't have the styling we want out of the box */}
        <MapSearchBar />
        <MapControls />
        <MapLegend />
        <ForecastTimeline />

        {/* Floating panels based on selection */}
        {(location?.name || (location?.coordinates && location.coordinates.lat !== 0)) && !selectedStormId && (
          <LocationPanel
            location={location}
            onClose={() => setLocation({ name: "", state: "", coordinates: { lat: 0, lng: 0 } })}
          />
        )}

        {selectedStormId && (
          <StormPanel
            stormId={selectedStormId}
            onClose={() => setSelectedStormId(null)}
          />
        )}
      </div>
    </div>
  );
}
