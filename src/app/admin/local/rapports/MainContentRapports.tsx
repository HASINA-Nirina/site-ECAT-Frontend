"use client";
import { BarChart3, Users, CreditCard, MessageCircle } from "lucide-react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";
import { useState } from "react";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContentRapports({ darkMode, lang }: MainContentProps) {
  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const cardClass = darkMode
    ? "bg-gray-800 hover:bg-gray-700 border-gray-700"
    : "bg-white hover:bg-purple-50 border-gray-200";
  const [showMessage, setShowMessage] = useState(false);


  return (
    <main className={`flex-1 p-6 transition-colors duration-300 ${bgClass}`}>
      {/* ====== Titre principal ====== */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart3
          size={30}
          className={darkMode ? "text-blue-600" : "text-blue-600"}
        />
        <h1 className="text-3xl font-bold tracking-tight">
          {lang === "fr"
            ? "Rapports et Statistiques"
            : "Reports & Statistics"}
        </h1>
      </div>

      {/* ====== Conteneur principal ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* === Carte Étudiants Actifs === */}
        <div
          className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 ${cardClass}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              {lang === "fr" ? "Étudiants actifs" : "Active Students"}
            </h2>
            <Users
              size={28}
              className={darkMode ? "text-purple-400" : "text-purple-600"}
            />
          </div>

          <div className="h-40 flex flex-col items-center justify-center gap-2">
            <span
              className={`text-5xl font-extrabold ${
                darkMode ? "text-purple-400" : "text-purple-700"
              }`}
            >
              120
            </span>
            <span className="text-sm opacity-70">
              {lang === "fr"
                ? "Étudiants connectés ce mois"
                : "Active this month"}
            </span>
          </div>
        </div>

        {/* === Carte Paiements du mois === */}
        <div
          className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 ${cardClass}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              {lang === "fr" ? "Paiements du mois" : "Monthly Payments"}
            </h2>
            <CreditCard
              size={28}
              className={darkMode ? "text-green-400" : "text-green-600"}
            />
          </div>

          <div className="h-40 flex flex-col items-center justify-center gap-2">
            <span
              className={`text-5xl font-extrabold ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              1.2M Ar
            </span>
            <span className="text-sm opacity-70">
              {lang === "fr"
                ? "Montant total des paiements"
                : "Total payments this month"}
            </span>
          </div>
        </div>
      </div>
      <button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 z-50"
          title="Messages"
          onClick={() => setShowMessage(true)}
        >
          <MessageCircle size={28} />
      </button>
            {showMessage && (
              <MessagePopup
                darkMode={darkMode}
                onClose={() => setShowMessage(false)}
              />
            )}
    </main>
  );
}
