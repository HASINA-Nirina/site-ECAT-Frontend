"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";

const RegisterPage = () => {
  const [step, setStep] = useState(1); // Étape actuelle
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    paymentMethod: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulaire soumis:", form);
    alert("Inscription et paiement envoyés ! L’administrateur local validera votre compte.");
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Overlay blanc pour lisibilité */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          {step === 1 ? "Étape 1 : Informations personnelles" : "Étape 2 : Paiement"}
        </h1>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={form.lastName}
                onChange={handleChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="">Sélectionnez votre ville</option>
                <option value="Antananarivo">Antananarivo</option>
                <option value="Fianarantsoa">Fianarantsoa</option>
                <option value="Toliara">Toliara</option>
                <option value="Mahajanga">Mahajanga</option>
                <option value="Toamasina">Toamasina</option>
              </select>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Suivant →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <label className="block text-black font-semibold mb-2">
                  Choisissez un mode de paiement :
                </label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="carte_bancaire">Carte Bancaire</option>
                  <option value="autre">Autre</option>
                </select>

                <p className="text-gray-700 text-sm mb-4">
                  💡 Le paiement via Mobile Money est sécurisé. Après paiement, l’administrateur local confirmera votre inscription.
                </p>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                  >
                    ← Précédent
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                  >
                    S’inscrire
                  </button>
                </div>
              </div>
            </>
          )}
        </form>

        {/* Indicateur de progression */}
        <div className="mt-6 flex justify-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              step === 1 ? "bg-purple-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full ${
              step === 2 ? "bg-purple-600" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
