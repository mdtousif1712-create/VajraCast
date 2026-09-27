import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { DEMO_DATA, DEMO_STORMS, type FullLocationData } from '../data/demoData';

export interface LocationData {
  name: string;
  state: string;
  region?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  fullData: FullLocationData;
  stormsData: typeof DEMO_STORMS;
}

const defaultLocation: LocationData = {
  name: 'Bengaluru',
  state: 'Karnataka',
  coordinates: { lat: 12.9716, lng: 77.5946 }
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData>(defaultLocation);

  // Derive fullData based on location name (lowercase comparison)
  // If no match found, fallback to 'delhi' or the first key in DEMO_DATA
  const normalizedName = location.name.toLowerCase();
  let fullDataKey = "delhi";
  
  Object.keys(DEMO_DATA).forEach(key => {
    const data = DEMO_DATA[key];
    if (data && data.location) {
      const cityName = data.location.name.split(',')[0].toLowerCase();
      if (normalizedName.includes(key) || normalizedName.includes(cityName)) {
        fullDataKey = key;
      }
    }
  });
  
  const fullData = DEMO_DATA[fullDataKey] || DEMO_DATA["delhi"];

  return (
    <LocationContext.Provider value={{ location, setLocation, fullData, stormsData: DEMO_STORMS }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
