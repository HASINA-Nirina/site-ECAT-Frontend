"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import background from "@/app/assets/background.png";
import { Eye, EyeOff } from "lucide-react";

const InscriptionAdminLocal = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [antenne, setAntenne] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
       setSuccess(null);
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      setSuccess(false); // rouge
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/AdminLocalRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          mot_de_passe: password,
          province: antenne,
          role: "Admin Local",
          statut: "en attente",
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessage(" Votre demande d’inscription a été envoyée. En attente de validation.");
        setSuccess(true); // vert
      } else if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage(" Une erreur inconnue est survenue.");
        setSuccess(false); // rouge
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage(" Impossible de contacter le serveur. Vérifiez votre connexion.");
      setSuccess(false); // rouge
    }
  };

  // Formater le texte pour Nom et Prénom
  const formatName = (text: string) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/90 p-8 rounded-2xl shadow-lg mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Inscription - Admin Local
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Nom */}
          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(formatName(e.target.value))}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Prénom */}
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(formatName(e.target.value))}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Antenne */}
          <select
            value={antenne}
            onChange={(e) => setAntenne(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">-- Sélectionnez une antenne --</option>
            <option value="Antananarivo">Antananarivo</option>
            <option value="Fianarantsoa">Fianarantsoa</option>
            <option value="Toamasina">Toamasina</option>
            <option value="Toliara">Toliara</option>
            <option value="Mahajanga">Mahajanga</option>
            <option value="Antsiranana">Antsiranana</option>
          </select>

          {/* Mot de passe */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <Eye
              size={20}
              className="absolute right-3 top-3 text-purple-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Confirmer mot de passe */}
          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <Eye
              size={20}
              className="absolute right-3 top-3 text-purple-600 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Créer mon compte
          </button>

           {/* ✅ Message de succès / erreur */}
        {message && (
          <div
            className={`flex justify-center items-center mt-4 font-medium text-center ${
              success === true
                ? "text-green-600"
                : success === false
                ? "text-red-600"
                : message.toLowerCase().includes("en attente")
                ? "text-yellow-600"
                : "text-red-700"
            }`}
          >
            {message}
          </div>
        )}

          <p className="text-center text-black mt-6">
            Déjà un compte ?{" "}
            <a href="/login" className="text-purple-700 font-semibold hover:underline">
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default InscriptionAdminLocal;
