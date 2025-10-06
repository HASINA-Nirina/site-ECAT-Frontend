"use client"; // obligatoire pour utiliser useState, useEffect, etc.

import React, { useState } from "react";
import background from "@/app/assets/background.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay blanc pour lisibilité */}
      <div className="absolute inset-0 bg-white/70"></div>

      {/* Formulaire */}
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-black mt-4">
          Pas encore de compte ?{" "}
          <a
            href="/signup"
            className="text-purple-700 font-semibold hover:underline"
          >
            S&apos;inscrire
          </a>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
