import React, { useState } from 'react';
import { CloudLightning } from 'lucide-react';
import { GlobeWeather } from '../components/ui/cobe-globe-weather';
import { useLocationContext } from '../context/LocationContext';
import { DEMO_DATA } from '../data/demoData';

export function Home() {
  const [hoverIndex, setHoverIndex] = useState(3);
  const { location } = useLocationContext();

  let cityData = DEMO_DATA['bengaluru'];
  if (location && location.name) {
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

  const graphPoints = [
    { x: 50, y: 74 },
    { x: 150, y: 60 },
    { x: 250, y: 72 },
    { x: 350, y: 28 },
    { x: 450, y: 54 },
    { x: 550, y: 58 }
  ];

  const handleGraphMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const svgX = (x / rect.width) * 600;
    
    // Find closest point
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
    <div className="w-full h-full min-h-full text-slate-100 font-['Plus_Jakarta_Sans']">
      
<main className="w-full h-full min-h-full relative overflow-y-auto overflow-x-hidden md:overflow-hidden flex flex-col md:flex-row p-4 md:p-7 gap-4 md:gap-7 selection:bg-emerald-600 selection:text-white" data-purpose="weather-dashboard">

<aside className="w-full md:w-[285px] h-auto md:h-full flex flex-col justify-between shrink-0 glass-card rounded-[30px] p-5 relative z-20" data-purpose="sidebar-controls">

<div className="flex flex-col items-center pt-2">
<h1 className="text-3xl font-medium tracking-tight text-white flex items-center gap-2">
          <CloudLightning className="w-8 h-8 shrink-0 text-white" />
          VajraCast
        </h1>
</div>

<div className="mt-4 flex flex-col gap-2">
<span className="text-xs text-neutral-300 font-medium tracking-wider pl-1">Status</span>
<div className="glass-subcard rounded-2xl p-4 relative overflow-hidden group">
<div className="flex justify-between items-center text-xs text-neutral-400">
<span className="text-white/90 font-medium flex items-center gap-0.5">
<span className="text-emerald-400 text-xs">{cityData.nowcast.trend === 'rising' ? '↑' : cityData.nowcast.trend === 'falling' ? '↓' : '→'}</span> {cityData.nowcast.thunderstormProbability}%
            </span>

<button className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-neutral-400 hover:text-white transition-colors" title="Status details">
              ?
            </button>
</div>

<div className="relative h-20 w-full mt-2">

<svg className="w-full h-full overflow-visible" viewBox="0 0 180 70">
<defs>
<linearGradient id="curveGradient" x1="0%" x2="100%" y1="100%" y2="0%">
<stop offset="0%" stopColor="#38bdf8"></stop>
<stop offset="65%" stopColor="#34d399"></stop>
<stop offset="100%" stopColor="#fb923c"></stop>
</linearGradient>
</defs>
<path d="M 5 58 C 45 56, 100 52, 160 12" fill="none" stroke="url(#curveGradient)" strokeLinecap="round" strokeWidth="3"></path>

<circle className="filter drop-shadow" cx="140" cy="23" fill="#ffffff" r="3.5"></circle>
</svg>

<div className="absolute top-1 left-4 bg-white text-neutral-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              {cityData.nowcast.highRiskZones > 0 ? "Dangerous" : cityData.nowcast.activeStorms > 0 ? "Caution" : "Safe"}
              <span className="absolute -bottom-1 right-3.5 w-2 h-2 bg-white rotate-45 transform"></span>
</div>
</div>
</div>

<a className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors flex items-center justify-center gap-1 mt-2 font-normal" href="/dashboard">
          See More details <span className="text-xs text-neutral-500">›</span>
</a>
</div>

<div className="mt-4 flex flex-col items-center">


<div className="relative w-44 h-44 my-1 flex items-center justify-center pointer-events-none">
  <GlobeWeather />
</div>

<button className="w-full mt-3 py-2.5 px-4 rounded-full bg-neutral-900/80 hover:bg-neutral-900 border border-white/10 text-xs font-normal text-neutral-300 tracking-wide text-center transition-all">
          {cityData.location.name}
        </button>
</div>
</aside>


<div className="flex-1 flex flex-col justify-between pl-1 md:pl-3 pr-1 py-1 relative z-10 min-w-0" data-purpose="weather-main-view">

<div className="flex flex-col md:flex-row justify-between items-start">

<div className="flex flex-col">



<div className="flex items-start gap-4">
<h2 className="text-7xl lg:text-8xl font-light tracking-tighter text-white select-none leading-none">
              {cityData.nowcast.temperature}°
            </h2>
<div className="glass-subcard px-2.5 py-1.5 rounded-xl border border-white/10 text-[11px] flex flex-col gap-0.5 text-neutral-300 mt-2">
<div className="flex items-center gap-1.5">
<span className="text-neutral-400 font-medium">H</span>
<span className="font-medium text-white">{cityData.nowcast.temperature + Math.floor(Math.random() * 5 + 2)}°</span>
</div>
<div className="flex items-center gap-1.5">
<span className="text-neutral-400 font-medium">L</span>
<span className="font-medium text-neutral-300">{cityData.nowcast.temperature - Math.floor(Math.random() * 5 + 2)}°</span>
</div>
</div>
</div>

<div className="mt-8">
<h3 className="text-4xl lg:text-5xl text-white font-normal tracking-tight leading-tight drop-shadow-sm capitalize">
              {cityData.nowcast.condition.split(' ').map((word, i, arr) => i === 0 ? word : (i === arr.length - 1 ? 'with ' + word : word)).join(' ')}<br />
              {cityData.nowcast.trend === 'rising' ? 'conditions worsening' : cityData.nowcast.trend === 'falling' ? 'conditions improving' : 'steady conditions'}
            </h3>
</div>
</div>

<div className="w-full md:w-[370px] mt-6 md:mt-0 flex flex-col md:items-end">





<div className="w-full flex flex-col mt-3">


<div className="flex flex-col gap-3.5">
  <div className="recently-searched-glass rounded-[22px] p-4 flex flex-col justify-between h-[150px] hover:border-white/30 transition-all group cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)] group-hover:scale-105 transition-transform">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
          <path d="M19 14.5a3.5 3.5 0 0 0-3.5-3.5 4 4 0 0 0-7.8-1 3.5 3.5 0 0 0-1.7 6.5" stroke="rgba(255,255,255,0.9)" strokeLinecap="round"></path>
          <path d="M13 13l-3 4h3.5L10.5 22" stroke="#fb923c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></path>
        </svg>
      </div>
      <span className="text-5xl font-light text-white tracking-tight">{Math.floor(cityData.nowcast.thunderstormProbability * 2.5)}</span>
    </div>
    <div className="mt-2">
      <div className="text-base font-medium text-white tracking-tight truncate">Thunderstorm</div>
      <div className="text-sm text-neutral-300/80 font-light mt-0.5 truncate">Last 24 hours</div>
    </div>
  </div>

  <div className="recently-searched-glass rounded-[22px] p-4 flex flex-col justify-between h-[150px] hover:border-white/30 transition-all group cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="text-sky-300/80 group-hover:scale-105 transition-transform">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
          <path d="M17 15a4 4 0 10-6.9-3.2A3.5 3.5 0 006 14a3 3 0 003 3h8z" strokeLinecap="round"></path>
          <path d="M8 19l-1 2m5-2l-1 2m5-2l-1 2" strokeLinecap="round"></path>
        </svg>
      </div>
      <span className="text-5xl font-light text-white tracking-tight">{Math.floor(cityData.nowcast.lightningProbability * 8.5)}</span>
    </div>
    <div className="mt-2">
      <div className="text-base font-medium text-white tracking-tight truncate">Lightning storm</div>
      <div className="text-sm text-neutral-300/80 font-light mt-0.5 truncate">Total strikes</div>
    </div>
  </div>
</div>
</div>
</div>
</div>

<section className="w-full relative mb-4 pt-2 pb-2 cursor-crosshair group" data-purpose="weekly-forecast-timeline" onMouseMove={handleGraphMouseMove} onMouseLeave={() => setHoverIndex(3)}>

<div className="grid grid-cols-6 text-center text-xs font-normal mb-2 z-10 relative items-end">

<div className="flex flex-col items-center gap-1.5">
<svg className="w-5 h-5 text-neutral-400 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
<path d="M17 16a4 4 0 10-6.9-3.2A3.5 3.5 0 006 15a3 3 0 003 3h8z" strokeLinecap="round"></path>
<path d="M12 4v1m0 14v1M4 12H3m18 0h-1" strokeLinecap="round"></path>
</svg>
<span className="text-neutral-400">10 AM</span>
</div>

<div className="flex flex-col items-center gap-1.5">
<svg className="w-5 h-5 text-neutral-400 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
<span className="text-neutral-400">11 AM</span>
</div>

<div className="flex flex-col items-center gap-1.5">
<svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
<path d="M19 14.5a3.5 3.5 0 0 0-3.5-3.5 4 4 0 0 0-7.8-1 3.5 3.5 0 0 0-1.7 6.5" strokeLinecap="round"></path>
<path d="M13 13l-2.5 3.5h3L11 21" stroke="#f59e0b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
<span className="text-neutral-400">12 PM</span>
</div>

<div className="flex flex-col items-center gap-1.5">
<svg className="w-5 h-5 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)] group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
<path d="M19 14.5a3.5 3.5 0 0 0-3.5-3.5 4 4 0 0 0-7.8-1 3.5 3.5 0 0 0-1.7 6.5" stroke="rgba(255,255,255,0.9)" strokeLinecap="round"></path>
<path d="M13 13l-3 4h3.5L10.5 22" stroke="#fb923c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></path>
</svg>
<span className="text-white font-medium drop-shadow-sm">1 PM</span>
</div>

<div className="flex flex-col items-center gap-1.5">
<svg className="w-5 h-5 text-sky-300/80" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
<path d="M17 15a4 4 0 10-6.9-3.2A3.5 3.5 0 006 14a3 3 0 003 3h8z" strokeLinecap="round"></path>
<path d="M8 19l-1 2m5-2l-1 2m5-2l-1 2" strokeLinecap="round"></path>
</svg>
<span className="text-neutral-400">2 PM</span>
</div>

<div className="flex flex-col items-center gap-1.5">
<svg className="w-5 h-5 text-neutral-400 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" strokeLinecap="round"></path>
</svg>
<span className="text-neutral-400">3 PM</span>
</div>
</div>

<div className="relative h-24 w-full flex items-center">
<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 100">

<line stroke="rgba(255,255,255,0.45)" strokeDasharray="3,3" strokeWidth="1.2" x1={graphPoints[hoverIndex].x} x2={graphPoints[hoverIndex].x} y1={graphPoints[hoverIndex].y} y2="100" className="transition-all duration-300 ease-out"></line>

<path d="M 0 74 C 50 74, 80 68, 100 66 C 130 63, 170 58, 200 64 C 230 70, 260 74, 290 73 C 320 72, 335 44, 350 28 C 370 10, 420 16, 445 42 C 470 66, 520 64, 600 50" fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeLinecap="round" strokeWidth="2"></path>
</svg>

<div 
  className="absolute flex items-center justify-center pointer-events-none transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 group-hover:scale-125"
  style={{ left: `${(graphPoints[hoverIndex].x / 600) * 100}%`, top: `${graphPoints[hoverIndex].y}%` }}
>

<div className="w-10 h-10 rounded-full bg-emerald-300/30 blur-md absolute"></div>

<div className="w-5 h-5 rounded-full bg-white/50 blur-xs absolute"></div>

<div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] relative z-10"></div>
</div>
</div>

<div className="grid grid-cols-6 text-center text-xl lg:text-2xl font-light tracking-tight mt-3 items-center">
  {[
    `${cityData.nowcast.temperature - 2}°`, 
    `${cityData.nowcast.temperature - 1}°`, 
    `${cityData.nowcast.temperature}°`, 
    `${cityData.nowcast.temperature + 1}°`, 
    `${cityData.nowcast.temperature}°`, 
    `${cityData.nowcast.temperature - 1}°`
  ].map((temp, idx) => (
    <span 
      key={idx} 
      className={
        hoverIndex === idx 
          ? "text-white font-medium text-2xl lg:text-3xl -mt-1 drop-shadow-sm transition-all duration-300 ease-out scale-110" 
          : "text-neutral-400 transition-all duration-300 ease-out"
      }
    >
      {temp}
    </span>
  ))}
</div>
</section>

</div>

</main>


    </div>
  );
}
