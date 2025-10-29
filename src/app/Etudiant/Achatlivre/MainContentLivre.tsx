/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { BookOpen, ChevronLeft, ShoppingCart, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Formation {
  id: number;
  name: string;
  image?: string;
}

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  pdf: string;
  prix: string;
  description: string;
  locked: boolean;
}

export default function MainContentAchat({ darkMode, lang }: MainContentProps) {
  const formations: Formation[] = [
    { id: 1, name: "Informatique", image: "https://source.unsplash.com/400x300/?computer" },
    { id: 2, name: "Mathématiques", image: "https://source.unsplash.com/400x300/?math" },
    { id: 3, name: "Physique", image: "https://source.unsplash.com/400x300/?physics" },
  ];

  const livres: Livre[] = [
    { id: 1, titre: "Livre 1", auteur: "Auteur 1", pdf: "fiche1.pdf", prix: "10000", description: "Description 1", locked: true },
    { id: 2, titre: "Livre 2", auteur: "Auteur 2", pdf: "fiche2.pdf", prix: "12000", description: "Description 2", locked: true },
    { id: 3, titre: "Livre 3", auteur: "Auteur 3", pdf: "fiche3.pdf", prix: "15000", description: "Description 3", locked: true },
  ];

  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedLivre, setSelectedLivre] = useState<Livre | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    paymentMethod: "airtel",
    mobileNumber: "",
  });

  const [phoneError, setPhoneError] = useState("");

  // ✅ Gestion téléphone internationale avec typage
  const handlePhoneChange = (value: string, data: CountryData) => {
    const formattedValue = value.startsWith("+") ? value : "+" + value;
    try {
      const phoneNumber = parsePhoneNumberFromString(formattedValue);
      if (phoneNumber) {
        const formatted = phoneNumber.formatInternational();
        setForm((prev) => ({ ...prev, mobileNumber: formatted }));

        if (!phoneNumber.isValid()) {
          setPhoneError(`Numéro invalide pour ${data?.name || "ce pays"}`);
        } else {
          setPhoneError("");
        }
      } else {
        setForm((prev) => ({ ...prev, mobileNumber: formattedValue }));
        setPhoneError("Numéro non valide");
      }
    } catch {
      setForm((prev) => ({ ...prev, mobileNumber: formattedValue }));
      setPhoneError("Format incorrect");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <main className={`flex-1 p-6 ${bgClass}`}>
      <AnimatePresence mode="wait">
        {/* =============== PAGE 1 : FORMATIONS =============== */}
        {!selectedFormation && (
          <motion.div
            key="formations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6 p-6 rounded-xl shadow-md border border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Bienvenue !</h2>
              <p className="text-sm sm:text-base opacity-90">Découvrez les formations disponibles et commencez à apprendre dès maintenant !</p>
            </div>

            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen size={26} /> {lang === "fr" ? "Choisir une formation" : "Select a Formation"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {formations.map((f, i) => (
                <motion.div
                  key={f.id}
                  className={`p-6 rounded-xl shadow-md cursor-pointer transition transform hover:scale-105 ${cardClass} border ${borderClass} flex flex-col items-center justify-center`}
                  onClick={() => setSelectedFormation(f)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {f.image && (
                    <motion.div className="w-full h-36 mb-3 overflow-hidden rounded-lg">
                      <img src={f.image} alt={f.name} className="w-full h-full object-cover rounded-lg" />
                    </motion.div>
                  )}
                  <h2 className="font-bold text-xl text-center">{f.name}</h2>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* =============== PAGE 2 : LIVRES =============== */}
        {selectedFormation && !selectedLivre && (
          <motion.div
            key="livres"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <button className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700" onClick={() => setSelectedFormation(null)}>
              <ChevronLeft size={20} /> {lang === "fr" ? "Retour aux formations" : "Back to formations"}
            </button>

            <h1 className="text-2xl font-bold mb-6">
              {lang === "fr" ? "Livres de la formation" : "Books in Formation"}: {selectedFormation?.name}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {livres.map((l, i) => (
                <motion.div
                  key={l.id}
                  className={`p-4 rounded-lg shadow-md relative ${cardClass} border ${borderClass} transition transform hover:scale-105`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <h2 className="font-semibold mb-2">{l.titre}</h2>
                  <p className="text-sm mb-1">Auteur: {l.auteur}</p>
                  <p className="text-sm mb-1">Prix: {l.prix}</p>
                  <p className="text-sm mb-4">{l.description}</p>

                  <motion.div
                    className="absolute top-3 right-3 cursor-pointer"
                    animate={l.locked ? { rotate: [0, 10, -10, 0] } : { scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: l.locked ? Infinity : 1 }}
                  >
                    {l.locked ? <Lock size={20} className="text-red-500" /> : <Unlock size={20} className="text-green-500" />}
                  </motion.div>

                  <button
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                    onClick={() => setSelectedLivre(l)}
                  >
                    <ShoppingCart size={18} /> Acheter
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* =============== PAGE 3 : PAIEMENT =============== */}
        {selectedLivre && !showConfirmation && selectedFormation && (
          <motion.div
            key="paiement"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <button
              className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700"
              onClick={() => setSelectedLivre(null)}
            >
              <ChevronLeft size={20} /> {lang === "fr" ? "Retour aux livres" : "Back to books"}
            </button>

            <div className={`flex flex-col lg:flex-row gap-6 max-w-4xl mx-auto ${cardClass} border ${borderClass} rounded-2xl shadow-lg p-6`}>
              {/* Formulaire */}
              <div className="flex-1 flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-2">{lang === "fr" ? "Paiement" : "Payment"}</h2>
                <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Remplissez les informations pour procéder au paiement mobile.
                </p>

                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700"
                      : "bg-white text-black placeholder-gray-500 border-gray-200"
                  }`}
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700"
                      : "bg-white text-black placeholder-gray-500 border-gray-200"
                  }`}
                />

                <div>
                  <label className="block text-sm mb-2">
                    {lang === "fr" ? "Méthode de paiement" : "Payment method"}
                  </label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"
                    }`}
                  >
                    <option value="airtel">Airtel Money</option>
                    <option value="orange">Orange Money</option>
                    <option value="telma">Telma Money</option>
                  </select>
                </div>

                {/* ✅ Champ téléphone international complet */}
                <div>
                  <label className="block text-sm mb-2">
                    {lang === "fr" ? "Numéro Mobile Money" : "Mobile number"}
                  </label>
                  <PhoneInput
                    country={"mg"}
                    enableSearch
                    value={form.mobileNumber}
                    onChange={handlePhoneChange}
                    inputClass={`!w-full !h-12 !rounded-lg !text-base ${
                      darkMode ? "!bg-gray-800 !text-white" : "!bg-white !text-black"
                    }`}
                    buttonClass={`${darkMode ? "!bg-gray-700" : "!bg-gray-100"}`}
                    dropdownClass={`${darkMode ? "!bg-gray-800 !text-white" : "!bg-white !text-black"}`}
                    placeholder="Ex: +261 38 13 893 32"
                  />
                  {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setSelectedLivre(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-lg transition"
                  >
                    {lang === "fr" ? "Annuler" : "Cancel"}
                  </button>

                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    {lang === "fr" ? "Payer" : "Pay"}
                  </button>
                </div>
              </div>

              {/* Aperçu livre */}
              <div className="flex-1 flex flex-col gap-4 items-center justify-center">
                <h3 className={`text-xl font-semibold mb-1 ${darkMode ? "text-white" : "text-black"}`}>
                  {selectedLivre.titre}
                </h3>
                <p className={`text-sm opacity-80 mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {lang === "fr" ? "Formation" : "Course"}: {selectedFormation.name}
                </p>
                <p className={`text-sm opacity-80 mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {lang === "fr" ? "Auteur" : "Author"}: {selectedLivre.auteur}
                </p>
                <p className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-black"}`}>{selectedLivre.prix} Ar</p>

                <div className="w-full h-48 lg:h-64 overflow-hidden rounded-xl shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1581091870625-72be1b594fa7?w=400"
                    alt="Illustration paiement"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =============== PAGE 4 : CONFIRMATION =============== */}
        {showConfirmation && selectedLivre && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <button
              className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700"
              onClick={() => setShowConfirmation(false)}
            >
              <ChevronLeft size={20} /> {lang === "fr" ? "Retour au paiement" : "Back to payment"}
            </button>

            <div
              className={`p-6 rounded-xl ${cardClass} border ${borderClass} shadow-md max-w-md mx-auto flex flex-col gap-4 text-center`}
            >
              <h1 className="text-2xl font-bold mb-4">
                {lang === "fr" ? "Paiement confirmé !" : "Payment Confirmed!"}
              </h1>
              <p className="mb-4">
                {lang === "fr"
                  ? `Le livre ${selectedLivre?.titre} est maintenant débloqué.`
                  : `Book ${selectedLivre?.titre} is now unlocked.`}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Télécharger le livre
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
