"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "@/app/assets/logo.jpeg";

export default function AdminLocalDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("fr");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-800 min-h-screen"}>
      
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-opacity-90 backdrop-blur-md">
        {/* Left part */}
        <div className="flex items-center gap-4">
          <button title="Notifications" className="text-xl">🔔</button>
          <button onClick={() => setShowSettings(true)} title="Paramètres" className="text-xl">⚙️</button>
          <button title="Déconnexion" className="text-xl">🚪</button>
          <span className="ml-2 font-semibold">Admin Local</span>
        </div>

        {/* Right part: Logo + Nom */}
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-[#17f] font-bold">Université ECAT TARATRA FIANARANTSOA</span>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className={`w-64 p-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"} min-h-screen`}>
          <nav className="space-y-4">
            <a href="#" className="block hover:text-purple-500">Tableau de bord</a>
            <a href="#" className="block hover:text-purple-500">Étudiants</a>
            <a href="#" className="block hover:text-purple-500">Formateurs</a>
            <a href="#" className="block hover:text-purple-500">Paiements</a>
            <a href="#" className="block hover:text-purple-500">Rapports</a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {/* Barre de recherche */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{lang === "fr" ? "Dashboard Admin Local" : "Local Admin Dashboard"}</h1>
            <input 
              type="text"
              placeholder={lang === "fr" ? "Rechercher..." : "Search..."}
              className="p-2 border rounded-lg w-64"
            />
          </div>

          {/* Zone de graphiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-lg font-semibold mb-4">Statistiques Étudiants</h2>
              <div className="h-40 flex items-center justify-center">📊 Graphique</div>
            </div>
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-lg font-semibold mb-4">Paiements</h2>
              <div className="h-40 flex items-center justify-center">📈 Histogramme</div>
            </div>
          </div>
        </main>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <h2 className="text-xl font-bold mb-4">{lang === "fr" ? "Paramètres" : "Settings"}</h2>

            {/* Langue */}
            <div className="mb-4">
              <label className="block mb-2">{lang === "fr" ? "Langue :" : "Language:"}</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="p-2 border rounded-lg w-full text-black"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Mode clair/sombre */}
            <div className="mb-4">
              <label className="block mb-2">{lang === "fr" ? "Thème :" : "Theme:"}</label>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white"
              >
                {darkMode ? (lang === "fr" ? "Passer en mode clair" : "Switch to Light Mode") : (lang === "fr" ? "Passer en mode sombre" : "Switch to Dark Mode")}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {lang === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
