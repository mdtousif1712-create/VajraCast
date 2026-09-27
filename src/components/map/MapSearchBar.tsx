import React, { useState } from "react";
import { Search } from "lucide-react";
import { useLocationContext } from "../../context/LocationContext";
import { DEMO_DATA } from "../../data/demoData";

export function MapSearchBar() {
  const [query, setQuery] = useState("");
  const { setLocation } = useLocationContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const normalizedSearch = query.toLowerCase();
      let matchedKey = "";
      
      const allData = DEMO_DATA;
      Object.keys(allData).forEach(key => {
        const cityName = allData[key].location.name.split(',')[0].toLowerCase();
        // Check for exact matches or partial matches
        if (
          normalizedSearch.includes(key) || 
          normalizedSearch.includes(cityName) ||
          key.includes(normalizedSearch) ||
          cityName.includes(normalizedSearch)
        ) {
          matchedKey = key;
        }
        // Special case for Bangalore/Banglore
        if ((normalizedSearch.includes('bangalore') || normalizedSearch.includes('banglore')) && key === 'bengaluru') {
          matchedKey = key;
        }
      });

      const match = matchedKey ? allData[matchedKey] : null;
      
      if (match) {
        setLocation({
          name: match.location.name,
          state: match.location.region || "Region",
          coordinates: { lat: match.location.coords[0], lng: match.location.coords[1] }
        });
      } else {
        const pseudoLat = 12 + Math.random() * 5;
        const pseudoLng = 77 + Math.random() * 5;
        setLocation({
          name: query.trim(),
          state: "Custom Region",
          coordinates: { lat: pseudoLat, lng: pseudoLng }
        });
      }
    }
  };

  return (
    <div className="absolute top-6 left-6 z-10 w-96">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full h-12 rounded-xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg overflow-hidden group focus-within:bg-white/60 focus-within:border-white/50 transition-all duration-300">
        <button type="submit" className="pl-4 flex items-center hover:opacity-70 transition-opacity">
          <Search className="w-5 h-5 text-ink/60 group-focus-within:text-ink transition-colors" />
        </button>
        <input
          type="text"
          className="w-full h-full bg-transparent outline-none border-none pl-4 pr-5 text-base text-ink placeholder:text-ink/60 font-medium font-sans"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </div>
  );
}
