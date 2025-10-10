"use client";

import { useState } from "react";
import { BookOpen, CreditCard, MessageCircle } from "lucide-react";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

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
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveSection("dashboard")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeSection === "dashboard"
              ? "bg-purple-600 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Tableau de bord
        </button>
        <button
          onClick={() => setActiveSection("messages")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeSection === "messages"
              ? "bg-purple-600 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Messages
        </button>
      </div>

      {/* Contenu dynamique */}
      <section className={`p-6 rounded-xl shadow-md border ${borderClass} ${cardClass}`}>
        {activeSection === "dashboard" ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Vos formations récentes</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Développement Web – Niveau 1</li>
              <li>Design UI/UX – Atelier pratique</li>
              <li>Introduction à la cybersécurité</li>
            </ul>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2">Discussion avec votre antenne</h2>
            <p className="opacity-80">
              Retrouvez vos échanges avec l’administration locale de votre province dans l’espace de messagerie.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
