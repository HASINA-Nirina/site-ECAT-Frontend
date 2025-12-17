"use client";

import { useState,useEffect } from "react";
import Image from "next/image";
import { User, Lock, Save, Eye, EyeOff,XIcon, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";


interface MainContentProps {
  readonly darkMode: boolean;
}


export default function MainContent({ darkMode }: MainContentProps) {
  const [profile, setProfile] = useState({
    id: null as number | null,
    nom: "",
    prenom: "",
    email: "",
    universite: "",
    image:  "",
  });
  const [showMessage, setShowMessage] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Non autorisé");
  
        const data = await res.json();
        localStorage.setItem("id", data.id);
        setProfile({
          id: data.id ?? null,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          universite:  `Université ECAT Taratra ${data.province}`,
          image: data.image,
        });
      } catch  {
        console.error("Utilisateur inconnu");  
      }
    };

    fetchProfile();
  }, []);

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

  const verifyOldPassword = async () => {
    const Id = localStorage.getItem("id");
    const res = await fetch("http://localhost:8000/auth/verifyOldPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Id,
         mot_de_passe: passwordData.current }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || "Erreur lors de la vérification du mot de passe");
    }

    return await res.json();
};

const updatePassword = async () => {
  
  const userId = profile.id ?? (await fetch("http://localhost:8000/auth/me", { credentials: "include" }).then(r => r.ok ? r.json().then(d => d.id) : null));
  if (!userId) throw new Error("Impossible d'identifier l'utilisateur pour la mise à jour du mot de passe");

  const res = await fetch("http://localhost:8000/auth/modifPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userId, mot_de_passe: passwordData.new }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Erreur lors de la modification du mot de passe");
  }

  return await res.json();
};



const handlePasswordChange = async () => {
  if (passwordData.new !== passwordData.confirm) {
    setPopup({ type: "error", message: "Les nouveaux mots de passe ne correspondent pas !" });
    return;
  }

  try {
    // 1️ Vérifier l'ancien mot de passe
    await verifyOldPassword();
    
    // 2️ Modifier le mot de passe
    const result = await updatePassword();
    console.log("Résultat du backend:", result);

    setPopup({ type: "success", message: "Mot de passe modifié avec succès !" });
    handleCancel(); // réinitialiser les champs
  } catch (err: unknown) {
    // Afficher un message plus explicite si l'ancien mot de passe est incorrect
    let msg = "";
    if (err instanceof Error) {
      msg = err.message;
    } else {
      msg = String(err);
    }

    if (msg.includes("Mot de passe incorrect") || msg.toLowerCase().includes("incorrect")) {
      setPopup({ type: "error", message: "Ancien mot de passe incorrect !" });
    } else {
      setPopup({ type: "error", message: msg || "Erreur lors de la modification du mot de passe" });
    }
  }
};

// 🔔 Popup Notification avec bouton OK
const Popup = ({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div
        className={`w-[20%] max-w-md rounded-lg shadow-lg p-5 animate-popup 
          ${type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}
      >

        {/* Bloc icône + texte sur la même ligne */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {type === "success" ? (
            <CheckCircle size={32} />
          ) : (
            <XCircle size={32} />
          )}
          <h2 className="text-xl font-bold">{type === "success" ? "Succès" : "Erreur"}</h2>
        </div>

        {/* Message centré */}
        <p className="mb-4 text-center">{message}</p>

        {/* Bouton OK */}
        <button
          onClick={onClose}
          className="px-10 py-2 mx-auto block bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
        >
          OK
        </button>
      </div>

      <style jsx>{`
        @keyframes popup {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-popup {
          animation: popup 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

const [popup, setPopup] = useState<{
  type: "success" | "error" | null;
  message: string;
}>({ type: null, message: "" });



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
  <div className=" relative overflow-hidden w-10 h-10 sm:w-28 sm:h-28 rounded-full border-4 border-blue-400 shadow-md flex items-center justify-center mt-1 sm:-mt-10 bg-gray-100 sm:text-5xl font-bold">
    {profile.image ? (
      // Si image existe
      <Image src={profile.image} alt="Profil" fill className="rounded-full object-cover"/>
    ) : (
      // Sinon afficher le premièr lettres du prénom
      <span className="text-blue-400 text-xl sm:text-2xl font-bold">
        {profile.prenom?.substring(0, 1).toUpperCase()}
      </span>
    )}
  </div>
</div>
</div>

      {/* Profil  */}
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

              value={profile.nom|| ""}
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
              value={profile.prenom|| ""}
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
              value={profile.email|| ""}
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
              value={profile.universite|| ""}
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
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
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
      {popup.type && (
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: null, message: "" })}
      />
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
