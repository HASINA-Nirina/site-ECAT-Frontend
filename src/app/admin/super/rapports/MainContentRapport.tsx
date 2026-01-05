"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, ChevronLeft, ChevronRight, List } from "lucide-react";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface HistoriqueItem {
id: number;
  id_acteur: number;
  action_type: string;
  description: string;
  target_id: number | null;
  role_visibility: string;
  date_creation: string;
  acteur_nom: string | null;
  acteur_prenom: string | null;
}

interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export default function MainContentRapport({ darkMode, lang }: MainContentProps) {
  const [historiques, setHistoriques] = useState<HistoriqueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 1,
  });

  const fetchHistoriques = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/admin/super/rapports?page=${page}&page_size=20`,
        {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      setHistoriques(data.historiques || []);
      setPagination(prev => data.pagination || prev);
    } catch (err) {
      console.error("Erreur lors du chargement des historiques:", err);
      setError("Impossible de charger les historiques.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistoriques(1);
  }, [fetchHistoriques]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchHistoriques(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };


  const cardClass = `rounded-2xl shadow-xl transition-all p-6 ${
    darkMode
      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
  }`;

  return (
    <main className="flex-1 p-6 relative">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <List size={28} color="#17f" />
          <h1
            className={`text-2xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {lang === "fr"
              ? "Historiques et Rapports"
              : "History and Reports"}
          </h1>
    </div>
  </div>

      {/* Affichage du chargement */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={darkMode ? "text-white" : "text-gray-700"}>
              {lang === "fr"
                ? "Chargement des historiques..."
                : "Loading history..."}
            </p>
          </div>
        </div>
      )}

      {/* Affichage de l'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* Liste des historiques */}
      {!loading && !error && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6 border-b border-gray-500/20 pb-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={24} className="text-[#17f]" />
              {lang === "fr"
                ? "Historique des Actions"
                : "Action History"}
            </h2>
            {pagination.total > 0 && (
              <span className="text-sm opacity-75">
                {lang === "fr"
                  ? `Total : ${pagination.total} action(s)`
                  : `Total: ${pagination.total} action(s)`}
              </span>
            )}
          </div>

          {/* Tableau des historiques */}
          {historiques.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={
                        darkMode
                          ? "border-b border-gray-700"
                          : "border-b border-gray-300"
                      }
                    >
                      <th className="text-left py-3 px-4 text-sm font-semibold">
                        {lang === "fr" ? "Date" : "Date"}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">
                        {lang === "fr" ? "Acteur" : "Actor"}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">
                        {lang === "fr" ? "Action" : "Action"}
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {historiques.map((hist) => (
                      <tr
                        key={hist.id}
                        className={
                          darkMode
                            ? "border-b border-gray-800 hover:bg-gray-800/50"
                            : "border-b border-gray-200 hover:bg-gray-50"
                        }
                      >
                        <td className="py-3 px-4 text-sm">
                          {formatDate(hist.date_creation)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {hist.acteur_prenom && hist.acteur_nom
                            ? `${hist.acteur_prenom} ${hist.acteur_nom}`
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {hist.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-500/20">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      pagination.page === 1
                        ? darkMode
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <ChevronLeft size={18} />
                    {lang === "fr" ? "Précédent" : "Previous"}
                  </button>

                  <span className="text-sm">
                    {lang === "fr"
                      ? `Page ${pagination.page} sur ${pagination.total_pages}`
                      : `Page ${pagination.page} of ${pagination.total_pages}`}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.total_pages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      pagination.page === pagination.total_pages
                        ? darkMode
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {lang === "fr" ? "Suivant" : "Next"}
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p
                className={`text-lg opacity-60 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {lang === "fr"
                  ? "Aucune action récente dans l'historique."
                  : "No recent actions in history."}
              </p>
            </div>
  )}
</div>
      )}
    </main>
);
}
