"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { BookOpen, PlusCircle, ChevronLeft, Edit, Trash2, FileText, ImageIcon, MessageCircle } from "lucide-react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";
import { apiFetch } from "@/lib/api";
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
  const [deletingLivre, setDeletingLivre] = useState<Livre | null>(null);
  const [showMessage, setShowMessage] = useState(false);


 // fichiers séparés
const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
const [selectedImage, setSelectedImage] = useState<File | null>(null);

// valeurs du formulaire
const [formValues, setFormValues] = useState({ titre: "", auteur: "", prix: "", description: "" });

// refs séparées pour déclencher les input file
const pdfInputRef = useRef<HTMLInputElement | null>(null);
const imageInputRef = useRef<HTMLInputElement | null>(null);


  // Helper to normalize image paths coming from backend
  const normalizeImage = (raw: any): string => {
    try {
      if (!raw) return "";
  
      const s = String(raw).trim();
      
      // 1. Si c'est déjà une URL complète ou un blob, on ne touche à rien
      if (s.startsWith("blob:") || s.startsWith("http://") || s.startsWith("https://")) {
        return s;
      }
  
      // 2. On récupère l'URL de base depuis le .env
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
      // 3. On construit l'URL proprement en gérant le slash
      if (s.startsWith("/")) {
        return `${baseUrl}${s}`;
      }
      
      return `${baseUrl}/${s}`;
  
    } catch {
      return "";
    }
  };
  
  // fetch formations from backend
  const fetchFormations = useCallback(async () => {
    try {
      const res = await apiFetch("/formation/ReadFormation");
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
  }, []);

  const fetchLivresForFormation = useCallback(async (idFormation: number) => {
    try {
      const res = await apiFetch(`/livre/ReadLivresLocal/${idFormation}`);
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
  }, []);

  useEffect(() => {
    // Fonction asynchrone à l'intérieur
    const loadLivres = async () => {
      if (selectedFormation) {
        await fetchLivresForFormation(selectedFormation.idFormation);
      }
    };

    loadLivres();
  }, [selectedFormation, fetchLivresForFormation]); 

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  const handleSelectFormation = (f: Formation) => {
    setSelectedFormation(f);
    fetchLivresForFormation(f.idFormation);
  };

  const handleBackToFormations = () => {
    setSelectedFormation(null);
    setLivres([]);
    setShowAddForm(false);
  };

  const openAddPopup = () => {
  setFormValues({ titre: "", auteur: "", prix: "", description: "" });
  setSelectedPDF(null);
  setSelectedImage(null);
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
    if (selectedPDF) body.append("urlPdf", selectedPDF);
    if (selectedImage) body.append("image", selectedImage);  

    const res = await apiFetch("/livre/NewLivre/", {
      method: "POST",
      body,
    });
    await res.json();
    // after add, refresh list
    await fetchLivresForFormation(selectedFormation.idFormation);
    
    // reset form
    setShowAddForm(false);
    setSelectedPDF(null);
    setSelectedImage(null);
    setFormValues({ titre: "", auteur: "", prix: "", description: "" });
  } catch (err) {
    console.error("Erreur add livre:", err);
  }
};


  // Minimal edit: open a popup prefilled and submit via FormData to UpdateLivre/{id}
  const [editingLivre, setEditingLivre] = useState<Livre | null>(null);

 const openEdit = (l: Livre) => {
  setEditingLivre(l);
  setFormValues({ titre: l.titre, auteur: l.auteur || "", prix: l.prix || "", description: l.description || "" });
  setSelectedPDF(null);  
  setSelectedImage(null);
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
    if (selectedPDF) body.append("urlPdf", selectedPDF);
    if (selectedImage) body.append("image", selectedImage);

    await apiFetch(`/livre/UpdateLivre/${editingLivre.id}`, {
      method: "PUT",
      body,
    });
    if (selectedFormation) fetchLivresForFormation(selectedFormation.idFormation);
    setEditingLivre(null);
    setShowAddForm(false);
    setSelectedPDF(null);
    setSelectedImage(null);
  } catch (err) {
    console.error(err);
  }
};
// Gérer le fichier PDF
const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) setSelectedPDF(file);
};

