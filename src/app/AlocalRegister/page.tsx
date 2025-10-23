"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import background from "@/app/assets/background.png";

const InscriptionAdminLocal = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [antenne, setAntenne] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification basique
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/AdminLocalRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom,
          prenom: prenom,
          email: email,
          mot_de_passe: password,
          province: antenne,
          role: "Admin Local",
        }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        setMessage("✅ Votre demande d’inscription a été envoyée. En attente de validation.");
        console.log("Demande d'inscription :", data);

        // (Optionnel) rediriger vers /login après 3s
        // setTimeout(() => router.push("/login"), 3000);
      } else if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage("❌ Une erreur inconnue est survenue.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("❌ Impossible de contacter le serveur. Vérifiez votre connexion.");
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay blanc pour effet flou */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Contenu du formulaire */}
      <div className="relative z-10 w-full max-w-lg bg-white/90 p-8 rounded-2xl shadow-lg mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Inscription - Admin Local
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

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

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Créer mon compte
          </button>

          {message && (
            <p className="text-center mt-4 text-purple-700 font-medium">
              {message}
            </p>
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