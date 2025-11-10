"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Users,
  MapPin,
} from "lucide-react";

interface ListeEtudiantsProps {
  readonly darkMode: boolean;
}

export default function ListeEtudiants({ darkMode }: ListeEtudiantsProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "az">("recent");
  interface Student {
    id: number;
    nom: string;
    prenom: string;
    antenne: string;
    dateInscription?: string;
    email?: string;
  }

  // sample fallback data used until backend responds or when offline
  const sampleEtudiants: Student[] = [
    { id: 1, nom: "Rakoto", prenom: "Jean", antenne: "Fianarantsoa", dateInscription: "2025-10-15" },
    { id: 2, nom: "Rasoa", prenom: "Marie", antenne: "Toliara", dateInscription: "2025-10-25" },
    { id: 3, nom: "Randria", prenom: "Paul", antenne: "Antananarivo", dateInscription: "2025-09-20" },
    { id: 4, nom: "Rabe", prenom: "Luc", antenne: "Fianarantsoa", dateInscription: "2025-08-30" },
    { id: 5, nom: "Andry", prenom: "Lina", antenne: "Antananarivo", dateInscription: "2025-10-10" },
    { id: 6, nom: "Nomena", prenom: "Sara", antenne: "Toliara", dateInscription: "2025-09-22" },
  ];

  const [students, setStudents] = useState<Student[]>(sampleEtudiants);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch students from backend on mount (adjust endpoint if needed)
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        // ADAPTER si l'API a un autre chemin
  const url = `http://localhost:8000/auth/ReadEtudiantAll`;
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // normalisation minimale
        const normalized: Student[] = (data || []).map((s: any) => ({
          id: Number(s.id),
          prenom: s.prenom || s.firstName || "",
          nom: s.nom || s.lastName || "",
          antenne: s.antenne || s.province || "",
          dateInscription: s.date_inscription || s.inscrit || s.dateInscription || "",
          email: s.email || "",
        }));

        if (Array.isArray(normalized) && normalized.length > 0) {
          setStudents(normalized);
        } else {
          // si backend renvoie vide, garder le fallback sample
        }
      } catch (err) {
        console.error("fetch students failed:", err);
        setError("Impossible de charger les étudiants depuis le serveur. Affichage des données locales.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filtrage et tri
  const filtered = useMemo(() => {
    return students
      .filter((e) =>
        `${e.prenom} ${e.nom}`.toLowerCase().includes(search.toLowerCase()) ||
        e.antenne.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "az") return a.nom.localeCompare(b.nom);
        return new Date(b.dateInscription || 0).getTime() - new Date(a.dateInscription || 0).getTime();
      });
  }, [students, search, sortBy]);

  // Statistiques par antenne
  const statsAntenne = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((e) => {
      const key = e.antenne || "Inconnue";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts);
  }, [students]);

  return (
    <div
      className={`p-6 rounded-2xl transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* ====================== STATISTIQUES ====================== */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="text-[#17f]" size={26} />
          <h2 className="text-2xl font-bold">Statistiques des étudiants par antenne</h2>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-4 text-center text-gray-400">Chargement des données...</div>
          ) : (
            statsAntenne.map(([antenne, count]) => (
            <div
              key={antenne}
              className={`relative p-6 rounded-xl shadow-md border-l-4 ${
                darkMode
                  ? "bg-gray-800 border-blue-400"
                  : "bg-gray-50 border-[#17f]"
              } hover:shadow-lg transform transition-all hover:scale-[1.02]`}
            >
              <p className="text-lg font-semibold mb-2 text-orange-400">
                {antenne}
              </p>
              <p className="text-4xl font-bold text-[#00db1d]">{count}</p>
              <p
                className={`text-sm mt-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Étudiants inscrits
              </p>
              <div className="absolute top-3 right-3 opacity-20">
                <Users size={36} />
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* ====================== LISTE DES ÉTUDIANTS ====================== */}
      <div
        className={`rounded-xl shadow-lg p-6 transition-all ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Users className="text-[#17f]" size={26} />
            <h1 className="text-2xl font-bold">Liste des étudiants</h1>
          </div>

          {/* Barre de recherche + tri */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border w-64 md:w-72 focus:outline-none transition ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 text-white focus:ring-2 focus:ring-[#eb11ff]"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#eb11ff]"
                }`}
              />
            </div>

            <button
              onClick={() => setSortBy(sortBy === "az" ? "recent" : "az")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition shadow-sm ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {sortBy === "az" ? (
                <ArrowDownWideNarrow size={18} />
              ) : (
                <ArrowUpNarrowWide size={18} />
              )}
              <span className="text-sm">
                {sortBy === "az" ? "Trier par A-Z" : "Trier par récents"}
              </span>
            </button>
          </div>
        </div>

        {/* Tableau */}
            <div className="overflow-x-auto rounded-lg">
              {error && (
                <div className="mb-3 text-sm text-red-500">{error}</div>
              )}
          <table className="w-full border-collapse overflow-hidden text-sm">
            <thead>
              <tr
                className={`${
                  darkMode
                    ? "bg-gray-900 text-[#eb11ff]"
                    : "bg-gray-100 text-[#eb11ff]"
                } text-left`}
              >
                <th className="p-3 font-semibold">Nom</th>
                <th className="p-3 font-semibold">Prénom</th>
                <th className="p-3 font-semibold">Antenne</th>
                <th className="p-3 font-semibold">Date d’inscription</th>
              </tr>
            </thead>
            <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-400"
                    >
                      {loading ? "Chargement..." : "Aucun étudiant trouvé."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                  <tr
                    key={e.id}
                    className={`transition-colors ${
                      darkMode
                        ? "hover:bg-gray-900 border-b border-gray-700"
                        : "hover:bg-gray-100 border-b border-gray-200"
                    }`}
                  >
                    <td className="p-3">{e.nom}</td>
                    <td className="p-3">{e.prenom}</td>
                    <td className="p-3 font-medium">
                      {e.antenne}
                    </td>
                    <td className="p-3">
                        {e.dateInscription ? new Date(e.dateInscription).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
