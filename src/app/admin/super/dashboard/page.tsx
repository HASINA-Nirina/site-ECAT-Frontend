"use client";

import { useState } from "react";
import Header from "@/app/admin/super/dashboard/Header";
import Sidebar from "@/app/admin/super/dashboard/Sidebar";
import MainContent from "@/app/admin/super/dashboard/MainContent";

export default function AdminLocalDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang] = useState("fr");

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-800 min-h-screen"}>
      {/* Sidebar fixe */}
      <Sidebar darkMode={darkMode} />

      {/* Décalage du contenu principal pour ne pas être caché par le sidebar */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* MainContent */}
        <MainContent darkMode={darkMode} lang={lang} />
      </div>
    </div>
  );
}
