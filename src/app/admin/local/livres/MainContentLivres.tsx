"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BookOpen, PlusCircle, ChevronLeft, Edit, Trash2, FileText, LucidePlusCircle } from "lucide-react";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Formation {
  idFormation: number;
  titre: string;
  description?: string;
  image?: string;
}

interface Livre {
  idLivre?: number;
  id?: number;
  titre: string;
  auteur?: string;
  urlPdf?: string;
  prix?: string;
  description?: string;
  image?: string;
}

export default function MainContentLivres({ darkMode, lang }: MainContentProps) {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [livres, setLivres] = useState<Livre[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({ titre: "", auteur: "", prix: "", description: "" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to normalize image paths coming from backend
  const normalizeImage = (raw: any) => {
    try {
      if (!raw) return "";
      const s = String(raw);
      if (s.startsWith("http://") || s.startsWith("https://")) return s;
      if (s.startsWith("/")) return `http://localhost:8000${s}`;
      return `http://localhost:8000/${s}`;
    } catch {
      return "";
    }
  };

  useEffect(() => {
    // fetch formations from backend
    const fetchFormations = async () => {
      try {
        const res = await fetch("http://localhost:8000/formation/ReadFormation");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.formations || [];
        const mapped = arr.map((f: any) => ({
          idFormation: f.idFormation ?? f.id ?? f.id_formation ?? 0,
          titre: f.titre ?? f.name ?? "Formation",
          description: f.description ?? "",
          image: normalizeImage(f.image),
        }));
        setFormations(mapped);
      } catch (err) {
        console.error("Erreur fetch formations:", err);
      }
    };
    fetchFormations();
  }, []);

  const fetchLivresForFormation = async (idFormation: number) => {
    try {
      const res = await fetch(`http://localhost:8000/livre/ReadLivresLocal/${idFormation}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.livres || [];
      const mapped = arr.map((l: any) => ({
        id: l.idLivre ?? l.id ?? l.idLivre ?? 0,
        titre: l.titre ?? l.title ?? "Livre",
        auteur: l.auteur ?? l.author ?? "",
        urlPdf: l.urlPdf ?? l.pdf ?? "",
        prix: l.prix ?? l.price ?? "",
        description: l.description ?? "",
        image: normalizeImage(l.image ?? l.cover ?? ""),
      }));
      setLivres(mapped);
    } catch (err) {
      console.error("Erreur fetch livres:", err);
      setLivres([]);
    }
  };

  const handleSelectFormation = (f: Formation) => {
    setSelectedFormation(f);
    fetchLivresForFormation(f.idFormation);
  };

  const handleBackToFormations = () => {
    setSelectedFormation(null);
    setLivres([]);
    setShowAddForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const openAddPopup = () => {
    setFormValues({ titre: "", auteur: "", prix: "", description: "" });
    setSelectedFile(null);
    setShowAddForm(true);
  };

  const addLivre = async () => {
    if (!selectedFormation) return;
    try {
      const body = new FormData();
      body.append("idFormation", String(selectedFormation.idFormation));
      body.append("titre", formValues.titre);
      body.append("auteur", formValues.auteur);
      body.append("description", formValues.description);
      body.append("prix", formValues.prix || "0");
      if (selectedFile) body.append("urlPdf", selectedFile);

      const res = await fetch("http://localhost:8000/livre/NewLivre/", {
        method: "POST",
        body,
      });
      const added = await res.json();
      // after add, refresh list
      await fetchLivresForFormation(selectedFormation.idFormation);
      setShowAddForm(false);
    } catch (err) {
      console.error("Erreur add livre:", err);
    }
  };

  const deleteLivre = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/livre/DeleteLivre/${id}`, { method: "DELETE" });
      if (selectedFormation) fetchLivresForFormation(selectedFormation.idFormation);
    } catch (err) {
      console.error(err);
    }
  };

  // Minimal edit: open a popup prefilled and submit via FormData to UpdateLivre/{id}
  const [editingLivre, setEditingLivre] = useState<Livre | null>(null);

  const openEdit = (l: Livre) => {
    setEditingLivre(l);
    setFormValues({ titre: l.titre, auteur: l.auteur || "", prix: l.prix || "", description: l.description || "" });
    setSelectedFile(null);
    setShowAddForm(true);
  };

  const submitEdit = async () => {
    if (!editingLivre) return;
    try {
      const body = new FormData();
      body.append("titre", formValues.titre);
      body.append("auteur", formValues.auteur);
      body.append("prix", formValues.prix || "0");
      body.append("description", formValues.description || "");
      if (selectedFile) body.append("image", selectedFile);
      // Update expects form fields - router uses UpdateLivre/{livre_id}
      await fetch(`http://localhost:8000/livre/UpdateLivre/${editingLivre.id}`, {
        method: "PUT",
        body,
      });
      if (selectedFormation) fetchLivresForFormation(selectedFormation.idFormation);
      setEditingLivre(null);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex-1 p-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen size={26} className={darkMode ? "text-[#17f]" : "text-[#17f]"} /> {lang === "fr" ? "Gestion des Livres" : "Books Management"}
        </h1>

        {!selectedFormation && null}
        {selectedFormation && (
          <div className="flex items-center gap-3">
            <button onClick={openAddPopup} className="flex items-center gap-2 bg-[#17f] text-white px-4 py-2 rounded-lg">
              <PlusCircle size={18} /> {lang === "fr" ? "Ajouter un Livre" : "Add Book"}
            </button>
          </div>
        )}
      </div>

      {/* Formations grid */}
      {!selectedFormation && (
        <>
          <h2 className="font-semibold mb-6 text-center text-2xl">{lang === "fr" ? "Choisir une Formation" : "Select a Formation"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-1">
            {formations.map((f) => (
              <div
                key={f.idFormation}
                onClick={() => handleSelectFormation(f)}
                className={`p-4 min-h-[220px] rounded-2xl cursor-pointer transition-shadow shadow-md flex flex-col overflow-hidden ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}
              >
                <div className="relative w-full h-40 mb-3">
                  {f.image ? (
                    <Image src={f.image} alt={f.titre} fill className="object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-3xl">{f.titre.charAt(0)}</div>
                  )}
                </div>
                <h3 className="font-bold text-lg">{f.titre}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Livres grid for selected formation */}
      {selectedFormation && (
        <>
          <button onClick={handleBackToFormations} className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700">
            <ChevronLeft size={20} /> {lang === "fr" ? "Retour aux formations" : "Back to formations"}
          </button>
          <h2 className="font-semibold mb-3">{lang === "fr" ? "Livres de la formation" : "Books in Formation"}: {selectedFormation.titre}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {livres.map((l) => (
              <div key={l.id} className={`rounded-2xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="relative w-full h-48 overflow-hidden">
                  {l.image ? (
                    <Image src={l.image} alt={l.titre} fill className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-2xl">{l.titre.charAt(0)}</div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openEdit(l)} className="p-1 rounded-full bg-white/80 hover:bg-white transition" title="Modifier">
                      <Edit size={16} className="text-[#17f]" />
                    </button>
                    <button onClick={() => deleteLivre(l.id!)} className="p-1 rounded-full bg-white/80 hover:bg-white transition" title="Supprimer">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#17f]">{l.titre}</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{l.description && l.description.length > 120 ? l.description.substring(0, 120) + "..." : l.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Popup Add / Edit livre */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="relative w-[95%] max-w-lg p-6 rounded-xl shadow-2xl bg-white text-gray-900">
            <h2 className="text-xl font-bold mb-4 text-center">{editingLivre ? "Modifier le livre" : "Ajouter un livre"}</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Titre" value={formValues.titre} onChange={(e) => setFormValues({ ...formValues, titre: e.target.value })} className="w-full px-3 py-2 rounded-lg border" />
              <input type="text" placeholder="Auteur" value={formValues.auteur} onChange={(e) => setFormValues({ ...formValues, auteur: e.target.value })} className="w-full px-3 py-2 rounded-lg border" />

              <input type="text" placeholder="Prix en Ariary" value={formValues.prix} onChange={(e) => setFormValues({ ...formValues, prix: e.target.value })} className="w-full px-3 py-2 rounded-lg border" />
              <textarea placeholder="Description" value={formValues.description} onChange={(e) => setFormValues({ ...formValues, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border" rows={4} />

               <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow">
                  <FileText size={20} />
                </div>
                <span className="text-[#17f]">{selectedFile ? selectedFile.name : "Importer un fichier PDF"}</span>
                <input ref={fileInputRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileChange} />
              </label>
               <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow">
                  <FileText size={20} />
                </div>
                <span className="text-[#17f]">{selectedFile ? selectedFile.name : "Importer un image"}</span>
                <input ref={fileInputRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => { setShowAddForm(false); setEditingLivre(null); }} className="px-5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg">Annuler</button>
                <button onClick={() => (editingLivre ? submitEdit() : addLivre())} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{editingLivre ? "Enregistrer" : "Ajouter"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
