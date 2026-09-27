export interface Location {
  id: string;
  name: string;
  coords: [number, number];
  region: string;
}

export interface NowcastData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  trend: "rising" | "falling" | "stable";
  condition: string;
  thunderstormProbability: number;
  lightningProbability: number;
  highRiskZones: number;
  activeStorms: number;
}

export interface Alert {
  id: string;
  type: string;
  severity: "high" | "medium" | "low";
  message: string;
  time: string;
}

export interface AnalyticsData {
  weeklyTemps: { day: string; temp: number; precipitation: number }[];
  historicalComparison: { metric: string; current: number; average: number }[];
}

export interface FullLocationData {
  location: Location;
  nowcast: NowcastData;
  alerts: Alert[];
  analytics: AnalyticsData;
}

export const DEMO_DATA: Record<string, FullLocationData> = {
  "delhi": {
    location: { id: "delhi", name: "New Delhi, India", coords: [28.6139, 77.2090], region: "Delhi NCR" },
    nowcast: {
      temperature: 34,
      humidity: 65,
      windSpeed: 12,
      precipitation: 0,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 20,
      lightningProbability: 10,
      highRiskZones: 0,
      activeStorms: 0
    },
    alerts: [
      { id: "a1", type: "Heat Advisory", severity: "medium", message: "Temperatures expected to remain high.", time: "2 hours ago" }
    ],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 32, precipitation: 0 },
        { day: "Tue", temp: 34, precipitation: 0 },
        { day: "Wed", temp: 33, precipitation: 10 },
        { day: "Thu", temp: 35, precipitation: 0 },
        { day: "Fri", temp: 36, precipitation: 0 },
        { day: "Sat", temp: 31, precipitation: 20 },
        { day: "Sun", temp: 30, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 34, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "mumbai": {
    location: { id: "mumbai", name: "Mumbai, India", coords: [19.0760, 72.8777], region: "Maharashtra" },
    nowcast: {
      temperature: 29,
      humidity: 85,
      windSpeed: 25,
      precipitation: 45,
      trend: "rising",
      condition: "Heavy Rain",
      thunderstormProbability: 80,
      lightningProbability: 75,
      highRiskZones: 3,
      activeStorms: 2
    },
    alerts: [
      { id: "a2", type: "Heavy Rainfall", severity: "high", message: "Severe waterlogging expected in low-lying areas.", time: "10 mins ago" },
      { id: "a3", type: "High Tide Warning", severity: "medium", message: "High tide of 4.5m expected at 14:00.", time: "1 hour ago" }
    ],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 30, precipitation: 20 },
        { day: "Tue", temp: 29, precipitation: 45 },
        { day: "Wed", temp: 28, precipitation: 60 },
        { day: "Thu", temp: 29, precipitation: 50 },
        { day: "Fri", temp: 30, precipitation: 30 },
        { day: "Sat", temp: 31, precipitation: 10 },
        { day: "Sun", temp: 31, precipitation: 5 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 29, average: 31 },
        { metric: "Rainfall", current: 220, average: 180 }
      ]
    }
  },
  "newyork": {
    location: { id: "newyork", name: "New York, USA", coords: [40.7128, -74.0060], region: "Northeast" },
    nowcast: {
      temperature: 22,
      humidity: 55,
      windSpeed: 18,
      precipitation: 5,
      trend: "falling",
      condition: "Breezy",
      thunderstormProbability: 10,
      lightningProbability: 5,
      highRiskZones: 0,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 25, precipitation: 0 },
        { day: "Tue", temp: 24, precipitation: 0 },
        { day: "Wed", temp: 22, precipitation: 5 },
        { day: "Thu", temp: 20, precipitation: 15 },
        { day: "Fri", temp: 21, precipitation: 5 },
        { day: "Sat", temp: 23, precipitation: 0 },
        { day: "Sun", temp: 24, precipitation: 0 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 22, average: 21 },
        { metric: "Rainfall", current: 25, average: 30 }
      ]
    }
  },
  
  "bengaluru": {
    location: { id: "bengaluru", name: "Bengaluru, India", coords: [12.9716, 77.5946], region: "Karnataka" },
    nowcast: {
      temperature: 31,
      humidity: 81,
      windSpeed: 9,
      precipitation: 8,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 39,
      lightningProbability: 9,
      highRiskZones: 1,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 34, precipitation: 0 },
        { day: "Tue", temp: 32, precipitation: 0 },
        { day: "Wed", temp: 34, precipitation: 10 },
        { day: "Thu", temp: 31, precipitation: 0 },
        { day: "Fri", temp: 30, precipitation: 0 },
        { day: "Sat", temp: 30, precipitation: 20 },
        { day: "Sun", temp: 34, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 31, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "chennai": {
    location: { id: "chennai", name: "Chennai, India", coords: [13.0827, 80.2707], region: "Tamil Nadu" },
    nowcast: {
      temperature: 39,
      humidity: 43,
      windSpeed: 13,
      precipitation: 6,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 8,
      lightningProbability: 11,
      highRiskZones: 0,
      activeStorms: 1
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 32, precipitation: 0 },
        { day: "Tue", temp: 34, precipitation: 0 },
        { day: "Wed", temp: 30, precipitation: 10 },
        { day: "Thu", temp: 34, precipitation: 0 },
        { day: "Fri", temp: 33, precipitation: 0 },
        { day: "Sat", temp: 31, precipitation: 20 },
        { day: "Sun", temp: 32, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 32, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "kolkata": {
    location: { id: "kolkata", name: "Kolkata, India", coords: [22.5726, 88.3639], region: "West Bengal" },
    nowcast: {
      temperature: 32,
      humidity: 53,
      windSpeed: 23,
      precipitation: 10,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 53,
      lightningProbability: 5,
      highRiskZones: 1,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 34, precipitation: 0 },
        { day: "Tue", temp: 30, precipitation: 0 },
        { day: "Wed", temp: 34, precipitation: 10 },
        { day: "Thu", temp: 32, precipitation: 0 },
        { day: "Fri", temp: 33, precipitation: 0 },
        { day: "Sat", temp: 31, precipitation: 20 },
        { day: "Sun", temp: 34, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 31, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "hyderabad": {
    location: { id: "hyderabad", name: "Hyderabad, India", coords: [17.385, 78.4867], region: "Telangana" },
    nowcast: {
      temperature: 33,
      humidity: 40,
      windSpeed: 13,
      precipitation: 2,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 32,
      lightningProbability: 18,
      highRiskZones: 1,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 34, precipitation: 0 },
        { day: "Tue", temp: 31, precipitation: 0 },
        { day: "Wed", temp: 34, precipitation: 10 },
        { day: "Thu", temp: 33, precipitation: 0 },
        { day: "Fri", temp: 34, precipitation: 0 },
        { day: "Sat", temp: 32, precipitation: 20 },
        { day: "Sun", temp: 32, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 31, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "pune": {
    location: { id: "pune", name: "Pune, India", coords: [18.5204, 73.8567], region: "Maharashtra" },
    nowcast: {
      temperature: 33,
      humidity: 71,
      windSpeed: 17,
      precipitation: 15,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 7,
      lightningProbability: 40,
      highRiskZones: 0,
      activeStorms: 1
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 30, precipitation: 0 },
        { day: "Tue", temp: 33, precipitation: 0 },
        { day: "Wed", temp: 30, precipitation: 10 },
        { day: "Thu", temp: 31, precipitation: 0 },
        { day: "Fri", temp: 33, precipitation: 0 },
        { day: "Sat", temp: 33, precipitation: 20 },
        { day: "Sun", temp: 31, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 31, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "ahmedabad": {
    location: { id: "ahmedabad", name: "Ahmedabad, India", coords: [23.0225, 72.5714], region: "Gujarat" },
    nowcast: {
      temperature: 36,
      humidity: 84,
      windSpeed: 22,
      precipitation: 7,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 15,
      lightningProbability: 17,
      highRiskZones: 0,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 32, precipitation: 0 },
        { day: "Tue", temp: 34, precipitation: 0 },
        { day: "Wed", temp: 30, precipitation: 10 },
        { day: "Thu", temp: 30, precipitation: 0 },
        { day: "Fri", temp: 34, precipitation: 0 },
        { day: "Sat", temp: 33, precipitation: 20 },
        { day: "Sun", temp: 32, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 31, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "jaipur": {
    location: { id: "jaipur", name: "Jaipur, India", coords: [26.9124, 75.7873], region: "Rajasthan" },
    nowcast: {
      temperature: 27,
      humidity: 46,
      windSpeed: 24,
      precipitation: 8,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 10,
      lightningProbability: 29,
      highRiskZones: 0,
      activeStorms: 1
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 33, precipitation: 0 },
        { day: "Tue", temp: 32, precipitation: 0 },
        { day: "Wed", temp: 30, precipitation: 10 },
        { day: "Thu", temp: 33, precipitation: 0 },
        { day: "Fri", temp: 33, precipitation: 0 },
        { day: "Sat", temp: 33, precipitation: 20 },
        { day: "Sun", temp: 32, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 33, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "lucknow": {
    location: { id: "lucknow", name: "Lucknow, India", coords: [26.8467, 80.9462], region: "Uttar Pradesh" },
    nowcast: {
      temperature: 30,
      humidity: 49,
      windSpeed: 21,
      precipitation: 1,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 48,
      lightningProbability: 40,
      highRiskZones: 0,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 32, precipitation: 0 },
        { day: "Tue", temp: 31, precipitation: 0 },
        { day: "Wed", temp: 34, precipitation: 10 },
        { day: "Thu", temp: 31, precipitation: 0 },
        { day: "Fri", temp: 32, precipitation: 0 },
        { day: "Sat", temp: 31, precipitation: 20 },
        { day: "Sun", temp: 32, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 32, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "surat": {
    location: { id: "surat", name: "Surat, India", coords: [21.1702, 72.8311], region: "Gujarat" },
    nowcast: {
      temperature: 30,
      humidity: 58,
      windSpeed: 24,
      precipitation: 10,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 59,
      lightningProbability: 11,
      highRiskZones: 1,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 30, precipitation: 0 },
        { day: "Tue", temp: 32, precipitation: 0 },
        { day: "Wed", temp: 33, precipitation: 10 },
        { day: "Thu", temp: 31, precipitation: 0 },
        { day: "Fri", temp: 30, precipitation: 0 },
        { day: "Sat", temp: 31, precipitation: 20 },
        { day: "Sun", temp: 31, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 30, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "kanpur": {
    location: { id: "kanpur", name: "Kanpur, India", coords: [26.4499, 80.3319], region: "Uttar Pradesh" },
    nowcast: {
      temperature: 37,
      humidity: 77,
      windSpeed: 6,
      precipitation: 5,
      trend: "stable",
      condition: "Partly Cloudy",
      thunderstormProbability: 26,
      lightningProbability: 33,
      highRiskZones: 0,
      activeStorms: 0
    },
    alerts: [],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 31, precipitation: 0 },
        { day: "Tue", temp: 31, precipitation: 0 },
        { day: "Wed", temp: 31, precipitation: 10 },
        { day: "Thu", temp: 32, precipitation: 0 },
        { day: "Fri", temp: 32, precipitation: 0 },
        { day: "Sat", temp: 33, precipitation: 20 },
        { day: "Sun", temp: 31, precipitation: 40 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 30, average: 32 },
        { metric: "Rainfall", current: 10, average: 25 }
      ]
    }
  },
  "london": {
    location: { id: "london", name: "London, UK", coords: [51.5074, -0.1278], region: "Greater London" },
    nowcast: {
      temperature: 15,
      humidity: 70,
      windSpeed: 10,
      precipitation: 15,
      trend: "stable",
      condition: "Light Drizzle",
      thunderstormProbability: 5,
      lightningProbability: 0,
      highRiskZones: 0,
      activeStorms: 0
    },
    alerts: [
      { id: "a4", type: "Wind Advisory", severity: "low", message: "Gusty winds expected later tonight.", time: "3 hours ago" }
    ],
    analytics: {
      weeklyTemps: [
        { day: "Mon", temp: 14, precipitation: 20 },
        { day: "Tue", temp: 15, precipitation: 15 },
        { day: "Wed", temp: 16, precipitation: 5 },
        { day: "Thu", temp: 15, precipitation: 10 },
        { day: "Fri", temp: 14, precipitation: 25 },
        { day: "Sat", temp: 13, precipitation: 30 },
        { day: "Sun", temp: 15, precipitation: 10 }
      ],
      historicalComparison: [
        { metric: "Temperature", current: 15, average: 14 },
        { metric: "Rainfall", current: 115, average: 100 }
      ]
    }
  }
};

export const DEMO_STORMS = [
  {
    id: "ST-01",
    name: "Cyclone Mocha",
    locationId: "mumbai",
    location: "Mumbai",
    coordinates: [72.8777, 19.0760],
    intensity: "Category 3",
    risk: "Severe",
    status: "Active",
    speed: 45,
    movement: "NE",
    direction: "North-East",
    reflectivity: 65,
    lightningRate: 120,
    confidence: 94,
    description: "Severe cyclonic storm approaching the western coast."
  },
  {
    id: "ST-02",
    name: "Thunderstorm Cell A",
    locationId: "delhi",
    location: "Delhi NCR",
    coordinates: [77.2090, 28.6139],
    intensity: "Moderate",
    risk: "Medium",
    status: "Developing",
    speed: 20,
    movement: "E",
    direction: "East",
    reflectivity: 45,
    lightningRate: 45,
    confidence: 82,
    description: "Localized thunderstorm activity developing rapidly."
  },
  {
    id: "ST-03",
    name: "Nor'easter",
    locationId: "newyork",
    location: "New York",
    coordinates: [-74.0060, 40.7128],
    intensity: "Category 1",
    risk: "High",
    status: "Active",
    speed: 35,
    movement: "N",
    direction: "North",
    reflectivity: 55,
    lightningRate: 60,
    confidence: 88,
    description: "Strong coastal storm bringing heavy rain and wind."
  },
  {
    id: "ST-04",
    name: "Atlantic Depression",
    locationId: "london",
    location: "London",
    coordinates: [-0.1278, 51.5074],
    intensity: "Weak",
    risk: "Low",
    status: "Dissipating",
    speed: 15,
    movement: "E",
    direction: "East",
    reflectivity: 25,
    lightningRate: 10,
    confidence: 75,
    description: "Remnants of a larger system causing prolonged drizzle."
  }
];
