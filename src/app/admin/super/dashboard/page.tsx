"use client";

import { useState } from "react";
import Header from "@/app/admin/super/dashboard/Header";
import Sidebar from "@/app/admin/super/dashboard/Sidebar";
import MainContent from "@/app/admin/super/dashboard/MainContent";
import SettingsModal from "@/app/admin/super/dashboard/SettingsModal";

export default function AdminLocalDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang] = useState("fr"); // setLang supprimé car inutilisé
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-800 min-h-screen"}>
      {/* Header */}
      <Header setShowSettings={setShowSettings} darkMode={darkMode} />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar darkMode={darkMode} />

        {/* MainContent */}
        <MainContent darkMode={darkMode} lang={lang} />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          darkMode={darkMode}
          lang={lang}
          setDarkMode={setDarkMode}
          setShowSettings={setShowSettings}
        />
      )}
    </div>
  );
}
