"use client";
import { useState } from "react";
import { FileText, Download, BarChart3, BookOpen, Clock, Calendar, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Rapport {
  id: number;
  title: string;
  booksRead: number;
  avgProgress: number;
  timeSpent: string;
  date: string;
}

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "date" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [reports] = useState<Rapport[]>([
    { id: 1, title: "Rapport - Janvier 2025", booksRead: 5, avgProgress: 87, timeSpent: "12h 30min", date: "2025-01-31" },
    { id: 2, title: "Rapport - Février 2025", booksRead: 4, avgProgress: 74, timeSpent: "10h 10min", date: "2025-02-28" },
    { id: 3, title: "Rapport - Mars 2025", booksRead: 7, avgProgress: 92, timeSpent: "15h 05min", date: "2025-03-31" },
  ]);

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  // Filtrage et tri
  const filtered = reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) return 0;
    const valA = sortBy === "title" ? a.title : a.date;
    const valB = sortBy === "title" ? b.title : b.date;
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (column: "title" | "date") => {
    if (sortBy === column) setSortAsc(!sortAsc);
    else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  return (
    <main className={`flex-1 p-6 ${bgClass}`}>
      {/* ====== Titre et statistiques ====== */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-blue-500" /> Mes Rapports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Consultez vos statistiques de lecture et téléchargez vos rapports mensuels.
        </p>
      </div>

      {/* ====== Résumé Statistique ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
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
            <h2 className="text-lg font-semibold">Temps total de lecture</h2>
            <p className="text-2xl font-bold">37h 45min</p>
          </div>
        </div>
      </div>

      {/* ====== Barre de recherche ====== */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder={lang === "fr" ? "Rechercher un rapport..." : "Search a report..."}
          className={`w-64 pl-4 pr-4 py-2 rounded-full border-2 outline-none focus:ring-2 focus:ring-blue-400 ${
            darkMode ? "bg-gray-800 text-white border-blue-500 placeholder-gray-400" : "bg-white border-blue-400 text-gray-800 placeholder-gray-500"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={() => toggleSort("title")}
            title={lang === "fr" ? "Trier par titre" : "Sort by title"}
            className={`p-2 rounded-full border transition hover:bg-blue-100 ${
              darkMode ? "border-blue-400 text-blue-300 hover:bg-blue-900" : "border-blue-300 text-blue-600"
            }`}
          >
            <ArrowUpDown size={18} />
          </button>
          <button
            onClick={() => toggleSort("date")}
            title={lang === "fr" ? "Trier par date" : "Sort by date"}
            className={`p-2 rounded-full border transition hover:bg-blue-100 ${
              darkMode ? "border-blue-400 text-blue-300 hover:bg-blue-900" : "border-blue-300 text-blue-600"
            }`}
          >
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* ====== Tableau ====== */}
      <div className={`rounded-xl border ${borderClass} ${cardClass} shadow-md overflow-hidden`}>
        <table className="w-full">
          <thead
            className={`text-left text-sm uppercase ${
              darkMode ? "bg-purple-700 text-gray-300" : "bg-gray-200 text-purple-700"
            }`}
          >
            <tr>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("title")}>
                Titre {sortBy === "title" && (sortAsc ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
              </th>
              <th className="py-3 px-4">Livres lus</th>
              <th className="py-3 px-4">Progression</th>
              <th className="py-3 px-4">Temps</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("date")}>
                Date {sortBy === "date" && (sortAsc ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((report) => (
              <tr key={report.id} className={`border-t ${borderClass} hover:bg-gray-100 dark:gray:bg-gray-800 transition`}>
                <td className="py-3 px-4 font-medium">{report.title}</td>
                <td className="py-3 px-4">{report.booksRead}</td>
                <td className="py-3 px-4">{report.avgProgress}%</td>
                <td className="py-3 px-4">{report.timeSpent}</td>
                <td className="py-3 px-4">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
