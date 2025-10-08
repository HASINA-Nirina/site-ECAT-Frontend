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
      {/* Header */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex flex-col md:flex-row">
        <Sidebar darkMode={darkMode} />
        <MainContent darkMode={darkMode} lang={lang} />
      </div>
    </div>
  );
}
