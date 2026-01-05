"use client";
import { useState } from "react";
import { ArrowUpDown, Calendar, ChevronUp, ChevronDown, Users,MessageCircle } from "lucide-react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";
import { useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  statut: string;
  dateCreation: string;
}

export default function MainContentEtudiants({ darkMode, lang }: MainContentProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"nom" | "dateCreation" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchEtudiants = async () => {
    try {
      const province=localStorage.getItem("province");
      setLoading(true);
      const response = await apiFetch("/auth/ReadEtudiantByprovince/${province}");
      if (!response.ok) throw new Error("Erreur lors du chargement des étudiants");
      const data: Etudiant[] = await response.json();
      setEtudiants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchEtudiants();
}, []);

if (loading) {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <p className={darkMode ? "text-white" : "text-gray-900"}>Chargement...</p>
    </main>
  );
}


const filtered = etudiants.filter((e) =>
  `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase())
);

const sorted = [...filtered].sort((a, b) => {
  if (!sortBy) return 0;
  const valA = sortBy === "nom" ? a.nom : a.dateCreation;
  const valB = sortBy === "nom" ? b.nom : b.dateCreation;
  if (valA < valB) return sortAsc ? -1 : 1;
  if (valA > valB) return sortAsc ? 1 : -1;
  return 0;
});


  const toggleSort = (column: "nom" | "dateCreation") => {
    if (sortBy === column) setSortAsc(!sortAsc);
    else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6">
      {/* ====== TITRE + BARRE DE RECHERCHE ====== */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Titre */}
        <h1
          className={`flex items-center gap-2 text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <Users size={26} className={darkMode ? "text-[#17f]" : "text-[#17f]"} />
          {lang === "fr" ? "Liste des Étudiants" : "Students List"}
        </h1>

        {/* Barre de recherche + boutons tri */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={lang === "fr" ? "Rechercher un étudiant..." : "Search a student..."}
              className={`w-full pl-4 pr-10 py-2 rounded-full border-2 transition-all outline-none focus:ring-2 focus:ring-purple-400 ${
                darkMode
                  ? "bg-gray-800 text-white border-purple-500 placeholder-gray-400"
                  : "bg-white border-purple-400 text-gray-800 placeholder-gray-500"
              }`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Boutons de tri */}
          <button
            title={lang === "fr" ? "Trier par date" : "Sort by date"}
            onClick={() => toggleSort("dateCreation")}
            className={`p-2 rounded-full border transition hover:bg-purple-100 ${
              darkMode
                ? "border-purple-400 text-purple-300 hover:bg-purple-900"
                : "border-purple-300 text-purple-600"
            }`}
          >
            <Calendar size={18} />
          </button>

          <button
            title={lang === "fr" ? "Trier par nom" : "Sort by name"}
            onClick={() => toggleSort("nom")}
            className={`p-2 rounded-full border transition hover:bg-purple-100 ${
              darkMode
                ? "border-purple-400 text-purple-300 hover:bg-purple-900"
                : "border-purple-300 text-purple-600"
            }`}
          >
            <ArrowUpDown size={18} />
          </button>
        </div>
      </div>

      {/* ====== TABLEAU ====== */}
      <div
        className={`overflow-x-auto mx-auto max-w-8xl rounded-2xl shadow-md mt-12 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white"
        }`}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`text-sm ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-purple-50 text-purple-700"
              }`}
            >
              <th className="p-3">ID</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("nom")}>
                Nom{" "}
                {sortBy === "nom" &&
                  (sortAsc ? (
                    <ChevronUp className="inline w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline w-4 h-4" />
                  ))}
              </th>
              <th className="p-4">Prénom</th>
              <th className="p-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, idx) => (
              <tr
                key={idx}
                className={`text-sm border-b ${
                  darkMode
                    ? "hover:bg-gray-800 border-gray-700"
                    : "hover:bg-purple-50 border-gray-100"
                }`}
              >
                <td className="p-5">{e.id}</td>
                <td className="p-5">{e.nom}</td>
                <td className="p-5">{e.prenom}</td>
                <td className="p-5">{e.email}</td>
                <td
                  className={`p-3 font-semibold ${
                    e.statut === "Actif" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {e.statut}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
