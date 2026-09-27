import React from "react";
import { cn } from "../lib/utils";
import { useLocationContext } from "../context/LocationContext";
import { useAlerts } from "../services/api";

export function Alerts() {
  const { location, fullData } = useLocationContext();
  const alerts = fullData.alerts.map(a => ({
    ...a,
    risk: a.severity.toUpperCase(),
    location: location.name
  }));
  const [selectedAlertId, setSelectedAlertId] = React.useState<string | null>(null);

  const selectedAlert = alerts?.find(a => a.id === selectedAlertId) || alerts?.[0];
  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-y-auto p-6 space-y-6 text-black relative z-10">
      {/*  BEGIN: Master Application Canvas (1440x900 aspect desktop frame)  */}
      <main
        className="master-atmosphere w-full max-w-[1440px] md:min-h-[900px] rounded-3xl relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden"
        data-purpose="master-workspace"
      >
        {/*  BEGIN: Top Bar Section  */}

        {/*  END: Top Bar Section  */}
        {/*  BEGIN: Two-Zone Alert Analysis Workspace  */}
        <div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 flex-1 items-start"
          data-purpose="alerts-layout-grid"
        >
          {/*  ==========================================  */}
          {/*  ZONE 1: LEFT PANEL (~65% width: 8 Cols)  */}
          {/*  ==========================================  */}
          <section
            className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4"
            data-purpose="alert-list-container"
          >
            {/*  Filter Tabs / Pills  */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1"
              data-purpose="severity-filter-bar"
            >
              <button
                className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm transition-colors btn-primary"
                type="button"
              >
                ALL (4)
              </button>
              <button
                className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-white/[0.03] border border-white/30/[0.08] text-black hover:text-black hover:bg-white/[0.06] transition-colors btn-primary"
                type="button"
              >
                HIGH (1)
              </button>
              <button
                className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-white/[0.03] border border-white/30/[0.08] text-black hover:text-black hover:bg-white/[0.06] transition-colors btn-primary"
                type="button"
              >
                MODERATE (2)
              </button>
              <button
                className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-white/[0.03] border border-white/30/[0.08] text-black hover:text-black hover:bg-white/[0.06] transition-colors btn-primary"
                type="button"
              >
                MONITORING (1)
              </button>
            </div>
            {/*  Vertical Alert Cards List  */}
            <div className="flex flex-col gap-3.5" id="alert-cards-wrapper">
              {(!alerts || alerts.length === 0) ? (
                <div className="p-4 text-center text-black/60 text-sm font-medium">
                  No active alerts for this region.
                </div>
              ) : (
                alerts.map((alert) => (
                  <article
                    key={alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    className={cn(
                      "glass-panel rounded-2xl p-5 cursor-pointer flex flex-col gap-2.5 transition-all",
                      selectedAlert?.id === alert.id 
                        ? "border-2 border-amber-500/50 bg-amber-500/10" 
                        : "hover:bg-white/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider border",
                          alert.risk === "HIGH" || alert.risk === "SEVERE"
                            ? "text-amber-400 bg-amber-500/20 border-amber-500/40"
                            : "text-black border-[#d97706]/30"
                        )}>
                          {alert.risk}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-black font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          ACTIVE
                        </span>
                      </div>
                      <span className="text-xs text-black">{alert.time}</span>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-black tracking-tight">
                        {alert.type}
                      </h2>
                      <div className="text-xs text-black flex items-center gap-2 mt-0.5 font-normal">
                        <span>{alert.location}</span>
                        <span className="text-black">•</span>
                        <span className="text-black">Alert {alert.id}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
          {/*  ==========================================  */}
          {/*  ZONE 2: RIGHT PANEL (~35% width: 4-5 Cols)  */}
          {/*  SELECTED ALERT DETAIL PANEL                  */}
          {/*  ==========================================  */}
          <section
            className="lg:col-span-5 xl:col-span-4 flex flex-col"
            data-purpose="alert-detail-panel"
          >
            {selectedAlert ? (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col gap-5 border border-white/30">
                {/*  Detail Panel Header  */}
                <div className="border-b border-white/30/[0.08] pb-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-black tracking-widest uppercase">
                      Alert Detail
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase",
                        selectedAlert.risk === "HIGH" || selectedAlert.risk === "SEVERE"
                          ? "text-amber-400 bg-amber-500/15 border border-amber-500/30"
                          : "text-black bg-white/10 border border-white/30"
                      )}
                      id="detail-severity-tag"
                    >
                      {selectedAlert.risk} Risk
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold text-black tracking-tight leading-snug"
                    id="detail-title"
                  >
                    {selectedAlert.type}
                  </h3>
                  <p className="text-xs text-black" id="detail-location">
                    {selectedAlert.message}
                  </p>
                </div>
                {/*  Telemetry Grid (2x2 Stats)  */}
                <div
                  className="grid grid-cols-2 gap-2.5"
                  data-purpose="telemetry-grid"
                >
                  <div className="glass-panel rounded-xl p-3 flex flex-col">
                    <span className="text-[11px] text-black">Time</span>
                    <span
                      className="text-sm font-semibold text-black mt-0.5"
                      id="stat-detected"
                    >
                      {selectedAlert.time}
                    </span>
                  </div>
                  <div className="glass-panel rounded-xl p-3 flex flex-col">
                    <span className="text-[11px] text-black">Status</span>
                    <span
                      className="text-sm font-semibold text-amber-400 mt-0.5"
                      id="stat-status"
                    >
                      Active
                    </span>
                  </div>
                  <div className="glass-panel rounded-xl p-3 flex flex-col">
                    <span className="text-[11px] text-black">
                      Risk Level
                    </span>
                    <span
                      className="text-sm font-semibold text-black mt-0.5"
                      id="stat-prob"
                    >
                      {selectedAlert.risk}
                    </span>
                  </div>
                  <div className="glass-panel rounded-xl p-3 flex flex-col">
                    <span className="text-[11px] text-black">Alert ID</span>
                    <span
                      className="text-sm font-semibold text-black mt-0.5"
                      id="stat-confidence"
                    >
                      {selectedAlert.id}
                    </span>
                  </div>
                </div>
                {/*  AI Nowcast Insight Box  */}
                <div
                  className="glass-panel rounded-2xl p-3.5 flex flex-col gap-1.5"
                  data-purpose="ai-insight-box"
                >
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold tracking-wide">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                    <span>AI NOWCAST INSIGHT</span>
                  </div>
                  <p
                    className="text-xs text-black leading-relaxed font-normal"
                    id="ai-insight-text"
                  >
                    System detected severe conditions indicative of {selectedAlert.type.toLowerCase()} in {selectedAlert.location}. 
                    Immediate monitoring is recommended. 
                  </p>
                </div>
                {/*  Action Buttons  */}
                <div
                  className="pt-2 flex items-center gap-3"
                  data-purpose="alert-actions"
                >
                  <button
                    className="btn-amber-glow flex-1 py-2.5 px-4 rounded-xl text-black font-semibold text-xs sm:text-sm tracking-wide transition-transform active:scale-[0.98] btn-primary"
                    type="button"
                  >
                    Acknowledge Alert
                  </button>
                  <button
                    className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/30/[0.1] text-black hover:text-black font-medium text-xs sm:text-sm tracking-wide transition-all btn-primary"
                    type="button"
                  >
                    Export Advisory
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-black/50 text-sm font-medium">
                Select an alert to view details.
              </div>
            )}
          </section>
        </div>
        {/*  END: Two-Zone Alert Analysis Workspace  */}
        {/*  BEGIN: Subdued Footer Status Info  */}
        <footer
          className="w-full mt-6 pt-4 border-t border-white/30/[0.05] flex items-center justify-between text-[11px] text-black z-10"
          data-purpose="footer-status-bar"
        >
          <div>
            VajraCast Automated Severe Weather Intelligence Engine · Node BLR-01
          </div>
          <div className="flex items-center gap-4">
            <span>Refresh: Continuous 1.2s</span>
            <span>•</span>
            <span className="text-amber-500/80">Telemetry Connected</span>
          </div>
        </footer>
        {/*  END: Subdued Footer Status Info  */}
      </main>
      {/*  END: Master Application Canvas  */}
      {/*  BEGIN: Interactive Switching Script  */}

      {/*  END: Interactive Switching Script  */}
    </div>
  );
}
