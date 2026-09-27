import { useQuery } from "@tanstack/react-query";
import { type StormCell, type Alert, mockStorms, mockAlerts } from "../data/mockData";
import type { LocationData } from "../context/LocationContext";

export const useStorms = (loc?: LocationData) => {
  return useQuery({
    queryKey: ["storms", loc?.name],
    queryFn: async (): Promise<StormCell[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStorms;
    },
  });
};

export const useAlerts = (loc?: LocationData) => {
  return useQuery({
    queryKey: ["alerts", loc?.name],
    queryFn: async (): Promise<Alert[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAlerts;
    },
  });
};

export const useMetrics = (loc?: LocationData) => {
  return useQuery({
    queryKey: ["metrics", loc?.name],
    queryFn: async () => {
      return {
        activeStorms: 2,
        stormsIncrease: "+1",
        thunderstormProbability: 78,
        lightningProbability: 64,
        highRiskZones: 1,
        trend: "up",
        windSpeed: 32,
        humidity: 85,
        temperature: 24
      };
    },
  });
};

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export const fetchAIResponse = async (prompt: string | {role: string, content: string}[], contextString?: string) => {
  try {
    let finalMessages = [];
    if (Array.isArray(prompt)) {
      finalMessages = [
        { 
          role: "system", 
          content: "You are Vajra Saathi, an advanced meteorological intelligence AI. Provide concise, highly technical but accessible weather analysis. Keep responses brief (1-3 sentences unless asked for more details) and to the point. Focus on parameters like CAPE, wind shear, lightning flash rate, and precipitation." 
        },
        ...prompt
      ];
      // Inject context into the last user message if provided
      if (contextString && finalMessages.length > 0) {
        const lastMsg = finalMessages[finalMessages.length - 1];
        if (lastMsg.role === 'user') {
          lastMsg.content = `Context Data: ${contextString}\n\nUser Query: ${lastMsg.content}`;
        }
      }
    } else {
      finalMessages = [
        { 
          role: "system", 
          content: "You are Vajra Saathi, an advanced meteorological intelligence AI. Provide concise, highly technical but accessible weather analysis. Keep responses brief (1-3 sentences unless asked for more details) and to the point. Focus on parameters like CAPE, wind shear, lightning flash rate, and precipitation." 
        },
        { 
          role: "user", 
          content: contextString ? `Context Data: ${contextString}\n\nUser Query: ${prompt}` : prompt 
        }
      ];
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: finalMessages,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    return "AI Service is temporarily unavailable or returned no response.";
  } catch (error) {
    console.error("AI Fetch Error:", error);
    return "Error communicating with the AI service.";
  }
};

export const useAIExplanation = (loc?: LocationData, fullData?: any) => {
  return useQuery({
    queryKey: ["aiExplanation", loc?.name],
    queryFn: async () => {
      if (!loc) return { explanation: "No location provided." };
      
      let context = "";
      if (fullData && fullData.nowcast) {
         context = `Location: ${loc.name}, ${loc.state}. Thunderstorm Prob: ${fullData.nowcast.thunderstormProbability}%, Lightning Prob: ${fullData.nowcast.lightningProbability}%, Precipitation: ${fullData.nowcast.precipitation}mm/h, High Risk Zones: ${fullData.nowcast.highRiskZones}, Active Storms: ${fullData.nowcast.activeStorms}`;
      }
      const prompt = `Provide a short (2-3 sentences) AI summary of the current meteorological conditions for ${loc.name}. Use the context data provided.`;
      const explanation = await fetchAIResponse(prompt, context);
      return { explanation };
    },
    staleTime: 5 * 60 * 1000,
  });
};
