"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const InscriptionAdminLocal = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [antenne, setAntenne] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    // Simulation backend (on fera la vraie API plus tard)
    console.log("Demande d'inscription :", { nom, email, password, antenne });
    setMessage("✅ Votre demande d’inscription a été envoyée. En attente de validation.");

    // Rediriger vers /login après 3 secondes
    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Inscription - Admin Local
        </h1>

        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          required
        />

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          required
        />

        <select
          value={antenne}
          onChange={(e) => setAntenne(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
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
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          required
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Créer mon compte
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-purple-600 font-medium">
            {message}
          </p>
        )}

        <p className="text-center text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <a href="/login" className="text-purple-600 font-semibold hover:underline">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
};

export default InscriptionAdminLocal;
