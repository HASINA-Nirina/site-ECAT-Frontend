"use client";

import React, { useState, Suspense } from "react";
import background from "@/app/assets/background.png";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import {useSearchParams} from "next/navigation";
import { apiFetch } from "@/lib/api";

const NewPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams(); 
  const email = searchParams.get("email");

  const [popup, setPopup] = useState<{ type: "success" | "error" | null; message: string }>({
  type: null,
  message: "",
});

const Popup = ({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) => {
  const handleClose = () => {
    onClose();
    if (type === "success") {
      window.location.href = "/login"; // redirection automatique après succès
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
      <div
        className={`w-[16%] max-w-sm rounded-lg shadow-lg p-5 flex flex-col items-center animate-popup 
          ${type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}
      >
        <div className="flex items-center gap-2 mb-2">
          {type === "success" ? (
            <CheckCircle size={24} className="text-white" />
          ) : (
            <XCircle size={24} className="text-white" />
          )}
          <h2 className="text-lg font-bold">{type === "success" ? "Succès" : "Erreur"}</h2>
        </div>
        <p className="text-center mb-4">{message}</p>
        <button
          onClick={handleClose}
          className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Vérification mot de passe
  if (password !== confirmPassword) {
    setError("❌ Les mots de passe ne correspondent pas.");
    return;
  }

  if (password.length < 6) {
    setError("⚠️ Le mot de passe doit contenir au moins 6 caractères.");
    return;
  }

  if (!email) {
    setError("❌ Email manquant !");
    return;
  }

  try {
    // Récupérer l'id utilisateur correspondant à l'email via l'API des étudiants
    const etuRes = await apiFetch("/auth/ReadUser?email=${email}");


    const etuList = await etuRes.json();
    

    const res = await apiFetch("/auth/modifPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: etuList.id,
        mot_de_passe: password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setPopup({ type: "success", message: data.message || data.success || "Mot de passe modifié" });
    } else {
      setPopup({ type: "error", message: data.detail || data.error || JSON.stringify(data) });
    }
  } catch (err) {
    console.error(err);
    alert("Erreur d'envoi des données.");
  }
};

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay flou */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Contenu principal */}
      <div className={`relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4 transition-all duration-300 ${popup.type ? "blur-sm pointer-events-none" : ""}`}>
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Entrez votre nouveau mot de passe
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Champ nouveau mot de passe */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-purple-600"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Champ confirmation */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-3 text-purple-600"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Message d’erreur */}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          {/* Bouton Confirmer */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Confirmer
          </button>
        </form>

        <p className="text-center text-black mt-4">
          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="text-purple-700 font-semibold hover:underline text-sm"
          >
            Retour à la connexion
          </button>
        </p>
      </div>
      {popup.type && (
      <Popup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: null, message: "" })}
      />
    )}
    </section>
  );
};

const NewPasswordPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <NewPasswordForm />
  </Suspense>
);

export default NewPasswordPage;
