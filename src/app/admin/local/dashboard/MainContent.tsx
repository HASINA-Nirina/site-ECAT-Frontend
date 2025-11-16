"use client";

import { useState } from "react";
import { LayoutDashboard, MessageCircle, Users, CreditCard } from "lucide-react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [showMessage, setShowMessage] = useState(false);

  const cardBase = `p-6 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col gap-4`;
  const cardStyle = darkMode
    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
    : "bg-white border-gray-200 hover:bg-purple-50";

  return (
    <main className="flex-1 p-6 relative">
      {/* === En-tête interne du dashboard === */}
      <div className="flex items-center mb-8 gap-3">
        <LayoutDashboard
          size={28}
          className={darkMode ? "text-blue-600" : "text-blue-600"}
        />
        <h1
          className={`text-3xl font-bold tracking-tight ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {lang === "fr"
            ? "Tableau de bord - Admin Local"
            : "Local Admin Dashboard"}
        </h1>
      </div>

      {/* === Grille des sections principales === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === Carte Étudiants inscrits === */}
        <div
          className={`${cardBase} ${cardStyle} border-l-4 ${
            darkMode ? "border-l-purple-500" : "border-l-purple-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg font-semibold ${
                darkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              Étudiants inscrits
            </h2>
            <Users
              size={28}
              className={darkMode ? "text-purple-400" : "text-purple-600"}
            />
          </div>

          <div className="h-40 flex items-center justify-center rounded-lg border-gray-500 dark:border-gray-600 text-gray-500 dark:text-gray-400">
            📊 Statistiques ou graphique à venir
          </div>
        </div>

        {/* === Carte Paiements reçus === */}
        <div
          className={`${cardBase} ${cardStyle} border-l-4 ${
            darkMode ? "border-l-green-500" : "border-l-green-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg font-semibold ${
                darkMode ? "text-green-300" : "text-green-700"
              }`}
            >
              Paiements reçus
            </h2>
            <CreditCard
              size={28}
              className={darkMode ? "text-green-400" : "text-green-600"}
            />
          </div>

          <div className="h-40 flex items-center justify-center rounded-lg border-gray-500 dark:border-gray-600 text-gray-500 dark:text-gray-400">
            💰 Détails Mobile Money / Historique
          </div>
        </div>
      </div>

      {/* === Bouton messages (flottant) === */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl transition-transform transform hover:scale-110"
        title="Messages"
        onClick={() => setShowMessage(true)}
      >
        <MessageCircle size={28} />
      </button>

      {/* === Popup de messages === */}
      {showMessage && (
        <MessagePopup
          darkMode={darkMode}
          adminName="Admin Local"
          onClose={() => setShowMessage(false)}
        />
      )}
    </main>
  );
}
