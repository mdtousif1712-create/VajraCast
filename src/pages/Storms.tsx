import React from "react";
import { DEMO_DATA } from "../data/demoData";
import Map, { Marker, Source, Layer } from "react-map-gl/maplibre";

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
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
      source: "osm",
      paint: {
        "raster-saturation": -0.1,
        "raster-contrast": 0.1,
        "raster-brightness-min": 0.3,
        "raster-brightness-max": 0.9,
      },
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};
import { cn } from "../lib/utils";
import { useLocationContext } from "../context/LocationContext";
import { useStorms } from "../services/api";

export function Storms() {
  const { location, setLocation, stormsData } = useLocationContext();
  const [selectedStormId, setSelectedStormId] = React.useState<string | null>(null);

  const activeStorms = stormsData;
  const selectedStorm = activeStorms.find(s => s.id === selectedStormId) || activeStorms[0];

  const handleStormClick = (storm: typeof activeStorms[0]) => {
    setSelectedStormId(storm.id);
    
    // Also update global location to this storm's location
    const matchedData = DEMO_DATA[storm.locationId as keyof typeof DEMO_DATA];
    if (matchedData) {
      setLocation({
        name: matchedData.location.name,
        state: matchedData.location.region || "Region",
        coordinates: { lat: matchedData.location.coords[0], lng: matchedData.location.coords[1] }
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-y-auto p-6 space-y-6 text-black relative z-10">
      {/*  BEGIN: Desktop Application Window  */}
      <div className="relative w-full max-w-[1440px] h-auto min-h-[900px] lg:h-[900px] rounded-3xl storm-atmosphere border border-white/30/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between p-4 md:p-8">
        {/*  Atmospheric Layer Overlays  */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-black/40"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        {/*  BEGIN: Top Bar & Global Header  */}

        {/*  END: Top Bar & Global Header  */}
        {/*  BEGIN: Main Workspace (3-Zone Balanced Composition)  */}
        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto h-auto lg:h-[740px] items-stretch">
          {/*  ================= ZONE 1: ACTIVE CELLS DECK (~28% / 3.4 cols -> col-span-3 or 4) =================  */}
          <section
            className="col-span-1 lg:col-span-3 flex flex-col justify-between py-1 h-[400px] lg:h-auto"
            data-purpose="active-cells-list"
          >
            {/*  Deck Header & Filter Pills  */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-black">
                    ACTIVE CELLS
                  </span>
                  <span
                    className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.07] text-red-300"
                    id="cell-count-badge"
                  >
                    {activeStorms?.length || 0}
                  </span>
                </div>
              </div>
              {/*  Minimalist Filter Pills  */}
              <div className="flex items-center gap-1.5 p-1 mb-4 rounded-xl bg-white/[0.03] border border-white/30/[0.06] backdrop-blur-md text-xs font-medium">
                <button
                  className="flex-1 py-1 px-2.5 rounded-lg text-center bg-white/40 shadow-sm text-black transition-all btn-primary"
                  id="filter-all"
                >
                  ALL
                </button>
                <button
                  className="flex-1 py-1 px-2.5 rounded-lg text-center text-black/70 hover:bg-white/20 hover:text-black transition-all btn-primary"
                  id="filter-high"
                >
                  HIGH RISK
                </button>
                <button
                  className="flex-1 py-1 px-2.5 rounded-lg text-center text-black/70 hover:bg-white/20 hover:text-black transition-all btn-primary"
                  id="filter-intensifying"
                >
                  INTENSIFYING
                </button>
              </div>
            </div>
            {/*  4 Compact Cells Cards  */}
            <div
              className="flex flex-col gap-3 overflow-y-auto custom-scroll pr-1 flex-1 max-h-[620px]"
              id="cell-cards-container"
            >
              {(!activeStorms || activeStorms.length === 0) ? (
                <div className="p-4 text-center text-black/60 text-sm font-medium">
                  No active storm cells detected in this region.
                </div>
              ) : (
                activeStorms.map((storm) => (
                  <article
                    key={storm.id}
                    onClick={() => handleStormClick(storm)}
                    className={cn(
                      "storm-card cursor-pointer p-4 rounded-2xl glass-panel transition-all duration-200 relative",
                      selectedStorm?.id === storm.id 
                        ? "active border-2 border-red-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] group" 
                        : "opacity-80 hover:opacity-100 hover:border-red-400/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-black tracking-tight">
                            {storm.id}
                          </span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-semibold border",
                            storm.risk === "High" || storm.risk === "Severe" 
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-slate-500/20 text-black border-slate-500/30"
                          )}>
                            {storm.risk.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-black mt-0.5">
                          {storm.location} Region
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-black">
                        {storm.reflectivity} dBZ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-black pt-2 border-t border-white/30/[0.06]">
                      <span className="flex items-center gap-1.5 text-black font-medium">
                        <svg className="w-3.5 h-3.5 text-red-400 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        {storm.movement} · {storm.speed} km/h
                      </span>
                      <span className="text-[11px] font-semibold text-red-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                        ACTIVE
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
          {/*  ================= ZONE 2: ABSTRACT SCIENTIFIC STORM CORE VISUALIZATION (~42% / 5 cols) =================  */}
          <section
            className="col-span-1 lg:col-span-5 relative flex flex-col items-center justify-center rounded-3xl glass-panel overflow-hidden h-[400px] lg:h-auto"
            data-purpose="scientific-storm-visualization"
          >
            <Map
              initialViewState={{
                longitude: location.coordinates.lng,
                latitude: location.coordinates.lat,
                zoom: 9,
                pitch: 0,
                bearing: 0,
              }}
              mapStyle={MAP_STYLE as any}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
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

              {selectedStorm && (
                <Marker longitude={selectedStorm.coordinates[0]} latitude={selectedStorm.coordinates[1]}>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/40 via-red-600/30 to-transparent blur-xl animate-pulse-slow w-48 h-48 -ml-24 -mt-24 pointer-events-none"></div>
                    <div className="absolute w-32 h-32 -ml-16 -mt-16 rounded-full border border-red-500/40 bg-red-600/10 backdrop-blur-[1px] animate-spin-slow pointer-events-none"></div>
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center group cursor-crosshair -ml-7 -mt-7">
                      <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-1 border border-red-300/40">
                        <span className="text-[8px] font-mono font-extrabold text-red-600 tracking-tight">
                          {selectedStorm.id}
                        </span>
                        <span className="text-sm font-black text-black leading-none">
                          {selectedStorm.reflectivity}
                        </span>
                      </div>
                    </div>
                  </div>
                </Marker>
              )}
            </Map>

            {/* Micro Convective Particle Indicators */}
            <div className="absolute bottom-24 left-6 flex items-center gap-2 text-[11px] font-mono text-black bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 z-10 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              DUAL-POL: ZDR 2.4 dB · KDP 1.8 °/km
            </div>

            {/* Intensity Scale Bar at the Bottom */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1.5 z-10 bg-white/40 backdrop-blur-md p-3.5 rounded-xl border border-white/50 shadow-sm">
              <div className="flex justify-between text-[11px] font-mono text-black font-medium">
                <span>Weak (20 dBZ)</span>
                <span className="text-red-800 font-bold">Severe (54 dBZ)</span>
                <span>Extreme (65+ dBZ)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/20 relative overflow-hidden p-0.5 border border-white/30">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-red-400 to-rose-600 w-3/4"></div>
                <div className="absolute top-0 bottom-0 left-[72%] w-1 bg-white shadow-[0_0_6px_#ffffff]"></div>
              </div>
            </div>
          </section>
          {/*  ================= ZONE 3: COMPACT SELECTED STORM DETAILS & AI INSIGHT (~30% / 4 cols) =================  */}
          <section
            className="col-span-1 lg:col-span-4 flex flex-col justify-between h-auto lg:h-auto"
            data-purpose="storm-cell-details-panel"
          >
            <div className="glass-panel h-full rounded-3xl p-6 flex flex-col justify-between">
              {selectedStorm ? (
                <>
                  {/*  Top: Cell Header & Risk Badge  */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono text-red-400 tracking-wider">
                          SELECTED TARGET
                        </span>
                        <h2
                          className="text-2xl font-black text-black tracking-tight mt-0.5"
                          id="detail-cell-id"
                        >
                          STORM CELL {selectedStorm.id}
                        </h2>
                        <p
                          className="text-xs text-black mt-1"
                          id="detail-cell-region"
                        >
                          {selectedStorm.location} Metropolitan Region
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-red-500/20 text-red-300 border border-red-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        id="detail-cell-risk"
                      >
                        {selectedStorm.risk.toUpperCase()}
                      </span>
                    </div>
                    {/*  4-Stat Metric Grid (2x2)  */}
                    <div className="grid grid-cols-2 gap-3 mt-5">
                      {/*  Stat 1: Intensity  */}
                      <div className="glass-panel rounded-xl p-3">
                        <span className="text-[11px] uppercase tracking-wider text-black block mb-1">
                          INTENSITY
                        </span>
                        <span className="text-base font-bold text-black block">
                          {selectedStorm.intensity}{" "}
                          <span className="text-red-400 font-mono text-sm">
                            ({selectedStorm.reflectivity} dBZ)
                          </span>
                        </span>
                      </div>
                      {/*  Stat 2: Movement  */}
                      <div className="glass-panel rounded-xl p-3">
                        <span className="text-[11px] uppercase tracking-wider text-black block mb-1">
                          MOVEMENT
                        </span>
                        <span className="text-base font-bold text-black flex items-center gap-1">
                          {selectedStorm.movement} · {selectedStorm.speed} km/h
                        </span>
                      </div>
                      {/*  Stat 3: Lightning Rate & Sparkline  */}
                      <div className="glass-panel rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-wider text-black">
                            LIGHTNING RATE
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-bold text-red-300 font-mono">
                            +{selectedStorm.lightningRate}{" "}
                            <span className="text-xs text-black font-normal">
                              fl/min
                            </span>
                          </span>
                          {/*  Mini SVG sparkline  */}
                          <svg
                            className="w-12 h-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 48 20"
                          >
                            <path
                              d="M2 16 L12 14 L22 18 L32 8 L40 10 L46 2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      {/*  Stat 4: AI Confidence  */}
                      <div className="glass-panel rounded-xl p-3">
                        <span className="text-[11px] uppercase tracking-wider text-black block mb-1">
                          AI CONFIDENCE
                        </span>
                        <span className="text-base font-bold text-emerald-400 font-mono">
                          {selectedStorm.confidence}%{" "}
                          <span className="text-xs text-black font-normal">
                            (High)
                          </span>
                        </span>
                      </div>
                    </div>
                    {/*  Probability Gauges  */}
                    <div className="mt-5 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-black font-medium">
                            Severe Thunderstorm (60m)
                          </span>
                          <span className="font-mono font-bold text-red-400">
                            78%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.07] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: "78%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-black font-medium">
                            Lightning Discharge Corridor
                          </span>
                          <span className="font-mono font-bold text-red-400">
                            64%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.07] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: "64%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {/*  AI Nowcast Insight Callout Box  */}
                    <div className="glass-panel mt-5 p-3.5 rounded-xl text-xs text-black leading-relaxed relative">
                      <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1 tracking-wide">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                        AI NOWCAST INSIGHT
                      </div>
                      <p className="">
                        Storm cell {selectedStorm.id} is undergoing rapid convective
                        intensification near {selectedStorm.location}. Updraft velocity and
                        dual-pol radar signatures indicate peak hail and lightning
                        potential between{" "}
                        <span className="text-red-200 font-semibold font-mono">
                          20:15 and 20:45 IST
                        </span>
                        . Confidence {selectedStorm.confidence}%.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-black/50 text-sm font-medium">
                  Select a storm cell to view detailed analysis.
                </div>
              )}
              {/*  Bottom Action Buttons  */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/30/[0.08]">
                <button className="flex-1 py-3 px-4 rounded-xl glass-panel !bg-red-400/50 border border-red-400/80 hover:!bg-red-400/70 text-black font-bold text-xs tracking-wide shadow-sm transition active:scale-98 text-center btn-primary">
                  Track in Nowcast Map
                </button>
                <button className="py-3 px-4 rounded-xl glass-panel hover:bg-white/40 text-black font-medium text-xs tracking-wide transition active:scale-98 btn-primary">
                  Set Corridor Alert
                </button>
              </div>
            </div>
          </section>
        </main>
        {/*  END: Main Workspace  */}
        {/*  BEGIN: Footer Telemetry Strip  */}

        {/*  END: Footer Telemetry Strip  */}
      </div>
      {/*  END: Desktop Application Window  */}
      {/*  BEGIN: Interactive Cell Selection Script  */}

      {/*  END: Interactive Cell Selection Script  */}
    </div>
  );
}
