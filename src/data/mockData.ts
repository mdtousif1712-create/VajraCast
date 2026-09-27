export interface StormCell {
  id: string;
  location: string;
  coordinates: [number, number];
  intensity: "Low" | "Moderate" | "Strong" | "Severe";
  reflectivity: number;
  lightningRate: number;
  movement: string;
  speed: number;
  growth: number;
  risk: "Low" | "Moderate" | "High" | "Severe";
  confidence: number;
  trajectory: [number, number][];
}

export interface Alert {
  id: string;
  time: string;
  location: string;
  type: string;
  risk: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
}

export const mockStorms: StormCell[] = [
  {
    id: "VJ-024",
    location: "Bengaluru South",
    coordinates: [12.92, 77.61],
    intensity: "Severe",
    reflectivity: 65,
    lightningRate: 45,
    movement: "NE",
    speed: 25,
    growth: 15,
    risk: "High",
    confidence: 92,
    trajectory: [[12.92, 77.61], [12.95, 77.64], [12.98, 77.67]]
  },
  {
    id: "VJ-025",
    location: "Mysuru Highway",
    coordinates: [12.75, 77.45],
    intensity: "Strong",
    reflectivity: 52,
    lightningRate: 28,
    movement: "N",
    speed: 18,
    growth: 8,
    risk: "Moderate",
    confidence: 85,
    trajectory: [[12.75, 77.45], [12.78, 77.45], [12.81, 77.45]]
  },
  {
    id: "VJ-026",
    location: "Tumakuru Road",
    coordinates: [13.05, 77.49],
    intensity: "Low",
    reflectivity: 30,
    lightningRate: 5,
    movement: "E",
    speed: 12,
    growth: -2,
    risk: "Low",
    confidence: 70,
    trajectory: [[13.05, 77.49], [13.05, 77.52], [13.05, 77.55]]
  }
];

export const mockAlerts: Alert[] = [
  {
    id: "ALT-101",
    time: new Date().toISOString(),
    location: "Bengaluru South",
    type: "Severe Thunderstorm Warning",
    risk: "SEVERE"
  },
  {
    id: "ALT-102",
    time: new Date(Date.now() - 15 * 60000).toISOString(),
    location: "Mysuru Highway",
    type: "High Lightning Activity",
    risk: "HIGH"
  },
  {
    id: "ALT-103",
    time: new Date(Date.now() - 45 * 60000).toISOString(),
    location: "Tumakuru Road",
    type: "Heavy Rain Watch",
    risk: "MODERATE"
  }
];
