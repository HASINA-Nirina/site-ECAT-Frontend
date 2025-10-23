"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";
import { Eye, EyeOff } from "lucide-react";
import {useSearchParams} from "next/navigation";

const NewPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams(); 
  const email = searchParams.get("email");

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas.");
      return;
    } 
    
    if (password.length < 6) {
      setError("⚠️ Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    try {
          const res = await fetch("http://127.0.0.1:8000/auth/modifPassword",{ 
            method : "POST",
            headers : {"Content-type": "application/json"},
            body :JSON.stringify({
              email: email,
              mot_de_passe: password,

            })
     })
     const data = await res.json();
     if (data.success){
            alert("✅ Mot de passe modifié avec succès !");
             window.location.href = "/login";
     }
     else {
      alert("Erreur")
      alert(`❌ ${data.message}`);
     }
    }
    catch (err){
         alert("Erreu d'envoi ");
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
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4">
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
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Message d’erreur */}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* Bouton Confirmer */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
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
    </section>
  );
};

export default NewPasswordPage;
