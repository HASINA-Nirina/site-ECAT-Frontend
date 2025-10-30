"use client";
import { useState } from "react";
import { CreditCard, Search, Calendar, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Paiement {
  id: number;
  nom: string;
  montant: string;
  methode: string;
  date: string;
}

export default function MainContentPaiements({ darkMode, lang }: MainContentProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"nom" | "date" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const paiements: Paiement[] = [
    { id: 1, nom: "Rakoto Jean", montant: "50 000 Ar", methode: "Mobile Money", date: "2025-10-27" },
    { id: 2, nom: "Rabe Alice", montant: "70 000 Ar", methode: "Carte Bancaire", date: "2025-10-20" },
    { id: 3, nom: "Andry Paul", montant: "45 000 Ar", methode: "Espèces", date: "2025-09-12" },
  ];

  const filtered = paiements.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) return 0;
    const valA = sortBy === "nom" ? a.nom : a.date;
    const valB = sortBy === "nom" ? b.nom : b.date;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (column: "nom" | "date") => {
    if (sortBy === column) setSortAsc(!sortAsc);
    else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  return (
    <main className="flex-1 p-6">
      {/* Titre + Recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1
          className={`text-2xl font-bold flex items-center gap-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <CreditCard size={26} className={darkMode ? "text-[#17f]" : "text-[#17f]"}/> {lang === "fr" ? "Liste des Paiements" : "Payments List"}
        </h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Barre de recherche stylée */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={lang === "fr" ? "Rechercher un paiement..." : "Search a payment..."}
              className={`w-full pl-10 pr-4 py-2 rounded-full border-2 transition-all outline-none focus:ring-2 focus:ring-purple-400 ${
                darkMode
                  ? "bg-gray-800 text-white border-purple-500 placeholder-gray-400"
                  : "bg-white border-purple-400 text-gray-800 placeholder-gray-500"
              }`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
            />
          </div>

          {/* Icônes de tri */}
          <button
            title={lang === "fr" ? "Trier par date" : "Sort by date"}
            onClick={() => toggleSort("date")}
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

      {/* Tableau stylé */}
      <div
        className={`overflow-x-auto mx-auto max-w-8xl rounded-2xl shadow-lg mt-12 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white"
        }`}
      >
        <table className="w-full text-left border-collapse text-base">
          <thead>
            <tr
              className={`text-base ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-purple-50 text-purple-700"
              }`}
            >
              <th className="p-5">ID</th>
              <th
                className="p-5 cursor-pointer"
                onClick={() => toggleSort("nom")}
              >
                Nom{" "}
                {sortBy === "nom" &&
                  (sortAsc ? (
                    <ChevronUp className="inline w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline w-4 h-4" />
                  ))}
              </th>
              <th className="p-5">Montant</th>
              <th className="p-5">Méthode</th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                Date{" "}
                {sortBy === "date" &&
                  (sortAsc ? (
                    <ChevronUp className="inline w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline w-4 h-4" />
                  ))}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, idx) => (
              <tr
                key={idx}
                className={`text-base ${
                  darkMode
                    ? "hover:bg-gray-800 border-gray-700"
                    : "hover:bg-purple-50 border-gray-100"
                } border-b`}
              >
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.nom}</td>
                <td className="p-3">{p.montant}</td>
                <td className="p-3">{p.methode}</td>
                <td className="p-3">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
