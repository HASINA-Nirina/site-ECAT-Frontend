"use client";

import React, { useState } from "react";
import Header from "@/app/admin/super/dashboard/Header";
import Sidebar from "@/app/admin/super/dashboard/Sidebar";
import MainContent from "@/app/admin/super/dashboard/MainContent";
import SettingsModal from "@/app/admin/super/dashboard/SettingsModal";

export default function AdminLocalDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang] = useState("fr"); // supprime setLang inutilisé
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-800 min-h-screen"}>
      <Header setShowSettings={setShowSettings} darkMode={darkMode} />
      <div className="flex">
        <Sidebar darkMode={darkMode} />
        <MainContent darkMode={darkMode} lang={lang} />
      </div>
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
