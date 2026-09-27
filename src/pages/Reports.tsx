import React, { useState, useRef } from "react";
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  Search,
  Download,
  FileText,
  Image as ImageIcon,
  FileCode2,
  CloudLightning,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Cloud,
  Zap,
  CloudRain,
  Wind,
  Car,
  Plane,
  PersonStanding,
  ZapOff,
  Wifi,
  TreePine,
  Building2,
  Waves,
  Home,
  Info,
  Heart,
  HardHat,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLocationContext } from "../context/LocationContext";
import { useMetrics, useAIExplanation } from "../services/api";

export function Reports() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { location, fullData } = useLocationContext();
  const metrics = fullData.nowcast;
  const { data: aiData, isLoading: isAiLoading } = useAIExplanation(location, fullData);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloadOpen(false);
    setIsGenerating(true);
    
    try {
      const imgData = await htmlToImage.toJpeg(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#e6ebef',
        cacheBust: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // Calculate aspect ratio height
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`VajraCast_Report_${location.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try downloading as Markdown.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    setDownloadOpen(false);
    setIsGenerating(true);
    
    try {
      const imgData = await htmlToImage.toPng(reportRef.current, {
        pixelRatio: 2,
        backgroundColor: '#e6ebef',
        cacheBust: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      
      const link = document.createElement('a');
      link.download = `VajraCast_Report_${location.name.replace(/\s+/g, '_')}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating Image:", err);
      alert("Failed to generate Image. Please try downloading as Markdown.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    setDownloadOpen(false);
    
    const mdContent = `# VajraCast Report: ${location.name}
**Location:** ${location.name}, ${location.state} (${location.coordinates.lat.toFixed(4)}° N, ${location.coordinates.lng.toFixed(4)}° E)
**Report Period:** Next 6 Hours (10:42 AM - 04:42 PM IST)
**Model Confidence:** 84%

## AI Summary
${aiData?.explanation || "No summary available."}

## Current Conditions
- Thunderstorm Probability: ${metrics?.thunderstormProbability ?? "--"}%
- Lightning Probability: ${metrics?.lightningProbability ?? "--"}%
- Expected Rainfall: ${metrics?.precipitation != null ? metrics.precipitation + " mm/h" : "--"}
- Wind (Surface): ${metrics?.windSpeed || "--"} km/h

## Timeline (Next 6 Hours)
- Now: High
- +30 min: High
- +1 hour: High
- +2 hours: Moderate
- +3 hours: Moderate
- +6 hours: Low
`;
    
    try {
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `VajraCast_Report_${location.name.replace(/\s+/g, '_')}.md`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating Markdown:", err);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scroll relative">
      <div ref={reportRef} className="max-w-[1400px] mx-auto space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between glass-panel p-5 rounded-2xl border border-white/20 relative z-[100] gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl font-serif text-black tracking-tight">
              AI Report
            </h1>
            <p className="text-sm text-black/70 font-medium mt-1">
              Detailed AI-generated analysis, ML based impacts and recommendations for
              your selected location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
              <input
                type="text"
                readOnly
                value={`${location.name}, ${location.state}`}
                className="pl-9 pr-10 py-2.5 bg-white/60 border border-white/50 rounded-xl text-sm font-medium text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-black/10 w-full sm:w-64"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setDownloadOpen(!downloadOpen)}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/60 hover:bg-white/80 border border-white/50 rounded-xl text-sm font-bold text-black transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-black/80" />
                {isGenerating ? "Generating..." : "Download Report"}
                <ChevronDown className="w-4 h-4 text-black/80 ml-1" />
              </button>

              {downloadOpen && (
                <div className="absolute top-full right-0 left-0 sm:left-auto mt-2 w-full sm:w-56 bg-[#f7f7f2] border border-black/10 rounded-xl p-1.5 shadow-xl z-[999]">
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-black hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 text-rose-600" />
                    Download as PDF
                  </button>
                  <button 
                    onClick={handleDownloadImage}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-black hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Download as Image
                  </button>
                  <button 
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-black hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <FileCode2 className="w-4 h-4 text-slate-700" />
                    Download Markdown
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location & Status Banner */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/20 flex-1 relative overflow-hidden flex items-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-serif text-black tracking-tight">
                {location.name}
              </h2>
              <p className="text-sm text-black/70 font-medium">{location.state}</p>
              <p className="text-xs text-black/50 font-mono mt-1 tracking-tight">
                {location.coordinates.lat.toFixed(4)}° N, {location.coordinates.lng.toFixed(4)}° E
              </p>
            </div>
            {/* Decorative Map/Cloud Background hint */}
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white/40 to-transparent flex items-center justify-end pr-8 pointer-events-none">
              <Cloud className="w-32 h-32 text-black/5" />
            </div>
          </div>

          <div className="bg-rose-500/10 backdrop-blur-md border border-rose-500/20 p-5 rounded-2xl flex-1 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-700 uppercase tracking-wide">
                {metrics?.highRiskZones > 0 ? "HIGH RISK" : "NORMAL"}
              </h3>
              <p className="text-sm text-rose-800/80 font-medium leading-tight mt-0.5">
                {metrics?.highRiskZones > 0 
                  ? "Thunderstorm and lightning activity likely in the next 1-2 hours." 
                  : "No severe weather alerts active for this region."}
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/20 w-full md:w-64 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-black/60 shrink-0" />
              <div>
                <div className="text-[10px] text-black/60 font-semibold uppercase">
                  Report Period
                </div>
                <div className="text-sm font-bold text-black">Next 6 Hours</div>
                <div className="text-[10px] text-black/50 font-mono mt-0.5">
                  10:42 AM - 04:42 PM IST
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/20 w-full md:w-56 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-black/60 shrink-0" />
              <div>
                <div className="text-[10px] text-black/60 font-semibold uppercase">
                  Model Confidence
                </div>
                <div className="text-lg font-black text-black">84%</div>
                <div className="text-[10px] text-black/50 font-medium mt-0.5">
                  Based on multi-source data
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Data Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Current Conditions */}
          <div className="glass-panel p-5 rounded-2xl border border-white/20 flex-1">
            <h3 className="text-sm font-bold text-black mb-1">
              Current Conditions
            </h3>
            <p className="text-[11px] text-black/60 font-medium mb-4">
              Real-time atmospheric conditions for {location.name}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/40 border border-white/40 rounded-xl p-4 flex gap-3 items-center">
                <Cloud className="w-8 h-8 text-slate-500 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-black/70 leading-tight mb-1">
                    Thunderstorm
                    <br />
                    Probability
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-black leading-none">
                      {metrics?.thunderstormProbability ?? "--"}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 items-center">
                <Zap className="w-8 h-8 text-red-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-black/70 leading-tight mb-1">
                    Lightning
                    <br />
                    Probability
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-black leading-none">
                      {metrics?.lightningProbability ?? "--"}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-center">
                <CloudRain className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-black/70 leading-tight mb-1">
                    Expected Rainfall
                    <br />
                    <span className="text-[9px] font-medium text-black/50">
                      (Current rate)
                    </span>
                  </div>
                  <div className="text-xl font-black text-black leading-none mt-1">
                    {metrics?.precipitation != null ? `${metrics.precipitation} mm/h` : "--"}
                  </div>
                </div>
              </div>

              <div className="bg-white/40 border border-white/40 rounded-xl p-4 flex gap-3 items-center">
                <Wind className="w-8 h-8 text-teal-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-black/70 leading-tight mb-1">
                    Wind (Surface)
                  </div>
                  <div className="text-lg font-black text-black leading-none mt-1">
                    {metrics?.windSpeed || "--"} km/h
                  </div>
                  <div className="text-[10px] font-medium text-black/60 mt-1">
                    Steady breeze
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Summary */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/20 h-full">
              <h3 className="text-sm font-bold text-black mb-1">
                Risk Timeline (Next 6 Hours)
              </h3>
              <p className="text-[11px] text-black/60 font-medium mb-6">
                Thunderstorm and lightning risk levels for {location.name}
              </p>

              <div className="flex justify-between relative px-4">
                <div className="absolute top-5 left-8 right-8 h-[3px] bg-black/10 -z-10 rounded-full"></div>

                {[
                  { time: "Now", state: "High", color: "bg-rose-500" },
                  { time: "+30 min", state: "High", color: "bg-rose-500" },
                  { time: "+1 hour", state: "High", color: "bg-rose-500" },
                  {
                    time: "+2 hours",
                    state: "Moderate",
                    color: "bg-slate-400",
                  },
                  {
                    time: "+3 hours",
                    state: "Moderate",
                    color: "bg-slate-400",
                  },
                  { time: "+6 hours", state: "Low", color: "bg-emerald-500" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 bg-transparent"
                  >
                    <span className="text-[11px] font-bold text-black">
                      {item.time}
                    </span>
                    <div
                      className={cn(
                        "w-3.5 h-3.5 rounded-full ring-[4px] ring-white/50",
                        item.color,
                      )}
                    ></div>
                    <span
                      className={cn(
                        "text-[10px] font-bold mt-1",
                        item.state === "High"
                          ? "text-rose-600"
                          : item.state === "Moderate"
                            ? "text-black/70"
                            : "text-emerald-700",
                      )}
                    >
                      {item.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-white/20">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <SparkleIcon className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-black">AI Summary</h3>
                </div>
                <span className="text-[9px] text-black/60 font-mono font-bold tracking-tighter bg-black/5 px-2 py-1 rounded">
                  AI-Generated Analysis
                </span>
              </div>
              <p className="text-[12px] text-black/80 font-medium leading-relaxed whitespace-pre-wrap">
                {isAiLoading ? "Vajra Saathi is analyzing current meteorological conditions..." : aiData?.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Impact Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12">
          {/* Affected Things */}
          <div className="glass-panel p-5 rounded-2xl border border-white/20">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-black">Affected Things</h3>
              <span className="bg-black/5 text-black font-bold text-[10px] px-2 py-0.5 rounded-full">
                8
              </span>
            </div>
            <p className="text-[11px] text-black/60 font-medium mb-5">
              Areas and activities likely to be impacted
            </p>

            <div className="space-y-4">
              <ImpactItem
                icon={Car}
                title="Road Travel"
                desc="Reduced visibility, waterlogging and slower traffic."
                risk="High"
              />
              <ImpactItem
                icon={Plane}
                title="Air Travel"
                desc={`Possible flight delays or diversions near ${location.name}.`}
                risk="Moderate"
              />
              <ImpactItem
                icon={PersonStanding}
                title="Outdoor Activities"
                desc="Unsafe due to lightning risk."
                risk="High"
              />
              <ImpactItem
                icon={ZapOff}
                title="Power Supply"
                desc="Possibility of short-term power outages due to lightning."
                risk="Moderate"
              />
              <ImpactItem
                icon={Wifi}
                title="Telecom & Internet"
                desc="Temporary disruptions possible."
                risk="Low"
              />
            </div>
          </div>

          {/* Possible Damages */}
          <div className="glass-panel p-5 rounded-2xl border border-white/20">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-black">Possible Damages</h3>
              <span className="bg-black/5 text-black font-bold text-[10px] px-2 py-0.5 rounded-full">
                6
              </span>
            </div>
            <p className="text-[11px] text-black/60 font-medium mb-5">
              Potential impacts based on current forecast
            </p>

            <div className="space-y-4">
              <ImpactItem
                icon={TreePine}
                title="Tree Damage"
                desc="Falling trees and broken branches due to strong winds."
                risk="High"
              />
              <ImpactItem
                icon={Building2}
                title="Infrastructure"
                desc="Damage to billboards, weak structures and temporary sheds."
                risk="Moderate"
              />
              <ImpactItem
                icon={Waves}
                title="Road Flooding"
                desc="Water accumulation in low-lying areas and underpasses."
                risk="Moderate"
              />
              <ImpactItem
                icon={Zap}
                title="Electrical Damage"
                desc="Risk of damage due to lightning strikes and power surges."
                risk="Moderate"
              />
              <ImpactItem
                icon={Home}
                title="Property Damage"
                desc="Minor damage to roofs, outdoor equipment and solar panels."
                risk="Low"
              />
            </div>
          </div>

          {/* Preventive Measures */}
          <div className="glass-panel p-5 rounded-2xl border border-white/20">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-black">
                Preventive Measures
              </h3>
              <span className="bg-black/5 text-black font-bold text-[10px] px-2 py-0.5 rounded-full">
                6
              </span>
            </div>
            <p className="text-[11px] text-black/60 font-medium mb-5">
              Recommended actions to stay safe
            </p>

            <div className="space-y-4">
              <ActionItem
                icon={Car}
                title="Avoid Unnecessary Travel"
                desc="Postpone non-essential travel in the next 1-2 hours."
              />
              <ActionItem
                icon={Home}
                title="Stay Indoors"
                desc="Avoid open areas and tall structures. Stay in a safe building during lightning activity."
              />
              <ActionItem
                icon={Building2}
                title="Secure Outdoor Items"
                desc="Move vehicles, loose objects and equipment to a safe place."
              />
              <ActionItem
                icon={Info}
                title="Stay Informed"
                desc="Follow IMD updates and local authority advisories."
              />
              <ActionItem
                icon={HardHat}
                title="Safety for Outdoor Workers"
                desc="Pause outdoor work and move to safe shelters."
              />
              <ActionItem
                icon={Heart}
                title="Emergency Preparedness"
                desc="Keep emergency contacts ready and ensure backup power for critical equipment."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.64 5.23a.75.75 0 011.28-.27l2.87 3.32a.75.75 0 00.9.15l3.96-2.1a.75.75 0 011.02.94l-1.92 4.14a.75.75 0 00.17.9l3.32 2.87a.75.75 0 01-.27 1.28l-4.14 1.92a.75.75 0 00-.43.83l1.16 4.41a.75.75 0 01-.94 1.02l-4.41-1.16a.75.75 0 00-.83.43l-1.92 4.14a.75.75 0 01-1.28-.27l-2.87-3.32a.75.75 0 00-.9-.15l-3.96 2.1a.75.75 0 01-1.02-.94l1.92-4.14a.75.75 0 00-.17-.9l-3.32-2.87a.75.75 0 01.27-1.28l4.14-1.92a.75.75 0 00.43-.83L4.17 5.92a.75.75 0 01.94-1.02l4.41 1.16a.75.75 0 00.83-.43l1.29-2.84z" />
    </svg>
  );
}

function ImpactItem({
  icon: Icon,
  title,
  desc,
  risk,
}: {
  icon: any;
  title: string;
  desc: string;
  risk: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-8 flex justify-center shrink-0 pt-1">
        <Icon className="w-5 h-5 text-black/60" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-bold text-black leading-tight">
            {title}
          </h4>
          <span
            className={cn(
              "text-[9px] font-bold px-2 py-0.5 rounded border tracking-wide",
              risk === "High"
                ? "bg-rose-100 text-rose-700 border-rose-200"
                : risk === "Moderate"
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-emerald-100 text-emerald-700 border-emerald-200",
            )}
          >
            {risk}
          </span>
        </div>
        <p className="text-[11px] text-black/70 font-medium leading-snug mt-1 pr-6">
          {desc}
        </p>
      </div>
    </div>
  );
}

function ActionItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-8 flex justify-center shrink-0 pt-1">
        <Icon className="w-5 h-5 text-black/60" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-black leading-tight">{title}</h4>
        <p className="text-[11px] text-black/70 font-medium leading-snug mt-1 pr-2">
          {desc}
        </p>
      </div>
    </div>
  );
}
