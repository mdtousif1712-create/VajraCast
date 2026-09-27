import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { VajraAIBot } from "../ui/vajra-ai-bot";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden text-black">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 min-h-0 order-first md:order-last">
        <TopBar />
        <main className="flex flex-col flex-1 overflow-auto relative custom-scroll">
          {children}
        </main>
      </div>
      <VajraAIBot />
    </div>
  );
}
