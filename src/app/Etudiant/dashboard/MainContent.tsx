"use client";

import { useState } from "react";
import { BookOpen, CreditCard, MessageCircle, FileText, BarChart3, Clock } from "lucide-react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";


interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showMessage, setShowMessage] = useState(false);
  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  // Données fictives pour la section rapports
  const reports = [
    {
      id: 1,
      mois: "Janvier 2025",
      livres: 5,
      progression: 87,
      temps: "12h 30min",
    },
    {
      id: 2,
      mois: "Février 2025",
      livres: 4,
      progression: 74,
      temps: "10h 10min",
    },
    {
      id: 3,
      mois: "Mars 2025",
      livres: 7,
      progression: 92,
      temps: "15h 05min",
    },
  ];

  return (
    <main className={`flex-1 p-6 ${bgClass}`}>
      <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre espace étudiant</h1>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-5 rounded-xl shadow-md ${cardClass} border ${borderClass}`}>
          <BookOpen size={32} className="text-purple-600 mb-3" />
          <h2 className="text-lg font-semibold">Formations suivies</h2>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>

        <div className={`p-5 rounded-xl shadow-md ${cardClass} border ${borderClass}`}>
          <CreditCard size={32} className="text-green-500 mb-3" />
          <h2 className="text-lg font-semibold">Paiements effectués</h2>
          <p className="text-3xl font-bold mt-2">2</p>
        </div>

        <div className={`p-5 rounded-xl shadow-md ${cardClass} border ${borderClass}`}>
          <MessageCircle size={32} className="text-blue-500 mb-3" />
          <h2 className="text-lg font-semibold">Discussions actives</h2>
          <p className="text-3xl font-bold mt-2">1</p>
        </div>
      </div>

      {/* Navigation interne simple */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { key: "dashboard", label: "Tableau de bord" },
          { key: "messages", label: "Messages" },
          { key: "rapports", label: "Rapports" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeSection === tab.key
                ? "bg-purple-600 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu dynamique */}
      <section className={`p-6 rounded-xl shadow-md border ${borderClass} ${cardClass}`}>
        {activeSection === "dashboard" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Vos formations récentes</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Développement Web – Niveau 1</li>
              <li>Design UI/UX – Atelier pratique</li>
              <li>Introduction à la cybersécurité</li>
            </ul>
          </div>
        )}

        {activeSection === "messages" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Discussion avec votre antenne</h2>
            <p className="opacity-80">
              Retrouvez vos échanges avec l’administration locale dans votre espace de messagerie.
            </p>
          </div>
        )}

        {activeSection === "rapports" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-blue-500" /> Vos Rapports Mensuels
            </h2>

            {/* Résumé global */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className={`p-5 rounded-xl shadow-md border ${borderClass} ${cardClass} flex items-center gap-4`}>
                <BookOpen size={40} className="text-blue-500" />
                <div>
                  <h2 className="text-lg font-semibold">Livres lus</h2>
                  <p className="text-2xl font-bold">16</p>
                </div>
              </div>

              <div className={`p-5 rounded-xl shadow-md border ${borderClass} ${cardClass} flex items-center gap-4`}>
                <BarChart3 size={40} className="text-green-500" />
                <div>
                  <h2 className="text-lg font-semibold">Progression moyenne</h2>
                  <p className="text-2xl font-bold">84%</p>
                </div>
              </div>

              <div className={`p-5 rounded-xl shadow-md border ${borderClass} ${cardClass} flex items-center gap-4`}>
                <Clock size={40} className="text-yellow-500" />
                <div>
                  <h2 className="text-lg font-semibold">Temps total</h2>
                  <p className="text-2xl font-bold">37h 45min</p>
                </div>
              </div>
            </div>

            {/* Tableau des rapports */}
            <div className={`rounded-xl border ${borderClass} ${cardClass} shadow-md overflow-hidden`}>
              <table className="w-full text-left text-sm">
                <thead
                  className={`${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                  } uppercase`}
                >
                  <tr>
                    <th className="py-3 px-4">Mois</th>
                    <th className="py-3 px-4">Livres lus</th>
                    <th className="py-3 px-4">Progression</th>
                    <th className="py-3 px-4">Temps de lecture</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr
                      key={r.id}
                      className={`border-t ${borderClass} hover:bg-gray-100 dark:hover:bg-gray-800 transition`}
                    >
                      <td className="py-3 px-4 font-medium">{r.mois}</td>
                      <td className="py-3 px-4">{r.livres}</td>
                      <td className="py-3 px-4">{r.progression}%</td>
                      <td className="py-3 px-4">{r.temps}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => alert(`Téléchargement du rapport ${r.mois}...`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 mx-auto"
                        >
                          <FileText size={14} /> Télécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
      {/* Floating message button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
        title="Messages"
        onClick={() => setShowMessage(true)}
      >
        <MessageCircle size={28} />
      </button>

      {/* Utilisation du composant MessagePopup simulé localement */}
      {showMessage && (
        <MessagePopup
          darkMode={darkMode}
          onClose={() => setShowMessage(false)}
        />
      )}
    </main>
   );
 }
