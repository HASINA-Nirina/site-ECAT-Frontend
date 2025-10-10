"use client";

import { useState } from "react";
import Header from "@/app/Etudiant/dashboard/Header";
import Sidebar from "@/app/Etudiant/dashboard/Sidebar";
import MainContent from "@/app/Etudiant/dashboard/MainContent";

export default function StudentDashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang] = useState("fr");

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-white min-h-screen"
          : "bg-white text-gray-800 min-h-screen"
      }
    >
      {/* Sidebar fixe */}
      <Sidebar darkMode={darkMode} />

      {/* Contenu principal décalé à droite */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Contenu principal */}
        <MainContent darkMode={darkMode} lang={lang} />
      </div>
    </div>
  );
}
