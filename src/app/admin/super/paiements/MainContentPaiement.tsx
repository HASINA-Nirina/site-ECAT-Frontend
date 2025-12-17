"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CreditCard,
  MapPin,
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

  // State chargé depuis le backend
  const [paiements, setPaiements] = useState<{
    id: number | string;
    etudiant: string;
    antenne: string | null;
    montant: number;
    date: string | null;
    statut: string;
  }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [antennesList, setAntennesList] = useState<string[]>([]);

  const normalizeKey = (s: any) => {
    if (s === null || s === undefined) return "Inconnue";
    return String(s).toString().trim().replace(/\s+/g, " ");
  };
  

  useEffect(() => {
    const fetchPaiements = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const url = `http://localhost:8000/paiement/ReadPaiement/`;
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // normalisation minimale : s'assurer des champs attendus
        const normalized = (data || []).map((p: any) => ({
          id: p.id ?? p.idPaiement ?? Math.random(),
          etudiant: p.etudiant ?? (p.utilisateur ? `${p.utilisateur.nom} ${p.utilisateur.prenom}` : ""),
          antenne: p.antenne ?? (p.utilisateur ? p.utilisateur.province : null),
          montant: Number(p.montant ?? 0),
          date: p.date ?? p.date_creation ?? null,
          statut: p.statut ?? p.status ?? "",
        }));

        setPaiements(normalized);
      } catch (err) {
        console.error("fetch paiements failed:", err);
        setError("Impossible de charger les paiements depuis le serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, []);

  // fetch canonical antennes from backend
  useEffect(() => {
    const fetchAntennes = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/antennes");
        if (!res.ok) return;
  const data = await res.json();
  // data may be list of objects {id, province} or strings
  const list = (data || []).map((a: any) => normalizeKey(a?.province ?? a?.name ?? a));
  setAntennesList(Array.from(new Set(list)));
      } catch (e) {
        console.warn("Could not fetch antennes:", e);
      }
    };
    fetchAntennes();
  }, []);

  // Filtrage et tri
  const filtered = useMemo(() => {
    return paiements
      .filter((p) => {
        const etu = (p.etudiant || "").toString().toLowerCase();
        const ant = (p.antenne || "").toString().toLowerCase();
        const stat = (p.statut || "").toString().toLowerCase();
        return etu.includes(search.toLowerCase()) || ant.includes(search.toLowerCase()) || stat.includes(search.toLowerCase());
      })
      .sort((a, b) => {
        if (sortBy === "az") return a.etudiant.localeCompare(b.etudiant);
        return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
      });
  }, [paiements, search, sortBy]);

  // Statistiques par antenne
  const statsAntenne = useMemo(() => {
    const counts: Record<string, number> = {};
    paiements.forEach((p) => {
      const key = normalizeKey(p.antenne);
      counts[key] = (counts[key] || 0) + 1;
    });
    // ensure canonical antennes from backend are present with 0
    antennesList.forEach((a) => {
      const key = normalizeKey(a);
      if (!(key in counts)) counts[key] = 0;
    });
    // also ensure a bucket for unknown antennes exists (if no paiement had null antenne)
    if (!("Inconnue" in counts)) counts["Inconnue"] = 0;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [paiements, antennesList]);

  // Statistiques par statut
  const statsStatut = useMemo(() => {
    const counts: Record<string, number> = {};
    paiements.forEach((p) => {
      const s = (p.statut || "").toString();
      const key = s === "" ? "Inconnu" : s;
      counts[key] = (counts[key] || 0) + 1;
    });
    // default statuses to show even if count is 0
    const defaultStatuses = ["succès", "en attente", "échoué"];
    defaultStatuses.forEach((st) => {
      if (!(st in counts)) counts[st] = 0;
    });
    // ensure unknown status key exists
    if (!("Inconnu" in counts)) counts["Inconnu"] = 0;
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
              {sortBy === "az" ? "Trier de A-Z" : "Trier de Z-A"}
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
            {loading ? (
              <div className="col-span-full p-4 text-center text-gray-400">Chargement des paiements...</div>
            ) : statsAntenne.length === 0 ? (
              <div className="col-span-full p-4 text-center text-gray-400">Aucune donnée pour les antennes.</div>
            ) : (
              statsAntenne.map(([antenne, count]) => (
                <div key={antenne} className="flex justify-between">
                  <span className="font-medium text-orange-500">{antenne}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              )))
            }
          </div>
        </div>

        {/* Statistiques par statut - UTILISE statCardClass */}
        <div className={statCardClass}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="text-[#17f]" size={22} />
            Statut des paiements
          </h2>
            <div className="space-y-3">
              {Object.entries(statsStatut).length === 0 ? (
                <div className="text-sm text-gray-400">Aucun statut</div>
              ) : (
                Object.entries(statsStatut).map(([s, count]) => (
                  <div key={s} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-200">
                      {s}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))
              )}
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
                <td className="p-3 font-semibold">{p.antenne ?? "-"}</td>
                <td className="p-3 font-medium">
                  {p.montant.toLocaleString("fr-FR")}
                </td>
                <td className="p-3">{p.date ? new Date(p.date).toLocaleDateString() : "-"}</td>
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