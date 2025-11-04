"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CreditCard,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface ListePaiementsProps {
  readonly darkMode: boolean;
}

export default function ListePaiements({ darkMode }: ListePaiementsProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "az">("recent");

  // Nouvelle classe pour les cartes de statistiques avec bordure gauche #17f
  const statCardClass = `p-5 rounded-2xl shadow-lg border-l-4 border-[#17f] transition-all hover:scale-[1.02] ${
    darkMode ? "bg-gray-800" : "bg-gray-50"
  }`;

  // Données temporaires simulées
  const paiements = [
    {
      id: 1,
      etudiant: "Rakoto Jean",
      antenne: "Fianarantsoa",
      montant: 45000,
      date: "2025-10-18",
      statut: "succès",
    },
    {
      id: 2,
      etudiant: "Rasoa Marie",
      antenne: "Toliara",
      montant: 30000,
      date: "2025-10-25",
      statut: "en attente",
    },
    {
      id: 3,
      etudiant: "Randria Paul",
      antenne: "Antananarivo",
      montant: 60000,
      date: "2025-09-22",
      statut: "échoué",
    },
    {
      id: 4,
      etudiant: "Rabe Luc",
      antenne: "Fianarantsoa",
      montant: 50000,
      date: "2025-10-01",
      statut: "succès",
    },
    {
      id: 5,
      etudiant: "Andry Lina",
      antenne: "Antananarivo",
      montant: 70000,
      date: "2025-10-20",
      statut: "succès",
    },
  ];

  // Filtrage et tri
  const filtered = useMemo(() => {
    return paiements
      .filter(
        (p) =>
          p.etudiant.toLowerCase().includes(search.toLowerCase()) ||
          p.antenne.toLowerCase().includes(search.toLowerCase()) ||
          p.statut.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "az") return a.etudiant.localeCompare(b.etudiant);
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [paiements, search, sortBy]);

  // Statistiques par antenne
  const statsAntenne = useMemo(() => {
    const counts: Record<string, number> = {};
    paiements.forEach((p) => {
      counts[p.antenne] = (counts[p.antenne] || 0) + 1;
    });
    return Object.entries(counts);
  }, [paiements]);

  // Statistiques par statut
  const statsStatut = useMemo(() => {
    const counts: Record<string, number> = {
      succès: 0,
      "en attente": 0,
      échoué: 0,
    };
    paiements.forEach((p) => (counts[p.statut] += 1));
    return counts;
  }, [paiements]);

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <CreditCard className="text-[#17f]" size={26} />
          <h1 className="text-2xl font-bold">Liste des paiements</h1>
        </div>

        {/* Barre de recherche + tri */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par étudiant, antenne..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border border-fuchsia-600 w-64 md:w-72 focus:outline-none transition ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-[#eb11ff]"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#eb11ff]"
              }`}
            />
          </div>

          <button
            onClick={() => setSortBy(sortBy === "az" ? "recent" : "az")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {sortBy === "az" ? (
              <ArrowDownWideNarrow size={18} />
            ) : (
              <ArrowUpNarrowWide size={18} />
            )}
            <span className="text-sm">
              {sortBy === "az" ? "Trier A-Z" : "Trier récents"}
            </span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Statistiques par antenne - UTILISE statCardClass */}
        <div className={statCardClass}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="text-[#17f]" size={22} />
            Paiements par antenne
          </h2>
          <div className="space-y-2">
            {statsAntenne.map(([antenne, count]) => (
              <div key={antenne} className="flex justify-between">
                <span className="font-medium text-orange-500">{antenne}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques par statut - UTILISE statCardClass */}
        <div className={statCardClass}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="text-[#17f]" size={22} />
            Statut des paiements
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-green-500">
                <CheckCircle size={18} /> Succès
              </span>
              <span className="font-semibold">{statsStatut["succès"]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-yellow-400">
                <Clock size={18} /> En attente
              </span>
              <span className="font-semibold">{statsStatut["en attente"]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-red-500">
                <XCircle size={18} /> Échoué
              </span>
              <span className="font-semibold">{statsStatut["échoué"]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau principal */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr
              className={`${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              } text-left text-purple-500`}
            >
              <th className="p-3 font-semibold">Étudiant</th>
              <th className="p-3 font-semibold">Antenne</th>
              <th className="p-3 font-semibold">Montant (Ar)</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className={`transition ${
                  darkMode
                    ? "hover:bg-gray-800 border-b border-gray-700"
                    : "hover:bg-gray-50 border-b border-gray-200"
                }`}
              >
                <td className="p-3">{p.etudiant}</td>
                <td className="p-3 font-semibold">{p.antenne}</td>
                <td className="p-3 font-medium">
                  {p.montant.toLocaleString("fr-FR")}
                </td>
                <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                <td className="p-3">
                  {p.statut === "succès" && (
                    <span className="text-green-500 font-semibold">Succès</span>
                  )}
                  {p.statut === "en attente" && (
                    <span className="text-yellow-400 font-semibold">
                      En attente
                    </span>
                  )}
                  {p.statut === "échoué" && (
                    <span className="text-red-500 font-semibold">Échoué</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}