// Gérer le fichier image
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) setSelectedImage(file);
};
const deleteLivre = async (idLivre: number) => {
  if (!idLivre) return;

  // Confirmation visuelle
 

  try {
    const res = await apiFetch(`/livre/DeleteLivre/${idLivre}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erreur suppression livre");
      return;
    }

    // Recharger la liste après suppression
    if (selectedFormation) {
      await fetchLivresForFormation(selectedFormation.idFormation);
    }
  } catch (err) {
    console.error("Erreur deleteLivre :", err);
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
                className={`p-4 min-h-[220px] rounded-2xl  cursor-pointer transition-shadow shadow-md flex flex-col overflow-hidden ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}
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
              <div key={l.id} className={`rounded-2xl overflow-hidden shadow-lg border-l-6 border-[#17f] ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="relative w-full h-40 overflow-hidden">
                  {l.image ? (
                    <Image src={l.image} alt={l.titre} fill className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-2xl">{l.titre.charAt(0)}</div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openEdit(l)} className="p-1 rounded-full bg-white/80 hover:bg-white transition" title="Modifier">
                      <Edit size={16} className="text-[#17f]" />
                    </button>
                    <button
                      onClick={() => setDeletingLivre(l)}
                      className="p-1 rounded-full bg-white/80 hover:bg-white transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>

                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-[#17f]">{l.titre}</h3>

                  {l.auteur && (
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-semibold">Auteur :</span> {l.auteur}
                    </p>
                  )}

                  {l.prix && (
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-semibold">Prix :</span> {l.prix} Ar
                    </p>
                  )}

                  {l.urlPdf && (
                    <div className="flex items-center gap-2 text-[#17f] font-semibold mt-1">
                      <FileText size={16} /> {/* Icône représentant un fichier */}
                      <span className="truncate">{l.urlPdf.split("/").pop()}</span>
                    </div>
                  )}

                  {l.description && (
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {l.description.length > 120 ? l.description.substring(0, 120) + "..." : l.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Popup Add / Edit livre */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

         {/* Fond semi-transparent avec blur */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => { setShowAddForm(false); setEditingLivre(null); }}
        />

           <div className={`relative w-[95%] max-w-lg p-6 rounded-xl shadow-2xl transition-colors
             ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <h2 className="text-xl font-bold mb-4 text-center">{editingLivre ? "Modifier le livre" : "Ajouter un livre"}</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Titre" value={formValues.titre} onChange={(e) => setFormValues({ ...formValues, titre: e.target.value })} 
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#17f]
                ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`}
              />
              <input type="text" placeholder="Auteur" value={formValues.auteur} onChange={(e) => setFormValues({ ...formValues, auteur: e.target.value })} 
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#17f]
                ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`}/>

              <input type="text" placeholder="Prix en Ariary" value={formValues.prix} onChange={(e) => setFormValues({ ...formValues, prix: e.target.value })} 
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#17f]
                ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`}/>
              <textarea placeholder="Description" value={formValues.description} onChange={(e) => setFormValues({ ...formValues, description: e.target.value })} 
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#17f]
                ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`} rows={4} />
             {/* Importer un PDF */}
              <div>
              <label className="block text-sm font-semibold mb-1">Importer un PDF</label>
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <FileText size={48} className="text-[#19ff11]" />
                  <span className="truncate">
                    {selectedPDF ? selectedPDF.name : "Cliquez pour importer le PDF"}
                  </span>
                </div>
                <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePDFChange}/>
            </div>

              {/* Importer une image */}
              <div>
                  <label className="block text-sm font-semibold mb-1">Importer une image</label>
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <ImageIcon size={48} className="text-[#19ff11]" /> {/* ou ImageIcon si tu préfères */}
                    <span className="truncate">
                      {selectedImage ? selectedImage.name : "Cliquez pour importer une image"}
                    </span>
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => { setShowAddForm(false); setEditingLivre(null); }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => (editingLivre ? submitEdit() : addLivre())}
                    className="px-5 py-2 bg-[#17f] hover:bg-[#0063ff] text-white rounded-lg font-semibold shadow-md transition"
                  >
                    {editingLivre ? "Enregistrer" : "Ajouter"}
                  </button>
                </div>
            </div>
          </div>
         </div>
      )}
      {deletingLivre && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Fond semi-transparent */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setDeletingLivre(null)}
        />

        {/* Modal */}
        <div className={`relative w-[90%] max-w-md p-6 rounded-xl shadow-2xl
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
          <h2 className="text-xl font-bold mb-4 text-center">Supprimer le livre ?</h2>
          <p className="text-center mb-6">
            Voulez-vous vraiment supprimer le livre <span className="font-semibold">{deletingLivre.titre}</span> ?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setDeletingLivre(null)}
              className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-black rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                if (deletingLivre?.id) {
                  await deleteLivre(deletingLivre.id);
                  setDeletingLivre(null);
                }
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    )}
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
