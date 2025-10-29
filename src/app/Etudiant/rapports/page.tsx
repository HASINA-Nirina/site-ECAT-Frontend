"use client";

import { useState } from "react";
import Header from "@/app/Etudiant/dashboard/Header";
import Sidebar from "@/app/Etudiant/dashboard/Sidebar";
import MainContentRapports from "@/app/Etudiant/rapports/MainContentRapports";

export default function StudentDashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang] = useState("fr");

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
      {/* Sidebar fixe */}
      <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Contenu principal décalé à droite */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        
         {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Contenu principal */}
        <MainContentRapports darkMode={darkMode} lang={lang} />
      </div>
    </div>
  );
}
