"use client";

import React, { useMemo, useState, useEffect } from "react";
import logo from "@/app/assets/logo.jpeg"; 
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
  Plus,
  Edit,
  FileX,
  X,
} from "lucide-react";

// --- INTERFACES ---

interface Student {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  inscrit?: string;
}

// Mise à jour de l'interface Antenne pour correspondre au backend (besoin de l'ID)
interface Antenne {
  id: number; 
  antenne: string;
  students: number; // Sera calculé ou récupéré
  admins: number;   // Sera calculé ou récupéré
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
  // --- ETATS ADMINS ---
  const [admins, setAdmins] = useState<AdminLocal[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "az">("recent");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // --- ETATS ANTENNES & POPUPS ---
  const [antenneStats, setAntenneStats] = useState<Antenne[]>([]);
  const [newAntenneName, setNewAntenneName] = useState("");
  
  // Edition
  const [editingAntenne, setEditingAntenne] = useState<Antenne | null>(null);
  const [editName, setEditName] = useState("");
  
  // Suppression (Popup)
  const [deleteAntenne, setDeleteAntenne] = useState<Antenne | null>(null); 

  // Modals Admins
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. CHARGEMENT DES ADMINS (Code existant conservé) ---
  useEffect(() => {
    if (admins.length > 0 && selectedId === null) {
      setSelectedId(admins[0].id);
    }
  }, [admins, selectedId]);

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
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger la liste des admins");
        setLoading(false);
      });
  }, []);

  // Une fois les admins chargés, on charge les antennes
  useEffect(() => {
    fetchAntenneStats();
  }, [admins]); // Dépendance à admins pour recalculer les stats si besoin

  // --- 2. GESTION DES ANTENNES (Intégration Backend) ---

// Dans ListeAdminsLocaux.tsx

const fetchAntenneStats = async () => {
  try {
    const res = await fetch("http://localhost:8000/antenne/ReadAntenne");
    if (!res.ok) throw new Error("Erreur récupération antennes");
    
    const backendAntennes: { id: number; province: string }[] = await res.json();
    
    if (admins.length === 0) {
        setAntenneStats(backendAntennes.map(b => ({ id: b.id, antenne: b.province, students: 0, admins: 0 })));
        return;
    }
    const mergedData: Antenne[] = backendAntennes.map((b) => {
      const antenneKey = b.province.trim().toLowerCase(); 

      // Calcul local des stats pour cette antenne
      const stats = admins.reduce(
        (acc, admin) => {
          if (admin.antenne && admin.antenne.trim().toLowerCase() === antenneKey) { 
            return {
              students: acc.students + (admin.etudiants || 0),
              admins: acc.admins + 1,
            };
          }
          return acc;
        },
        { students: 0, admins: 0 }
      );

      return {
        id: b.id,
        antenne: b.province,
        students: stats.students,
        admins: stats.admins,
      };
    });

    setAntenneStats(mergedData);
  } catch (err) {
    console.error("Erreur dans fetchAntenneStats:", err);
    // Fallback silencieux ou alert
  }
};

     
  const onCreateAntenne = async (nom: string) => {
    try {
      const res = await fetch("http://localhost:8000/antenne/NewAntenne", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ province: nom }), // Correspond à AntenneCreate
      });
      if (!res.ok) throw new Error("Erreur lors de la création");
      fetchAntenneStats(); 
    } catch (err) {
      console.error(err);
      alert("Impossible de créer l'antenne");
    }
  };

  const onUpdateAntenne = async (antenne: Antenne, newName: string) => {
    try {
      const res = await fetch(`http://localhost:8000/antenne/UpdateAntenne/${antenne.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ province: newName }), 
      });
      if (!res.ok) throw new Error("Erreur de mise à jour");
      fetchAntenneStats();
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour l'antenne");
    }
  };

  // Déclenché par le bouton poubelle : ouvre juste la popup
  const onDeleteAntenneClick = (antenne: Antenne) => {
    setDeleteAntenne(antenne);
  };

  // Déclenché par le bouton "Oui" de la popup
  const confirmDelete = async () => {
    if (!deleteAntenne) return;
    try {
      const res = await fetch(`http://localhost:8000/antenne/DeleteAntenne/${deleteAntenne.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression");
      
      setDeleteAntenne(null); 
      fetchAntenneStats();    
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'antenne");
    }
  };

  // --- 3. LOGIQUE ADMINS (Code existant conservé) ---

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
        // dateCreation n'est pas dans l'interface AdminLocal fournie, fallback ID
        return b.id - a.id; 
      });
  }, [admins, search, sortBy]);

  const totalAdmins = admins.length;
  const totalStudents = admins.reduce((s, a) => s + a.etudiants, 0);
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
      setModalAdmin((prev) => (prev.id === id ? { ...prev, statut: newStatus } : prev));
    } catch (err) {
      console.error(err);
      alert("Erreur lors du changement de statut");
    }
  };

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

 // On récupère le chemin du logo (public ou import selon Next.js)
  const logoPath = "/assets/logo.jpeg"; // si le dossier /public, sinon import directement

  const logoBase64 = logo.src;

