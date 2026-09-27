import React, { useState } from "react";
import { useLocationContext } from "../context/LocationContext";

export function Analytics() {
  const { location, fullData } = useLocationContext();
  const [hoverIndex, setHoverIndex] = useState(4);
  
  const baseProb = fullData.nowcast.thunderstormProbability || 20;
  const getY = (val: number) => 250 - (Math.min(100, Math.max(0, val)) / 100) * 220;
  
  const graphPoints = [
    { x: 60, time: "08:00", label: "Low Activity" },
    { x: 210, time: "10:00", label: "Building" },
    { x: 360, time: "12:00", label: "Increasing" },
    { x: 510, time: "14:00", label: "Rising" },
    { x: 700, time: "16:00 IST", label: "Convective Peak", peak: true },
    { x: 850, time: "18:00", label: "Decreasing" },
    { x: 960, time: "20:00", label: "Subsiding" },
  ].map((pt, i) => {
    const offsets = [-30, -15, 0, 20, 45, 5, -20];
    const forecastOffsets = [-25, -12, 5, 15, 40, 0, -25];
    const obs = Math.max(0, Math.min(100, baseProb + offsets[i]));
    const forecast = Math.max(0, Math.min(100, baseProb + forecastOffsets[i]));
    return {
      ...pt,
      obs,
      forecast,
      obsY: getY(obs),
      forecastY: getY(forecast)
    };
  });

  const createPath = (key: 'obsY' | 'forecastY') => {
    const pts = graphPoints;
    return `M ${pts[0].x},${pts[0][key]} ` +
      `C ${(pts[0].x + pts[1].x)/2},${pts[0][key]} ${(pts[0].x + pts[1].x)/2},${pts[1][key]} ${pts[1].x},${pts[1][key]} ` +
      `C ${(pts[1].x + pts[2].x)/2},${pts[1][key]} ${(pts[1].x + pts[2].x)/2},${pts[2][key]} ${pts[2].x},${pts[2][key]} ` +
      `C ${(pts[2].x + pts[3].x)/2},${pts[2][key]} ${(pts[2].x + pts[3].x)/2},${pts[3][key]} ${pts[3].x},${pts[3][key]} ` +
      `C ${(pts[3].x + pts[4].x)/2},${pts[3][key]} ${(pts[3].x + pts[4].x)/2},${pts[4][key]} ${pts[4].x},${pts[4][key]} ` +
      `C ${(pts[4].x + pts[5].x)/2},${pts[4][key]} ${(pts[4].x + pts[5].x)/2},${pts[5][key]} ${pts[5].x},${pts[5][key]} ` +
      `C ${(pts[5].x + pts[6].x)/2},${pts[5][key]} ${(pts[5].x + pts[6].x)/2},${pts[6][key]} ${pts[6].x},${pts[6][key]}`;
  };

  const modelConfidence = Math.max(70, 95 - fullData.nowcast.lightningProbability * 0.2).toFixed(0);
  const stormDetection = Math.max(60, 85 + fullData.nowcast.highRiskZones * 5 - fullData.nowcast.precipitation * 0.1).toFixed(0);
  const alertPrecision = Math.max(75, 92 - (fullData.nowcast.activeStorms || 0) * 2).toFixed(0);
  const detectionActivity = +(fullData.nowcast.activeStorms * 3 || 12);

  const handleGraphMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const svgX = (x / rect.width) * 1000;
    
    let closestIdx = 0;
    let minDiff = Infinity;
    graphPoints.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoverIndex(closestIdx);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <main className="w-full max-w-[1440px] mx-auto flex-1 flex flex-col gap-6">
        <section
          aria-label="Key Performance Indicators"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4"
        >
          <article className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-black font-medium tracking-wide mb-2">
              <span>MODEL CONFIDENCE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-light tracking-tight text-black drop-shadow-sm">
                {modelConfidence}%
              </span>
              <span className="text-xs text-black font-medium">
                +2.4% vs last cycle
              </span>
            </div>
            <div className="w-full bg-surface-muted/50 h-1.5 rounded-full mt-3 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                style={{ width: `${modelConfidence}%` }}
              ></div>
            </div>
          </article>

          <article className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-black font-medium tracking-wide mb-2">
              <span>STORM DETECTION</span>
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-light tracking-tight text-black drop-shadow-sm">
                {stormDetection}%
              </span>
              <span className="text-xs text-black font-medium">
                High agreement
              </span>
            </div>
            <div className="w-full bg-surface-muted/50 h-1.5 rounded-full mt-3 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-red-600/70 to-red-400 h-full rounded-full"
                style={{ width: `${stormDetection}%` }}
              ></div>
            </div>
          </article>

          <article className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-black font-medium tracking-wide mb-2">
              <span>ALERT PRECISION</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-light tracking-tight text-black drop-shadow-sm">
                {alertPrecision}%
              </span>
              <span className="text-xs text-black font-medium">
                Low false-alarm rate
              </span>
            </div>
            <div className="w-full bg-surface-muted/50 h-1.5 rounded-full mt-3 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full shadow-[0_0_10px_rgba(110,231,183,0.5)]"
                style={{ width: `${alertPrecision}%` }}
              ></div>
            </div>
          </article>

          <article className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs text-black font-medium tracking-wide mb-2">
              <span>DETECTION ACTIVITY</span>
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-light tracking-tight text-black drop-shadow-sm">
                +{detectionActivity}%
              </span>
              <span className="text-xs text-black font-medium">
                Convective surge
              </span>
            </div>
            <div className="w-full bg-surface-muted/50 h-1.5 rounded-full mt-3 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-red-500 to-red-300 h-full rounded-full"
                style={{ width: `${Math.min(100, detectionActivity * 5)}%` }}
              ></div>
            </div>
          </article>
        </section>

        <section
          aria-label="Forecast vs Observed Line Analytics"
          className="glass-panel rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col gap-4 cursor-crosshair relative group"
          onMouseMove={handleGraphMouseMove}
          onMouseLeave={() => setHoverIndex(4)}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-wide text-black uppercase">
                FORECAST VS OBSERVED: {location.name}
              </h2>
              <p className="text-xs text-black">
                Comparative convective probability over diurnal cycle for {location.region || location.state}
              </p>
            </div>

            <div className="flex items-center gap-5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-[2px] bg-white rounded-full inline-block shadow-[0_0_8px_rgba(255,255,255,0.7)]"></span>
                <span className="text-black font-medium">Observed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-[2px] bg-red-400 border-t border-dashed border-red-400 rounded-full inline-block"></span>
                <span className="text-black font-medium">Forecast</span>
              </div>
              <span className="text-black/60 border-l border-border pl-3">
                Timeline: Today
              </span>
            </div>
          </div>

          <div className="relative w-full h-[260px] sm:h-[300px] mt-2">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 1000 300"
            >
              <defs>
                <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="#ef4444"
                    stopOpacity="0.32"
                  ></stop>
                  <stop
                    offset="50%"
                    stopColor="#ef4444"
                    stopOpacity="0.10"
                  ></stop>
                  <stop
                    offset="100%"
                    stopColor="#071917"
                    stopOpacity="0"
                  ></stop>
                </linearGradient>

                <filter
                  height="140%"
                  id="glowWhite"
                  width="140%"
                  x="-20%"
                  y="-20%"
                >
                  <feDropShadow
                    dx="0"
                    dy="0"
                    flood-color="#000000"
                    flood-opacity="0.7"
                    stdDeviation="3"
                  ></feDropShadow>
                </filter>

                <filter
                  height="140%"
                  id="glowred"
                  width="140%"
                  x="-20%"
                  y="-20%"
                >
                  <feDropShadow
                    dx="0"
                    dy="0"
                    flood-color="#ef4444"
                    flood-opacity="0.85"
                    stdDeviation="4"
                  ></feDropShadow>
                </filter>
              </defs>

              <g stroke="var(--color-border)" strokeWidth="1">
                <line
                  strokeDasharray="4 4"
                  x1="45"
                  x2="980"
                  y1="30"
                  y2="30"
                ></line>
                <line
                  strokeDasharray="4 4"
                  x1="45"
                  x2="980"
                  y1="85"
                  y2="85"
                ></line>
                <line
                  strokeDasharray="4 4"
                  x1="45"
                  x2="980"
                  y1="140"
                  y2="140"
                ></line>
                <line
                  strokeDasharray="4 4"
                  x1="45"
                  x2="980"
                  y1="195"
                  y2="195"
                ></line>
                <line x1="45" x2="980" y1="250" y2="250"></line>
              </g>

              <g className="text-[11px] fill-black font-mono" text-anchor="end">
                <text x="35" y="34">
                  100%
                </text>
                <text x="35" y="89">
                  75%
                </text>
                <text x="35" y="144">
                  50%
                </text>
                <text x="35" y="199">
                  25%
                </text>
                <text x="35" y="254">
                  0%
                </text>
              </g>


              <path
                d={createPath('forecastY')}
                fill="none"
                stroke="#ef4444"
                strokeDasharray="5 3"
                strokeWidth="2.5"
              ></path>

              <path
                d={createPath('obsY')}
                fill="none"
                filter="url(#glowWhite)"
                stroke="#000000"
                strokeWidth="2.5"
              ></path>

              <g fill="var(--surface)" stroke="#000000" strokeWidth="2">
                {graphPoints.map((pt, idx) => (
                  <g key={idx}>

                    <circle 
                      cx={pt.x} 
                      cy={pt.obsY} 
                      fill={hoverIndex === idx ? "#000000" : "var(--surface)"}
                      r={hoverIndex === idx ? (pt.peak ? 4 : 4.5) : 3.5}
                      className="transition-all duration-300 ease-out"
                    ></circle>
                  </g>
                ))}
              </g>

              <line
                opacity="0.6"
                stroke="#ef4444"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                x1={graphPoints[hoverIndex].x}
                x2={graphPoints[hoverIndex].x}
                y1="30"
                y2="250"
                className="transition-all duration-300 ease-out"
              ></line>

              <g
                className="text-[11px] fill-black font-mono"
                text-anchor="middle"
              >
                <text x="60" y="278">
                  08:00
                </text>
                <text x="210" y="278">
                  10:00
                </text>
                <text x="360" y="278">
                  12:00
                </text>
                <text x="510" y="278">
                  14:00
                </text>
                <text className="fill-black font-semibold" x="700" y="278">
                  16:00 IST
                </text>
                <text x="850" y="278">
                  18:00
                </text>
                <text x="960" y="278">
                  20:00
                </text>
              </g>
            </svg>

            <div 
              className="absolute top-[18px] -translate-x-1/2 glass-panel px-3 py-2 rounded-xl text-xs border border-red-400/40 shadow-xl pointer-events-none flex flex-col gap-0.5 transition-all duration-300 ease-out z-10 min-w-max"
              style={{ left: `${(graphPoints[hoverIndex].x / 1000) * 100}%` }}
            >
              <div className="text-[10px] uppercase font-bold text-black tracking-wider">
                {graphPoints[hoverIndex].time} · {graphPoints[hoverIndex].label}
              </div>
              <div className="flex items-center gap-3 text-xs text-black mt-0.5">
                <span>
                  Observed:{" "}
                  <strong className="text-black font-semibold">{graphPoints[hoverIndex].obs}%</strong>
                </span>
                <span className="text-black/30">|</span>
                <span>
                  Forecast:{" "}
                  <strong className="text-black font-semibold">{graphPoints[hoverIndex].forecast}%</strong>
                </span>
              </div>
              <div className="text-[10px] text-black/60 font-medium">
                Difference (Δ {graphPoints[hoverIndex].obs - graphPoints[hoverIndex].forecast > 0 ? "+" : ""}{graphPoints[hoverIndex].obs - graphPoints[hoverIndex].forecast}%)
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5 sm:gap-6">
          {/* First Row: Forecast Performance, Event Breakdown, Key Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Forecast Performance */}
            <article className="glass-panel rounded-2xl p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-black">
                    Forecast Performance
                  </h3>
                  <p className="text-xs text-black/70">
                    How well VajraCast predicted thunderstorms
                  </p>
                </div>
                <select className="bg-white/20 border border-white/30 text-black text-[10px] rounded px-2 py-1 outline-none font-medium">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1 mt-2">
                <div className="bg-white/10 rounded-xl p-3 border border-white/20 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] text-black/70 font-medium mb-1">
                    Prediction Accuracy
                  </span>
                  <div className="text-2xl font-light text-black flex items-center gap-1.5">
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    {100 - fullData.nowcast.lightningProbability}%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>{" "}
                    6%
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/20 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] text-black/70 font-medium mb-1">
                    Precision
                  </span>
                  <div className="text-2xl font-light text-black flex items-center gap-1.5">
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                    {85 + fullData.nowcast.highRiskZones}%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>{" "}
                    4%
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/20 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] text-black/70 font-medium mb-1">
                    Recall
                  </span>
                  <div className="text-2xl font-light text-black flex items-center gap-1.5">
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    76%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>{" "}
                    8%
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/20 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] text-black/70 font-medium mb-1">
                    False Alarm Rate
                  </span>
                  <div className="text-2xl font-light text-black flex items-center gap-1.5">
                    <svg
                      className="w-5 h-5 text-rose-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {fullData.nowcast.thunderstormProbability / 2 + 5}%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3 rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>{" "}
                    5%
                  </span>
                </div>
              </div>
            </article>

            {/* Event Breakdown */}
            <article className="glass-panel rounded-2xl p-5 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-sm font-semibold tracking-wide text-black">
                  Event Breakdown
                </h3>
                <p className="text-xs text-black/70">
                  Distribution by intensity
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center gap-6">
                {/* Simple CSS Donut Chart */}
                <div
                  className="relative w-32 h-32 rounded-full border-[16px] border-red-300"
                  style={{
                    borderTopColor: "#dc2626",
                    borderRightColor: "#ef4444",
                    borderBottomColor: "#fcd34d",
                    borderLeftColor: "#38bdf8",
                    transform: "rotate(-45deg)",
                  }}
                >
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-transparent"
                    style={{ transform: "rotate(45deg)" }}
                  >
                    <span className="text-xl font-bold text-black">{fullData.nowcast.precipitation * 3 + fullData.nowcast.humidity}</span>
                    <span className="text-[10px] text-black/70">Events</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded bg-red-600"></span>
                    <span className="text-black font-medium w-14">Severe</span>
                    <span className="text-black/70">24 (8%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
                    <span className="text-black font-medium w-14">
                      Moderate
                    </span>
                    <span className="text-black/70">86 (30%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded bg-red-300"></span>
                    <span className="text-black font-medium w-14">Light</span>
                    <span className="text-black/70">132 (46%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded bg-sky-400"></span>
                    <span className="text-black font-medium w-14">
                      Isolated
                    </span>
                    <span className="text-black/70">42 (15%)</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Key Insights */}
            <article className="glass-panel rounded-2xl p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold tracking-wide text-black">
                  Key Insights
                </h3>
                <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                  AI Analysis
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-rose-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <p className="text-[11px] text-black/80 leading-relaxed pt-0.5">
                    Thunderstorm activity increased by 18% compared to the
                    previous week, with significant activity over {location.name} and surrounding regions.
                  </p>
                </div>
                <div className="w-full h-px bg-white/20"></div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-[11px] text-black/80 leading-relaxed pt-0.5">
                    Lightning flashes were 27% higher, indicating more intense
                    convective activity in central and western India.
                  </p>
                </div>
                <div className="w-full h-px bg-white/20"></div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <p className="text-[11px] text-black/80 leading-relaxed pt-0.5">
                    Ratnagiri (Maharashtra) recorded the highest 24-hour
                    rainfall of 186 mm, associated with a slow-moving storm
                    system.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Second Row: Top Affected Regions */}
          <article className="glass-panel rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-serif tracking-tight text-black">
                  Top Affected Regions
                </h3>
                <p className="text-xs text-black/70 mt-0.5">
                  Regions with highest thunderstorm and lightning activity near {location.state}
                </p>
              </div>
              <div className="flex items-center bg-white/10 p-1 rounded-lg border border-white/20">
                <button className="px-3 py-1 rounded bg-slate-600 text-black text-[11px] font-semibold btn-primary">
                  States
                </button>
                <button className="px-3 py-1 rounded text-black hover:bg-white/20 text-[11px] font-medium transition-colors btn-primary">
                  Districts
                </button>
                <button className="px-3 py-1 rounded text-black hover:bg-white/20 text-[11px] font-medium transition-colors btn-primary">
                  Cities
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/10 text-[10px] text-black/60 font-semibold uppercase tracking-wider border-b border-white/20">
                    <th className="py-3 px-4 w-12 rounded-tl-lg">#</th>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">Current Value</th>
                    <th className="py-3 px-4">Historical Average</th>
                    <th className="py-3 px-4 rounded-tr-lg">Deviation</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-black">
                  {fullData.analytics.historicalComparison.map((item, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                      <td className="py-3 px-4 font-bold">{index + 1}</td>
                      <td className="py-3 px-4">{item.metric}</td>
                      <td className="py-3 px-4">{item.current}</td>
                      <td className="py-3 px-4">{item.average}</td>
                      <td className="py-3 px-4">
                        <span className={item.current > item.average ? "text-rose-600" : "text-emerald-600"}>
                          {item.current > item.average ? "+" : ""}{item.current - item.average}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
