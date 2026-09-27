import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  CloudLightning,
  History,
  ChartNoAxesCombined,
  Bell,
  Sparkles,
  FileText,
  Home,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Nowcast", path: "/nowcast", icon: Map },
  { name: "Storm Cells", path: "/storms", icon: CloudLightning },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Vajra Saathi", path: "/ai", icon: Sparkles },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "Reports", path: "/reports", icon: FileText },
];

export function Sidebar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="group w-full md:w-20 md:hover:w-64 transition-all duration-300 ease-in-out border-t md:border-t-0 md:border-r border-white/30 bg-white/80 md:bg-white/20 backdrop-blur-xl flex flex-row md:flex-col h-16 md:h-full shrink-0 relative z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-lg">
      <div className="hidden md:flex pt-6 px-4 flex-col items-start whitespace-nowrap">
        <div className="flex items-center px-3 w-full">
          <CloudLightning className="text-black shrink-0 w-6 h-6" />
          <h1
            className={cn(
              "absolute whitespace-nowrap transition-all duration-300 ease-in-out font-serif text-2xl tracking-tight text-black pointer-events-none group-hover:pointer-events-auto z-50",
              "left-[68px] top-[22px] opacity-0 group-hover:opacity-100"
            )}
          >
            VajraCast
          </h1>
        </div>
        <p className="text-[10px] uppercase font-mono tracking-wider text-black mt-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto whitespace-normal w-[200px] leading-tight">
          AI Thunderstorm & Lightning Nowcasting
        </p>
      </div>

      <nav className="flex-1 px-2 md:px-4 flex flex-row md:flex-col space-x-1 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-hidden md:mt-4 items-center md:items-stretch scrollbar-hide justify-around md:justify-start w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-center md:justify-start gap-4 p-2 md:px-3 md:py-3 rounded-lg text-sm font-medium transition-colors relative whitespace-nowrap md:min-w-0 flex-1 md:flex-none",
                  isActive
                    ? "bg-sage/20 text-black"
                    : "text-black/80 hover:bg-surface-muted hover:text-black",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="hidden md:block absolute left-0 top-2 bottom-2 w-0.5 bg-moss rounded-r-full" />
                  )}
                  {isActive && (
                    <div className="block md:hidden absolute bottom-0 left-2 right-2 h-0.5 bg-moss rounded-t-full" />
                  )}
                  <Icon
                    className={cn(
                      "w-5 h-5 md:w-6 md:h-6 shrink-0",
                      isActive
                        ? "text-black"
                        : "text-black/80 group-hover:text-black",
                    )}
                  />
                  <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
