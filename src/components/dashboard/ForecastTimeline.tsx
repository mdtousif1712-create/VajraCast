import React, { useState } from "react";

import { cn } from "../../lib/utils";

export function ForecastTimeline() {
  const [selectedTime, setSelectedTime] = useState(0);
  const times = ["NOW", "+30M", "+1H", "+2H", "+3H", "+4H", "+5H", "+6H"];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel pt-4 pb-7 px-4 flex items-center gap-4 shadow-lg w-[700px] max-w-[90vw]">
      <div className="flex-1 flex items-center justify-between relative px-4">
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-border -z-10">
          <div
            className="absolute left-0 top-0 h-full bg-fog transition-all duration-300"
            style={{ width: `${(selectedTime / (times.length - 1)) * 100}%` }}
          ></div>
        </div>

        {times.map((time, idx) => (
          <button
            key={time}
            onClick={() => setSelectedTime(idx)}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={cn(
                "w-3 h-3 rounded-full border-2 transition-all duration-300",
                selectedTime === idx
                  ? "border-fog bg-surface scale-125 shadow-sm"
                  : selectedTime > idx
                    ? "border-fog bg-fog"
                    : "border-border bg-surface group-hover:border-fog/50",
              )}
            ></div>
            <span
              className={cn(
                "font-mono text-[10px] font-medium transition-colors absolute -bottom-5",
                selectedTime === idx
                  ? "text-ink font-bold"
                  : "text-ink/70 group-hover:text-ink",
              )}
            >
              {time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
