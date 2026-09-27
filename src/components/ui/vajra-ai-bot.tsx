import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function VajraAIBot({ variant = "floating" }: { variant?: "floating" | "inline" }) {
  const navigate = useNavigate();
  const botRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const isFloating = variant === "floating";

  // Blink every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!botRef.current) return;

      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - botCenterX;
      const dy = e.clientY - botCenterY;
      
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 400);
      const normalizedDistance = distance / 400;
      const angle = Math.atan2(dy, dx);

      // Scale down movement for the mini version (ensure eyes don't clip outside head)
      const maxMove = isFloating ? 15 : 6;
      
      setEyeOffset({
        x: Math.cos(angle) * normalizedDistance * maxMove,
        y: Math.sin(angle) * normalizedDistance * maxMove,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isFloating]);

  const botContent = (
    <div
      ref={botRef}
      onClick={() => isFloating && navigate("/ai")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cursor-pointer bg-[#0a0a0a] rounded-full flex items-center justify-center overflow-hidden group transition-transform ${
        isFloating 
          ? "w-12 h-12 sm:w-[60px] sm:h-[60px] shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 hover:scale-105 active:scale-95" 
          : "relative w-8 h-8 shadow-inner border border-white/20 hover:scale-110 active:scale-95 flex-shrink-0"
      }`}
    >
      {/* Orbital Rings (visible on hover) */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-[-20%] border-[2px] border-cyan-400/50 rounded-[40%] animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-[-10%] border-[2px] border-pink-500/50 rounded-[45%] animate-[spin_5s_linear_infinite_reverse]" />
      </div>

      {/* Eyes Container that moves with cursor */}
      <div 
        className={`flex relative z-10 ${isFloating ? "gap-2" : "gap-1"}`}
        style={{
          transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Left Eye */}
        <div 
          className={`rounded-full transition-all duration-150 ${
            isFloating ? "w-2 h-5" : "w-1 h-3"
          } ${
            isBlinking ? "scale-y-[0.1]" : 
            isHovered ? "bg-cyan-400 shadow-[0_0_15px_#22d3ee] scale-y-75" : "bg-white scale-y-100"
          }`} 
        />
        {/* Right Eye */}
        <div 
          className={`rounded-full transition-all duration-150 ${
            isFloating ? "w-2 h-5" : "w-1 h-3"
          } ${
            isBlinking ? "scale-y-[0.1]" : 
            isHovered ? "bg-cyan-400 shadow-[0_0_15px_#22d3ee] scale-y-75" : "bg-white scale-y-100"
          }`} 
        />
      </div>
    </div>
  );

  const [showTooltip, setShowTooltip] = useState(false);

  // Auto pop-up tooltip every 5 seconds for 3 seconds
  useEffect(() => {
    if (!isFloating) return;
    
    const intervalId = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 5000);

    // Initial popup
    setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isFloating]);

  if (isFloating) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 group">
        <div className={`bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-black/5 px-4 py-2.5 rounded-2xl rounded-br-sm mb-2 transition-all duration-300 pointer-events-none ${
          showTooltip || isHovered 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-2'
        }`}>
          <span className="text-xs font-bold text-black tracking-tight">Vajra Saathi AI for your help</span>
        </div>
        {botContent}
      </div>
    );
  }

  return botContent;
}
