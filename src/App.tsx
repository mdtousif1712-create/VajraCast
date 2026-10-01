import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

// Lazy loading could be used here, but for MVP we will import directly.
import { Dashboard } from "./pages/Dashboard";
import { Nowcast } from "./pages/Nowcast";
import { Storms } from "./pages/Storms";
import { Alerts } from "./pages/Alerts";
import { Analytics } from "./pages/Analytics";
import { Reports } from "./pages/Reports";
import { AIAssistant } from "./pages/AIAssistant";
import { Home } from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <AppShell>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/nowcast" element={<Nowcast />} />
                <Route path="/storms" element={<Storms />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
      <VercelAnalytics />
    </>
  );
}

export default App;
