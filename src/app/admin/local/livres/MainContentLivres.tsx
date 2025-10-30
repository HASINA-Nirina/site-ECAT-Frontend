"use client";
import { useState } from "react";
import { BookOpen, PlusCircle, ChevronLeft, Edit, Trash2, FileText, Plus, PlusIcon, PlusSquareIcon, LucidePlusCircle } from "lucide-react";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Formation {
  id: number;
  name: string;
}

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  pdf: string;
  prix: string;
  description: string;
}

export default function MainContentLivres({ darkMode, lang }: MainContentProps) {
  const formations: Formation[] = [
    { id: 1, name: "Informatique" },
    { id: 2, name: "Mathématiques" },
    { id: 3, name: "Physique" },
  ];

  const livres: Livre[] = [
    { id: 1, titre: "Livre 1", auteur: "Auteur 1", pdf: "fiche1.pdf", prix: "10000", description: "Description 1" },
    { id: 2, titre: "Livre 2", auteur: "Auteur 2", pdf: "fiche2.pdf", prix: "12000", description: "Description 2" },
    { id: 3, titre: "Livre 3", auteur: "Auteur 3", pdf: "fiche3.pdf", prix: "15000", description: "Description 3" },
  ];

  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [showFormationList, setShowFormationList] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelectFormation = (f: Formation) => {
    setSelectedFormation(f);
    setShowFormationList(false);
  };

  const handleBackToFormations = () => {
    setShowFormationList(true);
    setSelectedFormation(null);
    setShowAddForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <main className="flex-1 p-6 relative">
      {/* TITRE */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen size={26} className={darkMode ? "text-[#17f]" : "text-[#17f]"}/> {lang === "fr" ? "Gestion des Livres" : "Books Management"}
        </h1>

        {!showFormationList && selectedFormation && (
          <button
            className="flex items-center gap-2 bg-[#7ebd01] hover:bg-[#bffe28] text-black px-4 py-2 rounded-lg shadow transition"
            onClick={() => setShowAddForm(true)}
          >
            <LucidePlusCircle size={18} /> {lang === "fr" ? "Ajouter un Livre" : "Add Book"}
          </button>
        )}
      </div>

      {/* ================= PAGE 1 : LISTE FORMATIONS ================= */}
      {showFormationList && (
  <>
    <h2 className="font-semibold mb-12 text-center text-2xl">
      {lang === "fr" ? "Choisir une Formation" : "Select a Formation"}
    </h2>
    <div className="h-6"></div> {/* Ligne vide */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-1 justify-items-center">
      {formations.map((f) => (
        <div
          key={f.id}
          className={`
            p-8 min-h-[180px] w-full max-w-xs rounded-xl cursor-pointer 
            transition-shadow shadow-md 
            ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-900 hover:bg-gray-100"} 
            flex flex-col items-center justify-center
            hover:shadow-xl
            border border-transparent hover:border-purple-500
          `}
          onClick={() => handleSelectFormation(f)}
        >
            <h3 className="font-bold text-2xl text-center">{f.name}</h3>
            </div>
        ))}
        </div>
    </>
    )}
    
      {/* ================= PAGE 2 : LIVRES FORMATION ================= */}
      {!showFormationList && selectedFormation && (
        <>
          <button
            onClick={handleBackToFormations}
            className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700"
          >
            <ChevronLeft size={20} /> {lang === "fr" ? "Retour aux formations" : "Back to formations"}
          </button>

          <h2 className="font-semibold mb-3">{lang === "fr" ? "Livres de la formation" : "Books in Formation"}: {selectedFormation.name}</h2>

          {/* FORMULAIRE D'AJOUT POPUP */}
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className={`w-full max-w-md p-8 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                <h3 className="text-2xl font-bold mb-6 text-center">{lang === "fr" ? "Ajouter un Livre" : "Add Book"}</h3>
                
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Titre"
                    className="w-full p-3 border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Auteur"
                    className="w-full p-3 border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  {/* Champ fichier avec icône */}            
                    <label className="flex items-center gap-3 cursor-pointer">
                    {/* bouton vert transformé en div pour déclencher input */}
                    <div className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow">
                        <FileText size={20} />
                    </div>
                    <span className="text-[#17f]">{selectedFile ? selectedFile.name : "Importer un fichier"}</span>
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    </label>
                  <input
                    type="text"
                    placeholder="Prix en Ariary"
                    className="w-full p-3 border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full p-3 border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  ></textarea>

                  <div className="flex gap-32 mt-4 justify-end">
                    <button
                      className="w-32 bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg shadow"
                      onClick={() => setShowAddForm(false)}
                    >
                      {lang === "fr" ? "Annuler" : "Cancel"}
                    </button>
                    <button className="w-32 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow">
                      {lang === "fr" ? "Ajouter" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRID Livres */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6`}>
            {livres.map((l) => (
              <div
                key={l.id}
                className={`p-4 rounded-lg shadow-md relative ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
              >
                <h2 className="font-semibold mb-2">Livre</h2>
                <p className="font-medium mb-1">Titre: {l.titre}</p>
                <p className="text-sm mb-1">Auteur: {l.auteur}</p>
                <p className="text-sm mb-1">PDF: {l.pdf}</p>
                <p className="text-sm mb-1">Prix: {l.prix}</p>
                <p className="text-sm mb-6">Description: {l.description}</p>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                  <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
