"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/app/admin/local/dashboard/Header";
import Sidebar from "@/app/admin/local/dashboard/Sidebar";
import MainContent from "@/app/admin/local/SettingCompte/MainContentSetting";

export default function AdminLocalDashboard() {
  useAuth("Admin Local"); // 🔒 Protège cette page
  const [darkMode, setDarkMode] = useState(false);

  // State pour le sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-white min-h-screen"
          : "bg-white text-gray-800 min-h-screen"
      }
    >
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Décalage du contenu principal pour ne pas être caché par le sidebar */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MainContent */}
        <MainContent darkMode={darkMode}/>
      </div>
    </div>
  );
}
