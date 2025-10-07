"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import background from "@/app/assets/background.png";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    paymentMethod: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Inscription et paiement envoyés ! L’administrateur local validera votre compte.");
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      <div className="relative bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-2xl transition-all">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
          🧾 Inscription Étudiant
        </h1>

        {/* Indicateur d’étapes */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          {[1, 2].map((num) => (
            <div
              key={num}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= num
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-gray-400 text-gray-400"
              } font-bold text-lg relative`}
            >
              {step > num ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                num
              )}
            </div>
          ))}
        </div>

        {/* Contenu animé */}
        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400"
                  required
                />
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-3 mb-6 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400"
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
                  className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  Suivant <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-black font-semibold mb-2">
                  Choisissez un mode de paiement :
                </label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400"
                  required
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="carte_bancaire">Carte Bancaire</option>
                  <option value="autre">Autre</option>
                </select>

                <p className="text-gray-700 text-sm mt-4">
                  💡 Après paiement, votre inscription sera validée par l’administrateur local.
                </p>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                  >
                    <ArrowLeft className="w-5 h-5" /> Précédent
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <CheckCircle className="w-5 h-5" /> S’inscrire
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
