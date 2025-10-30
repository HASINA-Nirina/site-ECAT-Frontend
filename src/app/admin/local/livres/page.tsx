"use client";

import { useState } from "react";
import Header from "@/app/admin/local/dashboard/Header";
import Sidebar from "@/app/admin/local/dashboard/Sidebar";
import MainContentLivres from "@/app/admin/local/livres/MainContentLivres";

export default function AdminLocalDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang] = useState("fr");

   // State pour le sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-800 min-h-screen"}>
      {/* Sidebar fixe */}
      <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      {/* Décalage du contenu principal pour ne pas être caché par le sidebar */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* MainContent */}
        <MainContentLivres darkMode={darkMode} lang={lang} />
      </div>
    </div>
  );
}
