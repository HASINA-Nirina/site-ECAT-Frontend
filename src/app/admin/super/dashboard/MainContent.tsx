"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup"; // importer la popup

// Props immuables
interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent(props: MainContentProps) {
  const { darkMode, lang } = props; // destructuration
  const [showMessage, setShowMessage] = useState(false); // état pour afficher la popup

  return (
    <main className="flex-1 p-6 relative">
      {/* Header interne du MainContent */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {lang === "fr" ? "Dashboard Admin Local" : "Local Admin Dashboard"}
        </h1>
        <input
          type="text"
          placeholder={lang === "fr" ? "Rechercher..." : "Search..."}
          className="p-2 border rounded-lg w-64"
        />
      </div>

      {/* Contenu principal */}
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

      {/* Bouton message fixe en bas à droite */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition"
        title="Messages"
        onClick={() => setShowMessage(true)}
      >
        <MessageCircle size={28} />
      </button>

      {/* Popup message */}
      {showMessage && (
        <MessagePopup
          darkMode={darkMode}
          adminName="Super Admin"
          onClose={() => setShowMessage(false)}
        />
      )}
    </main>
  );
}
