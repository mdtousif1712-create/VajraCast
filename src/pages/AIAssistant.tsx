import React, { useState, useRef, useEffect } from "react";
import { Wind, ChevronDown, Check, Mic, ArrowUp } from "lucide-react";
import { cn } from "../lib/utils";
import { VajraAIBot } from "../components/ui/vajra-ai-bot";
import { fetchAIResponse } from "../services/api";
import { useLocationContext } from "../context/LocationContext";

export function AIAssistant() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Vajra Saathi");
  const [threadActive, setThreadActive] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: React.ReactNode}[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recognitionRef = useRef<any>(null);
  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  // Use a ref for executePrompt to call it safely inside the onend callback
  const executePromptRef = useRef<((q: string) => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setQuery(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Auto submit if we got something
          if (queryRef.current.trim() && executePromptRef.current) {
            executePromptRef.current(queryRef.current);
          }
        };

        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setQuery("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleChipClick = (text: string) => {
    setQuery(text);
    executePrompt(text);
  };

  const [isLoading, setIsLoading] = useState(false);
  const { location, fullData } = useLocationContext();

  const executePrompt = async (currentQuery: string = query) => {
    const trimmed = currentQuery.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { role: 'user' as const, content: trimmed }];
    setMessages(newMessages);
    setThreadActive(true);
    setQuery("");
    setIsLoading(true);

    const loadingId = Date.now();
    setMessages(prev => [...prev, {
      role: 'assistant', 
      content: (
        <div key={loadingId} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )
    }]);

    const context = `Location: ${location?.name || 'Unknown'}. Weather Context: Thunderstorm Prob ${fullData?.nowcast?.thunderstormProbability || 0}%, High Risk Zones ${fullData?.nowcast?.highRiskZones || 0}, Active Storms ${fullData?.nowcast?.activeStorms || 0}.`;
    
    // Construct simplified history for the API
    const apiMessages = newMessages.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : '...' }));
    const response = await fetchAIResponse(apiMessages, context);
    
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { role: 'assistant', content: response };
      return updated;
    });
    setIsLoading(false);
  };

  executePromptRef.current = executePrompt;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executePrompt();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 relative overflow-hidden text-black font-sans">
      {/* Background glow effects - soft white for glass theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[520px] rounded-full bg-white/20 blur-[140px] z-0"
      ></div>

      <div className="relative z-10 w-full max-w-3xl flex-1 flex flex-col justify-center items-center mx-auto transition-all duration-500 ease-out px-6">
        {/* IDLE / GREETING HERO STACK */}
        {!threadActive && (
          <div className="flex flex-col items-center text-center transition-all duration-400 ease-in-out">
            <h1 className="font-serif text-[44px] leading-[52px] font-medium tracking-[-0.03em] text-black antialiased drop-shadow-sm mb-8">
              Ask VajraCast.
            </h1>
          </div>
        )}

        {/* ACTIVE THREAD CONVERSATION */}
        {threadActive && (
          <div className="w-full flex-col gap-6 pt-4 pb-6 transition-all duration-400 flex flex-1 overflow-y-auto no-scrollbar">
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end w-full">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-white/40 backdrop-blur-xl border border-white/40 px-5 py-3.5 shadow-sm text-black font-medium text-base">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3.5 w-full">
                    <div className="w-8 h-8 rounded-xl bg-sage/40 border border-white/50 flex-shrink-0 flex items-center justify-center text-black mt-1 shadow-sm">
                      <Wind className="w-[18px] h-[18px]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="rounded-2xl rounded-tl-sm glass-panel p-5 shadow-md">
                        <div className="text-black leading-relaxed text-base font-medium">
                          {msg.content}
                        </div>

                        {/* Metadata Pill Strip */}
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 text-black/80 text-[11px] font-mono tracking-widest border-t border-white/20">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/40 text-black font-medium border border-white/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-moss"></span>
                            84% confidence
                          </span>
                          <span className="px-2.5 py-1 rounded bg-white/30 text-black/80 border border-white/20">
                            Sources: Nowcast · Storm Cells
                          </span>
                        </div>
                      </div>

                      {/* Quick Context Followups - Only on last assistant message */}
                      {index === messages.length - 1 && !isLoading && (
                        <div className="flex items-center gap-2 pl-1">
                          <button
                            onClick={() =>
                              handleChipClick("Project cell path for next 45 min")
                            }
                            className="text-xs px-3 py-1.5 rounded-full bg-white/30 hover:bg-white/50 border border-white/30 text-black transition-colors shadow-sm font-medium"
                          >
                            Project cell path for next 45 min →
                          </button>
                          <button
                            onClick={() =>
                              handleChipClick("Assess rainfall intensity at airport")
                            }
                            className="text-xs px-3 py-1.5 rounded-full bg-white/30 hover:bg-white/50 border border-white/30 text-black transition-colors shadow-sm font-medium"
                          >
                            Assess airport vector →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* MAIN INPUT PILL MODULE */}
        <div
          className={cn(
            "w-full max-w-3xl relative z-30 flex flex-col items-center",
            threadActive ? "mt-4" : "mt-8",
          )}
        >
          <div className="relative w-full rounded-full glass-panel shadow-lg transition-all duration-300 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.1)] focus-within:bg-white/30">
            <div className="flex items-center h-[76px] px-3.5 sm:px-5 gap-2 sm:gap-3">
              <VajraAIBot variant="inline" />
              <div className="flex-1 relative flex items-center min-w-0 h-full pl-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isListening
                      ? "Listening to voice query..."
                      : "Ask VajraCast anything..."
                  }
                  className="w-full h-full bg-transparent text-black placeholder:text-black/50 text-base font-medium focus:outline-none focus:ring-0 leading-normal"
                />
              </div>

              <div
                className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
                ref={menuRef}
              >
                <button
                  onClick={toggleListening}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                    isListening
                      ? "text-moss bg-moss/20 animate-pulse border border-moss/30"
                      : "text-black/70 hover:text-black hover:bg-white/40 border border-transparent hover:border-white/40",
                  )}
                >
                  <Mic className="w-5 h-5" />
                </button>

                <button
                  onClick={() => executePrompt()}
                  className="w-10 h-10 rounded-full bg-sage hover:bg-sage/80 border border-white/50 text-black flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-black/50 mt-3 font-medium tracking-wide">
            Vajra Saathi AI for your help
          </p>
        </div>

        {/* Suggestion Chips */}
        {!threadActive && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 transition-all duration-300">
            {[
              "Why is VJ-024 intensifying?",
              "What alerts are active?",
              "Summarize today's weather",
            ].map((text) => (
              <button
                key={text}
                onClick={() => handleChipClick(text)}
                className="px-4 py-2 rounded-full glass-panel hover:bg-white/30 text-black text-xs font-medium transition-all duration-200 shadow-sm"
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