const style = `
  <style>
    body { font-family: "Times New Roman", serif; padding: 30px; color: #111; }
    
    /* LOGO */
    .logo-container {
      text-align: center;
      margin-bottom: 10px;
    }
    .logo-container img {
      width: 120px;
      height: 120px;
      border-radius: 50%; /* Cercle parfait */
      object-fit: cover;
      border: 2px solid #17f; /* Bordure autour du logo */
    }

    /* INTRO */
    .intro {
      text-align: center;
      margin-top: 40px;
      font-size: 14px;
      margin-bottom: 20px;
    }

    /* TABLEAU */
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 10px; 
      margin-bottom: 10px;
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: left; 
      font-size: 13px; 
    }
    th { 
      background: #a6dd25; 
      color: #000; 
      font-weight: bold; 
    }
    tr:nth-child(even) { background-color: #f9f9f9; }

    /* TOTAL SOUS TABLEAU */
    .total-students {
      text-align: right;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 30px;
      font-size: 14px;
    }

    /* header */
    .header {
      text-align: center;
      font-weight: bold;
      font-size: 25px;
      color: #000;
      margin-top: 10px;
    }
  </style>
`;

const html = `
    <html>
      <head>
        <title>Liste étudiants - ${admin.prenom} ${admin.nom}</title>
        ${style}
      </head>
      <body>
        <!-- LOGO -->
        <div class="logo-container">
          <img src="${logoBase64}" alt="Logo Université" />
        </div>
        <div class="header">
          UNIVERSITE ECAT TARATRA ANTANANARIVO
        </div>
        <!-- TEXTE INTRO -->
        <div class="intro">
          📋Liste des étudiants gérés par <strong> ${admin.nom} ${admin.prenom}</strong> — 📌Antenne : <strong>${admin.antenne}</strong>
        </div>

        <!-- TABLEAU -->
        <table>
          <thead>
            <tr>
              <th>NUMERO</th>
              <th>NOM</th>
              <th>PRENOM</th>
              <th>E-MAIL</th>
            </tr>
          </thead>
          <tbody>
            ${students.map((s, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${s.nom}</td>
                <td>${s.prenom}</td>
                <td>${s.email}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- TOTAL ÉTUDIANTS -->
        <div class="total-students">
          Total étudiants : ${students.length}
        </div>
      </body>
    </html>
`;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      
      {/* --- HEADER --- */}
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
          >
            {sortBy === "az" ? <ArrowDownWideNarrow size={16} /> : <ArrowUpNarrowWide size={16} />}
            <span className="whitespace-nowrap">{sortBy === "az" ? "Trier de Z-A" : "Trier de A–Z"}</span>
          </button>
        </div>
      </div>

      <div className="lg:flex gap-6">
        {/* --- LEFT: LISTE ADMINS --- */}
        <div className="flex-1 lg:w-1/2 flex flex-col gap-3">
          <div className={`p-3 rounded-xl 
                          ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
                          shadow-sm
                          max-h-[50vh] lg:max-h-[70vh] overflow-y-auto `}>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: DETAIL & ANTENNES --- */}
        <div className="flex-1 lg:w-1/2 flex flex-col gap-6">
          
          {/* PANEL DÉTAIL ADMIN */}
          <aside>
            <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-purple-200"} shadow-md`}>
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
          </aside>

          {/* LISTE DES ANTENNES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {antenneStats.map((s) => {
              const isEditing = editingAntenne?.id === s.id;

              return (
                <div
                  key={s.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                    darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                  }`}
                >
                  {isEditing ? (
                    // ---- MODE ÉDITION ----
                    <>
                      <Edit size={20} className="text-blue-500" />
                      <input
                          type="text"
                          // Correction: Assurez-vous que la valeur est toujours une chaîne de caractères
                          value={editName || ""} 
                          onChange={(e) => setEditName(e.target.value)}
                          className={`flex-1 px-2 py-1 outline-none bg-transparent border border-transparent 
                          focus:border-blue-500 rounded text-sm ${
                            darkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                          autoFocus
                      />
                      <button
                        onClick={() => {
                          if(editingAntenne) {
                             onUpdateAntenne(editingAntenne, editName);
                             setEditingAntenne(null);
                          }
                        }}
                        className="p-1 rounded hover:bg-green-200 dark:hover:bg-gray-700"
                      >
                        <CheckCircle size={20} className="text-green-500" />
                      </button>
                      <button
                        onClick={() => setEditingAntenne(null)}
                        className="p-1 rounded hover:bg-red-200 dark:hover:bg-gray-700"
                      >
                         <X size={20} className="text-red-500" />
                      </button>
                    </>
                  ) : (
                    // ---- MODE NORMAL ----
                    <>
                      <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-orange-400" />
                        <div>
                          <div className="text-sm opacity-70">{s.antenne}</div>
                          <div className="font-bold text-xl text-[#17f]">{s.students} étudiants</div>
                          <div className="text-xs opacity-70">{s.admins} admin(s)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingAntenne(s);
                            setEditName(s.antenne);
                          }}
                          className="p-1 rounded hover:bg-blue-200 dark:hover:bg-gray-700"
                        >
                          <Edit size={18} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => onDeleteAntenneClick(s)}
                          className="p-1 rounded hover:bg-red-200 dark:hover:bg-gray-700"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Bouton Ajouter une antenne */}
            <div className={`p-3 rounded-lg border flex items-center gap-3 col-span-1 sm:col-span-2 ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
            }`}>
              <Plus size={20} className="text-[#17f]" />
              <input
                type="text"
                placeholder="Nom de la province / antenne"
                value={newAntenneName}
                onChange={(e) => setNewAntenneName(e.target.value)}
                className={`flex-1 px-2 py-1 outline-none bg-transparent border border-transparent focus:border-[#17f] rounded text-sm ${
                  darkMode ? "text-gray-200 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"
                }`}
              />
              <button
                onClick={() => {
                  if (newAntenneName.trim() !== "") {
                    onCreateAntenne(newAntenneName);
                    setNewAntenneName("");
                  }
                }}
                className="p-1 rounded hover:bg-green-200 dark:hover:bg-gray-700"
                title="Valider"
              >
                <CheckCircle size={20} className="text-green-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- STUDENTS MODAL --- */}
      {openStudentsModal && modalAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
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
            <div className="max-h-[50vh] rounded-xl lg:max-h-[70vh] overflow-y-auto">
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
                      <td colSpan={4} className="p-8 text-center">
                        <FileX
                          size={80}
                          className={`mx-auto mb-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />

                        <p className="text-lg font-semibold mb-1">
                          Aucun étudiant trouvé
                        </p>

                        <p className={darkMode ? "text-gray-500" : "text-gray-600"}>
                          Cet administrateur n’a encore aucun étudiant enregistré.
                        </p>
                      </td>
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

      {/* --- POPUP SUPPRESSION ANTENNE --- */}
      {deleteAntenne && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteAntenne(null)} />
          <div
            className={`relative w-[90%] max-w-sm p-6 rounded-xl shadow-2xl ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-bold mb-4 text-center">
              Confirmer la suppression
            </h2>
            <p className="mb-6 text-center">
              Voulez-vous vraiment supprimer l&apos;antenne{" "}
              <span className="font-semibold text-orange-500">{deleteAntenne.antenne}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteAntenne(null)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Non, retour
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}