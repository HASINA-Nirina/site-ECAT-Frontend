"use client";


import React, { useMemo, useState, useEffect } from "react";

import {
  Search,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  User,
  MapPin,
  Users,
  MoreHorizontal,
  Trash2,
  CheckCircle,
  Eye,
  X,
} from "lucide-react";

interface Student {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  inscrit?: string; // date d'inscription (optionnel)
}


interface AdminLocal {
  id: number;
  nom: string;
  prenom: string;
  antenne: string;
  email: string;
  etudiants: number;
  statut: "Actif" | "Suspendu" | "En attente";

  avatar?: string;
  students?: Student[];

}

interface Props {
  darkMode: boolean;
}

export default function ListeAdminsLocaux({ darkMode }: Props) {
  const [admins, setAdmins] = useState<AdminLocal[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "az">("recent");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (admins.length > 0 && selectedId === null) {
      setSelectedId(admins[0].id);
    }
  }, [admins, selectedId]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/auth/GetAdminLocaux")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = data.map((a: any) => ({
          id: a.id,
          nom: a.nom,
          prenom: a.prenom,
          antenne: a.antenne || "",
          email: a.email || "",
          etudiants: a.etudiants ?? 0,
          statut: a.statut || "En attente",
          avatar: a.avatar || "",
          students: a.students || [],
        }));
        setAdmins(normalized);
        setLoading(false);
        // une fois les admins chargés, on tente de récupérer les statistiques par antenne depuis le backend
        // si l'endpoint n'existe pas, la fonction fera un fallback local
        fetchAntenneStats();
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger la liste des admins");
        setLoading(false);
      });
  }, []);

  // modal pour voir la liste des étudiants d'un admin
  const [openStudentsModal, setOpenStudentsModal] = useState(false);
  const [modalAdmin, setModalAdmin] = useState<AdminLocal>({
    id: 0,
    nom: "",
    prenom: "",
    antenne: "",
    email: "",
    etudiants: 0,
    statut: "En attente",
    avatar: "",
    students: [],
  });

  const filtered = useMemo(() => {
    return admins
      .filter((a) =>
        `${a.prenom} ${a.nom}`.toLowerCase().includes(search.toLowerCase()) ||
        a.antenne.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "az") return a.nom.localeCompare(b.nom);
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      });
  }, [admins, search, sortBy]);

  const totalAdmins = admins.length;
  const totalStudents = admins.reduce((s, a) => s + a.etudiants, 0);
  // stats par antenne (récupérées depuis le backend si disponible, sinon calculées localement)
  const [antenneStats, setAntenneStats] = useState<{ antenne: string; students: number; admins: number }[]>([]);
  const [loadingAntenneStats, setLoadingAntenneStats] = useState(false);

  const selectedAdmin = admins.find((a) => a.id === selectedId) ?? admins[0] ?? null;

  const toggleStatus = async (id: number) => {
    const adminToChange = admins.find(a => a.id === id);
    if (!adminToChange) return;

    const newStatus = adminToChange.statut === "Actif" ? "Suspendu" : "Actif";

    try {
      const res = await fetch(`http://localhost:8000/auth/ChangeStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statuts: newStatus }),
      });

      if (!res.ok) throw new Error("Erreur de mise à jour");

      setAdmins((prev) => prev.map((admin) => (admin.id === id ? { ...admin, statut: newStatus } : admin)));

      // si le modal affiche cet admin, le mettre à jour aussi
      setModalAdmin((prev) => (prev.id === id ? { ...prev, statut: newStatus } : prev));
    } catch (err) {
      console.error(err);
      alert("Erreur lors du changement de statut");
    }
  };

  //  récupère la liste des étudiants pour une antenne / province donnée
  const fetchStudents = async (province: string): Promise<Student[]> => {
    try {
      if (!province) return [];
      const token = localStorage.getItem("token");
  const url = `http://localhost:8000/auth/ReadEtudiantByprovince/${encodeURIComponent(province)}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des étudiants");

      const data = await res.json();

      // data peut être un tableau d'étudiants. Normalisons le format minimal.
      const students: Student[] = (data || []).map((s: any) => ({
        id: s.id,
        prenom: s.prenom || s.firstName || "",
        nom: s.nom || s.lastName || "",
        email: s.email || "",
        inscrit: s.inscrit || s.date_inscription || "",
      }));

      return students;
    } catch (err) {
      console.error(err);
      alert("Impossible de charger les étudiants");
      return [];
    }
  };

  // récupère les statistiques agrégées par antenne depuis le backend (fallback sur agrégation locale)
  const fetchAntenneStats = async () => {
    setLoadingAntenneStats(true);
    try {
      const token = localStorage.getItem("token");
      // NOTE: adapter l'URL ci-dessous si le backend utilise un autre chemin
      const url = `http://localhost:8000/auth/GetStatsByAntenne`;
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map((d: any) => ({
            antenne: d.antenne || d.province || "",
            students: d.students ?? d.etudiants ?? 0,
            admins: d.admins ?? 0,
          }));
          setAntenneStats(normalized);
          setLoadingAntenneStats(false);
          return;
        }
      }
    } catch (err) {
      // ignore and fallback to local aggregation
      // console.warn(err);
    }

    // fallback local: agrégation depuis `admins`
    const map = new Map<string, { students: number; admins: number }>();
    admins.forEach(a => {
      const key = a.antenne || "Inconnue";
      const cur = map.get(key) ?? { students: 0, admins: 0 };
      cur.students += a.etudiants ?? 0;
      cur.admins += 1;
      map.set(key, cur);
    });
    const local = Array.from(map.entries()).map(([antenne, v]) => ({ antenne, students: v.students, admins: v.admins }));
    setAntenneStats(local);
    setLoadingAntenneStats(false);
  };

  // Ouvre la popup d'étudiants pour un admin donné
  const handleVoirEtudiants = async (admin: AdminLocal) => {

    setModalAdmin({ ...admin, students: admin.students ?? [] });
    setOpenStudentsModal(true);
    const students = await fetchStudents(admin.antenne);
    setModalAdmin(prev => ({ ...prev, students }));
  };

  const downloadStudentsPdf = (admin: AdminLocal | null) => {
    if (!admin) return;
    const students = admin.students ?? [];

    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    const style = `
      <style>
        body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111; }
        h1 { color: #0b6df0; font-size: 20px; margin-bottom: 8px; }
        table { width:100%; border-collapse: collapse; margin-top:12px; }
        th, td { border:1px solid #ddd; padding:8px; text-align:left; font-size:13px; }
        th { background: #f3f6ff; color:#0b6df0; }
        .meta { margin-top:8px; font-size:13px; color:#555; }
      </style>
    `;
    const html = `
      <html><head><title>Liste étudiants - ${admin.prenom} ${admin.nom}</title>${style}</head>
      <body>
        <h1>Étudiants gérés par ${admin.prenom} ${admin.nom} — ${admin.antenne}</h1>
        <div class="meta">Total : ${students.length} — généré le ${new Date().toLocaleString()}</div>
        <table>
          <thead><tr><th>#</th><th>Prénom</th><th>Nom</th><th>Email</th><th>Date inscription</th></tr></thead>
          <tbody>
            ${students.map((s, i) => `<tr><td>${i + 1}</td><td>${s.prenom}</td><td>${s.nom}</td><td>${s.email}</td><td>${s.inscrit || ''}</td></tr>`).join("")}
          </tbody>
        </table>
      </body></html>
    `;
    w.document.write(html);
    w.document.close();

    // ouvre le dialogue d'impression (l'utilisateur peut sauver en PDF)
    w.focus();
    setTimeout(() => {
      w.print();
    }, 500);
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header top : stats + search + sort */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Users size={28} className="text-[#17f]" />
          <div>
            <div className="text-sm opacity-70">Admins locaux</div>
            <div className="text-xl font-bold">
              {totalAdmins} <span className="text-sm font-medium opacity-60">— {totalStudents} étudiants</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher admin, antenne, email..."
              className={`pl-10 pr-4 py-2 rounded-full text-sm w-full md:w-72 focus:outline-none transition border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            />
          </div>

          <button
            onClick={() => setSortBy((s) => (s === "az" ? "recent" : "az"))}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            title={sortBy === "az" ? "Trier récents" : "Trier A–Z"}
          >
            {sortBy === "az" ? <ArrowDownWideNarrow size={16} /> : <ArrowUpNarrowWide size={16} />}
            <span className="whitespace-nowrap">{sortBy === "az" ? "Trier récents" : "Trier A–Z"}</span>
          </button>
        </div>
      </div>

      <div className="lg:flex gap-6">
        {/* LEFT: liste */}

        <div className="flex-1 lg:w-1/2 flex flex-col gap-3">
          <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-sm`}>
            <div className="flex flex-col gap-2">
              {filtered.length === 0 && (
                <div className="text-center py-6 text-gray-400">Aucun admin trouvé</div>
              )}
              {filtered.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition ${selectedId === a.id ? "ring-2 ring-[#17f]/50 shadow-lg" : "hover:shadow-md"} ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-800">
                    {(a.prenom?.[0] || "U") + (a.nom?.[0] || "")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="font-semibold">{a.prenom} {a.nom}</div>
                        <div className="text-xs opacity-70 truncate">{a.email}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold">{a.etudiants} <span className="text-xs opacity-60">étudiant(s)</span></div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <MapPin size={14} className="text-orange-400" />
                      <div className="text-xs font-medium text-orange-500">{a.antenne}</div>
                      <div className="ml-auto">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.statut === "Actif" ? "bg-green-100 text-green-800" : a.statut === "Suspendu" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"}`}>
                          {a.statut}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <MoreHorizontal size={18} className={`${darkMode ? "text-gray-300" : "text-gray-600"}`} />
                    <div className="flex gap-2">
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: panel détail */}
        <aside className="flex-1 lg:w-1/2">
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-md`}>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-[#17f] flex items-center justify-center text-2xl font-bold">
                {selectedAdmin ? (selectedAdmin.prenom?.[0] + selectedAdmin.nom?.[0]) : "NA"}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedAdmin ? `${selectedAdmin.prenom} ${selectedAdmin.nom}` : "Sélectionnez un admin"}</h2>
                    <p className="text-sm opacity-70">{selectedAdmin?.email}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs opacity-70">Antenne</div>
                    <div className="font-semibold text-orange-500">{selectedAdmin?.antenne}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-6">
                  <div>
                    <div className="text-xs opacity-70">Étudiants gérés</div>
                    <div className="text-2xl font-bold text-[#00db1d]">{selectedAdmin?.etudiants ?? "-"}</div>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedAdmin?.statut === "Actif" ? "bg-green-100 text-green-800" : selectedAdmin?.statut === "Suspendu" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"}`}>
                      {selectedAdmin?.statut}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <button
                    onClick={() => selectedAdmin && toggleStatus(selectedAdmin.id)}
                    className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border hover:shadow-sm transition flex items-center justify-center gap-2"
                  >
                    {selectedAdmin?.statut === "Actif" ? <Trash2 size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-green-600" />}
                    <span className="font-medium">{selectedAdmin?.statut === "Actif" ? "Suspendre" : "Réactiver"}</span>
                  </button>

                  <button
                    onClick={() => selectedAdmin && handleVoirEtudiants(selectedAdmin)}
                    className="flex-1 min-w-[140px] px-4 py-2 rounded-lg bg-[#17f] text-white hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <User size={16} /> Voir étudiants
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* vue rapide par antenne */}
          <div className={`mt-6 p-5 rounded-xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-purple-200"} shadow-md`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">Vue rapide par antenne</h4>
              <div className="text-sm opacity-70">Mise à jour en temps réel</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* petits cards */}
              {/** On calcule des stats simples depuis admins */}
              {loadingAntenneStats ? (
                <div className="col-span-full p-4 text-center text-gray-400">Chargement des statistiques...</div>
              ) : antenneStats.length === 0 ? (
                <div className="col-span-full p-4 text-center text-gray-400">Aucune donnée pour les antennes.</div>
              ) : (
                antenneStats.map((s) => (
                  <div key={s.antenne} className="p-3 rounded-lg border-1 flex items-center gap-3">
                    <MapPin size={20} className="text-orange-400" />
                    <div>
                      <div className="text-sm opacity-70">{s.antenne}</div>
                      <div className="font-bold text-xl text-[#17f]">{s.students} étudiants</div>
                      <div className="text-xs opacity-70">{s.admins} admin(s)</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* STUDENTS MODAL */}
      {openStudentsModal && modalAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpenStudentsModal(false); setModalAdmin(prev => ({ ...prev, students: [] })); }} />
          <div className={`relative w-[95%] max-w-3xl mx-auto p-4 rounded-xl ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} shadow-2xl z-50`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#17f] flex items-center justify-center text-lg font-bold">
                  {(modalAdmin.prenom?.[0]||"") + (modalAdmin.nom?.[0]||"")}
                </div>
                <div>
                  <div className="font-semibold text-lg">{modalAdmin.prenom} {modalAdmin.nom}</div>
                  <div className="text-sm opacity-70">Antenne: <span className="text-orange-500 font-bold">{modalAdmin.antenne}</span></div>
                </div>
              </div>
            </div>
            <div className="max-h-[50vh] overflow-auto rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className={`${darkMode ? "bg-gray-800 text-purple-400" : "bg-gray-50 text-purple-700"}`}>
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Prénom</th>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {(modalAdmin.students && modalAdmin.students.length > 0) ? modalAdmin.students.map((s, i) => (
                    <tr key={s.id} className={`${darkMode ? "hover:bg-gray-800 border-b border-gray-700" : "hover:bg-gray-50 border-b border-gray-100"}`}>
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{s.prenom}</td>
                      <td className="p-3">{s.nom}</td>
                      <td className="p-3">{s.email}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400">Aucun étudiant enregistré pour cet admin.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end gap-12">
              <button onClick={() => { setOpenStudentsModal(false); setModalAdmin(prev => ({ ...prev, students: [] })); }} className="px-4 py-2 rounded-md bg-red-600 text-white">
                Annuler
              </button>
              <button onClick={() => downloadStudentsPdf(modalAdmin)} className="px-4 py-2 rounded-md bg-[#17f] text-white">
                Télécharger (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
