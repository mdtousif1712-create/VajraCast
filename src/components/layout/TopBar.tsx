import React from "react";
import { useLocation } from "react-router-dom";

const PATH_MAP: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Overview",
  "/nowcast": "Nowcast",
  "/storms": "Storm Cells",
  "/analytics": "Analytics",
  "/ai": "Vajra Saathi",
  "/alerts": "Alerts",
  "/reports": "AI Report",
  "/settings": "Settings",
};

export function TopBar() {
  const location = useLocation();
  const currentPage = PATH_MAP[location.pathname] || "";

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="h-14 border-b border-white/30 bg-white/20 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        {currentPage && (
          <span className="font-serif text-2xl tracking-tight text-black select-none">
            {currentPage}
          </span>
        )}
      </div>
    </div>
  );
}
