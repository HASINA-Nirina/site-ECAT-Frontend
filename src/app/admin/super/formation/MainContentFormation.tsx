"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PlusCircle,
  X,
  ImageIcon,
  BookOpen,
  Edit,
  Trash2,
  ClipboardList,
} from "lucide-react";

import Image from "next/image";


interface Formation {
  id: number;
  titre: string;
  description: string;
  image: string;
  filename?: string;
}

interface Props {
  darkMode: boolean;
}

export default function GererFormation({ darkMode }: Props) {
  const [formations, setFormations] = useState<Formation[]>([]);
  const ListeFormation = async () => {
    try {
      const res = await fetch("http://localhost:8000/formation/ReadFormation");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.formations || [];
      const formatted = arr.map((f: any) => {
        let imageUrl = "";
        try {
          if (f && f.image) {
            const raw = String(f.image);
            if (raw.startsWith("http://") || raw.startsWith("https://")) {
              imageUrl = raw;
            } else if (raw.startsWith("/")) {
              imageUrl = `http://localhost:8000${raw}`;
            } else {
              // valeur inattendue, ignorer
              imageUrl = "";
            }
          }
        } catch {
          imageUrl = "";
        }

        return {
          id: f.idFormation,
          titre: f.titre,
          description: f.description,
          image: imageUrl,
          filename: f.filename || "",
        };
      });
      setFormations(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  // Recuperer les formations
  useEffect(() => {
    ListeFormation();
  }, []);


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editFormation, setEditFormation] = useState<Formation | null>(null);
  const [newFormation, setNewFormation] = useState({
    titre: "",
    description: "",
    image: "",
    filename: "",
    imageFile: null as File | null, // nouveau champ pour upload
  });

  const [deleteFormation, setDeleteFormation] = useState<Formation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddPopup = () => {
    setNewFormation({ titre: "", description: "", image: "", filename: "", imageFile: null });
    setEditFormation(null);
    setIsPopupOpen(true);
  };

  const handleAddOrEditFormation = async () => {
    if (!newFormation.titre) return;
  
    try {
      // ---- MODIFICATION ----
      if (editFormation) {
        const res = await fetch(
          `http://localhost:8000/formation/UpdateFormation/${editFormation.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              titre: newFormation.titre,
              description: newFormation.description,
              image: newFormation.image, // pour JSON, pas d'imageFile
            }),
          }
        );
        await res.json();
        await ListeFormation();
      } else {
       // ---- AJOUT ----
        const formData = new FormData();
        formData.append("titre", newFormation.titre);
        formData.append("description", newFormation.description);
        if (newFormation.imageFile) {
          formData.append("image", newFormation.imageFile);
        }

        // fetch directement avec formData
        const res = await fetch("http://localhost:8000/formation/NewFormation", {
          method: "POST",
          body: formData, // pas besoin de Content-Type ici
        });

        const added = await res.json();
  
        // Créer l’objet formation pour l’état
        const newFormationItem: Formation = {
          id: added.idFormation,
          titre: added.titre,
          description: added.description,
          image: added.image ? `http://localhost:8000${added.image}` : "",
          filename: added.filename || "",
        };
      }
  
      // Réinitialiser popup et formulaire
      setIsPopupOpen(false);
      setNewFormation({
        titre: "",
        description: "",
        image: "",
        filename: "",
        imageFile: null,
      });
      await ListeFormation();
    } catch (error) {
      console.error("Erreur ajout/modification formation :", error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFormation({
        ...newFormation,
        filename: file.name,
        image: URL.createObjectURL(file), 
        imageFile: file, 
      });
    }
  };

  const handleEdit = (formation: Formation) => {
    setEditFormation(formation);
    setNewFormation({
      titre: formation.titre,
      description: formation.description,
      image: formation.image,
      filename: formation.filename || "",
      imageFile: null,
    });
    setIsPopupOpen(true);
  };

  const handleDelete = (formation: Formation) => setDeleteFormation(formation);

  const confirmDelete = async () => {
    if (!deleteFormation) return;
    try {
      await fetch(
        `http://localhost:8000/formation/DeleteFormation/${deleteFormation.id}`,
        { method: "DELETE" }
      );
      setFormations((prev) => prev.filter((f) => f.id !== deleteFormation.id));
      setDeleteFormation(null);
      ListeFormation();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`relative p-6 rounded-xl transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-[#17f]" size={28} />
          <h1 className="text-2xl font-bold">Gérer les formations</h1>
        </div>

        <button
          onClick={openAddPopup}
          className="flex items-center gap-2 px-4 py-2 bg-[#17f] text-white font-semibold rounded-lg shadow-md hover:bg-[#005be6] transition"
        >
          <PlusCircle size={20} />
          <span>Ajouter une formation</span>
        </button>
      </div>
     {formations.length === 0 ? (
  <p className="text-center text-gray-500 italic">
    Aucune formation ajoutée pour le moment.
  </p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {formations.map((formation) => (
      <div
        key={formation.id}
        className={`rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02] hover:shadow-2xl relative ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="relative w-full h-48 overflow-hidden">
          {formation.image ? (
            <Image
                src={formation.image}
                alt={formation.titre}
                width={400}      // largeur fixe ou responsive
                height={250}     // hauteur fixe ou responsive
                className="object-cover w-full h-full"
              />
          ) : (
            <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-2xl">
            {formation.titre ? formation.titre.charAt(0).toUpperCase() : ""}

            </div>
          )}         {/* Modifier / Supprimer overlay */}

                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(formation)}
                    className="p-1 rounded-full bg-white/80 hover:bg-white transition"
                    title="Modifier"
                  >
                    <Edit size={16} className="text-[#17f]" />
                  </button>
                  <button

                      onClick={() => handleDelete(formation)}
                      className="p-1 rounded-full bg-white/80 hover:bg-white transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-[#17f]">
                  {formation.titre}
                </h2>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >

                  {formation.description && formation.description.length > 120
                    ? formation.description.substring(0, 120) + "..."
                    : formation.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup ajout / modification */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            // Ajout du flou ici
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsPopupOpen(false)}
          />
          <div
            className={`relative w-[95%] max-w-lg p-6 rounded-xl shadow-2xl ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              {editFormation ? "Modifier la formation" : "Ajouter une nouvelle formation"}
            </h2>

            <div className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold mb-1">Titre</label>
                <input
                  type="text"
                  value={newFormation.titre}
                  onChange={(e) =>
                    setNewFormation({ ...newFormation, titre: e.target.value })
                  }
                  placeholder="Ex : Programmation Python avancée"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#17f] ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ImageIcon size={48} className="text-[#19ff11]" />
                  <span className="truncate">
                    {newFormation.filename || "Cliquez ici pour choisir un fichier..."}
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Description
                </label>
                <textarea
                  value={newFormation.description}
                  onChange={(e) =>
                    setNewFormation({
                      ...newFormation,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Décrivez brièvement la formation..."
                  className={`w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-[#17f] ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Boutons Annuler / Ajouter Modifier */}
              <div className="flex justify-end gap-4 mt-4"> {/* Ajustement du gap et inversion des boutons */}
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition" // Pas besoin de hover:bg-red-700 si bg-red-600 est déjà là
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddOrEditFormation}
                  className="px-5 py-2 bg-[#17f] hover:bg-[#0063ff] text-white rounded-lg font-semibold shadow-md transition"
                >
                  {editFormation ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup suppression */}
      {deleteFormation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            // Ajout du flou ici
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteFormation(null)} 
          />
          <div
            className={`relative w-[90%] max-w-sm p-6 rounded-xl shadow-2xl ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-bold mb-4 text-center">
              Confirmer la suppression
            </h2>
            <p className="mb-6 text-center">
              Voulez-vous vraiment supprimer la formation{" "}
              <span className="font-semibold">{deleteFormation.titre}</span> ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteFormation(null)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Non
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}