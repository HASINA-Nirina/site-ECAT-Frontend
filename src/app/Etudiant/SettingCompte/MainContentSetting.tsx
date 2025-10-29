"use client";

import { useState } from "react";
import { User, Lock, Save, Eye, EyeOff, X, XIcon } from "lucide-react";
import Image from "next/image";


interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [profile, setProfile] = useState({
    nom: "Rakoto",
    prenom: "Hasina",
    email: "hasina@example.com",
    universite: "Université ECAT Taratra",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("Les nouveaux mots de passe ne correspondent pas !");
      return;
    }
    alert("Mot de passe modifié avec succès !");
  };

  const handleCancel = () => {
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <main className={`flex-1 p-6 ${bgClass}`}>
     {/* Titre principal à gauche + image de profil centrée */}
<div className="flex flex-col mb-2">
  {/* Titre aligné à gauche */}
  <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
    <User size={26} style={{ color: "#17f" }} />
    Votre profil du compte
  </h1>

  {/* Image de profil centrée avec espace responsive */}
  <div className="flex justify-center">
    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-blue-400 shadow-md flex items-center justify-center mt-1 sm:-mt-10">
      {/* Cercle vide avec icône utilisateur */}
      <User size={36} className="text-blue-400" />
    </div>
  </div>
</div>



      {/* Profil étudiant */}
      <div
        className={`p-6 rounded-xl border ${borderClass} ${cardClass} shadow-sm hover:shadow-lg transition mb-8`}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="text-yellow-500" /> Informations du compte
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm opacity-80 mb-1">Nom</label>
            <input
              type="text"
              value={profile.nom}
              readOnly
              className={`w-full p-2 rounded-lg border ${borderClass} ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } focus:outline-none`}
            />
          </div>
          <div>
            <label className="block text-sm opacity-80 mb-1">Prénom</label>
            <input
              type="text"
              value={profile.prenom}
              readOnly
              className={`w-full p-2 rounded-lg border ${borderClass} ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm opacity-80 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className={`w-full p-2 rounded-lg border ${borderClass} ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm opacity-80 mb-1">Université</label>
            <input
              type="text"
              value={profile.universite}
              readOnly
              className={`w-full p-2 rounded-lg border ${borderClass} ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Changement de mot de passe */}
      <div
        className={`p-6 rounded-xl border ${borderClass} ${cardClass} shadow-sm hover:shadow-lg transition`}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="text-red-500" /> Modifier le mot de passe
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["current", "new", "confirm"].map((field, index) => {
            const label =
              field === "current"
                ? "Mot de passe actuel"
                : field === "new"
                ? "Nouveau mot de passe"
                : "Confirmer le nouveau mot de passe";

            return (
              <div
                key={index}
                className={field === "confirm" ? "sm:col-span-2 relative" : "relative"}
              >
                <label className="block text-sm opacity-80 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPassword[field as keyof typeof showPassword] ? "text" : "password"}
                    value={passwordData[field as keyof typeof passwordData]}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        [field]: e.target.value,
                      })
                    }
                    placeholder="********"
                    className={`w-full p-2 pr-10 rounded-lg border ${borderClass} ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-violet-500"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        [field]: !showPassword[field as keyof typeof showPassword],
                      })
                    }
                  >
                    {showPassword[field as keyof typeof showPassword] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            <XIcon size={18} /> Annuler
          </button>
          <button
            onClick={handlePasswordChange}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            <Save size={18} /> Enregistrer
          </button>
        </div>
      </div>
    </main>
  );
}
