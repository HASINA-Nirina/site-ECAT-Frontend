/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { BookOpen, ChevronLeft, ShoppingCart, Lock, Unlock, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Image from "next/image";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Formation {
  id: number;
  titre: string;
  description: string;
  image: string;
}

interface Livre {
  id: number;
  title: string;
  author: string;
  pdf: string;
  prix: string;
  image?: string;
  access: boolean;
}

export default function MainContentAchat({ darkMode, lang }: MainContentProps) {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [livres, setLivres] = useState<Livre[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedLivre, setSelectedLivre] = useState<Livre | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loadingFormations, setLoadingFormations] = useState(true);
  const [loadingLivres, setLoadingLivres] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

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

  // Helper pour normaliser les URLs d'images
  const normalizeImage = (raw: any): string => {
    try {
      if (!raw) return "";
  
      const s = String(raw).trim();
      if (s.startsWith("blob:")) return s;
      if (s.startsWith("http://") || s.startsWith("https://")) return s;
  
      if (s.startsWith("/")) return `http://localhost:8000${s}`;
      return `http://localhost:8000/${s}`;
  
    } catch {
      return "";
    }
  };
  

  // Récupérer l'ID utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // D'abord essayer depuis localStorage (peut être déjà stocké)
        const storedId = localStorage.getItem("iduser") || localStorage.getItem("id");
        if (storedId) {
          const id = parseInt(storedId, 10);
          if (!isNaN(id) && id > 0) {
            console.log("✅ UserId depuis localStorage:", id);
            setUserId(id);
            return;
          }
        }

        // Sinon, faire une requête API
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("👤 Données utilisateur:", data);
          if (data.id) {
            setUserId(data.id);
            localStorage.setItem("iduser", String(data.id));
            console.log("✅ UserId défini:", data.id);
          } else {
            console.error("❌ Pas d'ID dans les données");
          }
        } else {
          console.error("❌ Erreur auth/me:", res.status);
        }
      } catch (error) {
        console.error("❌ Erreur récupération utilisateur:", error);
      }
    };
    fetchUser();
  }, []);

  // Récupérer les formations
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoadingFormations(true);
        const res = await fetch("http://localhost:8000/formation/ReadFormation");
        if (!res.ok) throw new Error("Erreur de chargement des formations");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.formations || [];
        const formatted = arr.map((f: any) => {
          // Mapping robuste comme dans MainContentLivres
          return {
            id: f.idFormation ?? f.id ?? f.id_formation ?? 0,
            titre: f.titre ?? f.name ?? "Formation",
            description: f.description ?? "",
            image: normalizeImage(f.image),
          };
        });
        setFormations(formatted);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoadingFormations(false);
      }
    };
    fetchFormations();
  }, []);

  // Récupérer les livres quand une formation est sélectionnée
  useEffect(() => {
    if (selectedFormation && userId) {
      const fetchLivres = async () => {
        try {
          setLoadingLivres(true);
          const url = `http://localhost:8000/livre/ReadLivres/${selectedFormation.id}/${userId}`;
          console.log("🔍 Fetching livres from:", url);
          
          const res = await fetch(url);
          console.log("📡 Response status:", res.status);
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Erreur HTTP:", res.status, errorText);
            throw new Error(`Erreur de chargement des livres: ${res.status}`);
          }
          
          const data = await res.json();
          
        
          const arr = Array.isArray(data) ? data : data.livres || [];
          console.log("📚 Array après traitement:", arr);
          console.log("🔢 Nombre de livres:", arr.length);
          
          const formatted = arr.map((l: any, index: number) => {
            const livre = {
              id: l.id ?? l.idLivre ?? 0,
              title: l.title ?? l.titre ?? "Livre",
              author: l.author ?? l.auteur ?? "",
              pdf: l.pdf ?? l.urlPdf ?? "",
              prix: l.prix ?? l.price ?? "",
              image: normalizeImage(l.image ?? l.cover ?? ""),
              access: l.access ?? false,
            };
            console.log(`📖 Livre ${index}:`, livre);
            return livre;
          });
          
          console.log("Livres formatés:", formatted);
          setLivres(formatted);
        } catch (error) {
          console.error("Erreur:", error);
          setLivres([]);
        } finally {
          setLoadingLivres(false);
        }
      };
      fetchLivres();
    }
  }, [selectedFormation, userId]);

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

  const handleFormationClick = (formation: Formation) => {
    setSelectedFormation(formation);
    setSelectedLivre(null);
    setShowConfirmation(false);
  };

  const handleLivreClick = (livre: Livre) => {
    if (livre.access) {
      // Si le livre est débloqué, ouvrir directement le PDF
      window.open(`http://localhost:8000/${livre.pdf}`, "_blank");
      // Sinon, afficher le formulaire de paiement
    } else {
      setSelectedLivre(livre);
    }
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
              <p className="text-sm sm:text-base opacity-90">
                Découvrez les formations disponibles et commencez à apprendre dès maintenant !
              </p>
            </div>

            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen size={26} /> {lang === "fr" ? "Choisir une formation" : "Select a Formation"}
            </h1>

            {loadingFormations ? (
              <div className="text-center py-12">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {lang === "fr" ? "Chargement des formations..." : "Loading formations..."}
                </p>
              </div>
            ) : formations.length === 0 ? (
              <p className={`text-center text-gray-500 italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {lang === "fr" ? "Aucune formation disponible pour le moment." : "No formations available at the moment."}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {formations.map((formation, i) => (
                  <motion.div
                    key={formation.id}
                    className={`rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02] hover:shadow-2xl relative cursor-pointer ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                    onClick={() => handleFormationClick(formation)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      {formation.image ? (
                        <Image
                          src={formation.image}
                          alt={formation.titre}
                          width={400}
                          height={250}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-2xl">
                          {formation.titre.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h2 className={`text-lg font-semibold mb-2 ${darkMode ? "text-[#17f]" : "text-[#17f]"}`}>
                        {formation.titre}
                      </h2>
                      <p
                        className={`text-sm leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formation.description && formation.description.length > 120
                          ? formation.description.substring(0, 120) + "..."
                          : formation.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
            <button
              className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700"
              onClick={() => {
                setSelectedFormation(null);
                setLivres([]);
              }}
            >
              <ChevronLeft size={20} /> {lang === "fr" ? "Retour aux formations" : "Back to formations"}
            </button>

            <h1 className="text-2xl font-bold mb-6">
              {lang === "fr" ? "Livres de la formation" : "Books in Formation"}: {selectedFormation?.titre}
            </h1>

            {loadingLivres ? (
              <div className="text-center py-12">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {lang === "fr" ? "Chargement des livres..." : "Loading books..."}
                </p>
              </div>
            ) : livres.length === 0 ? (
              <p className={`text-center text-gray-500 italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {lang === "fr" ? "Aucun livre disponible pour cette formation." : "No books available for this formation."}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {livres.map((livre, i) => (
                  <motion.div
                    key={livre.id}
                    className={`rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02] hover:shadow-2xl relative ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      {livre.image ? (
                       <Image src={livre.image} alt= "LIVRE" fill className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-2xl">
                          {livre.title.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Cadenas avec animation */}
                      <div className="absolute top-2 right-2">
                        <motion.div
                          animate={
                            livre.access
                              ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
                              : { rotate: [0, 10, -10, 0] }
                          }
                          transition={{ duration: 0.6, repeat: livre.access ? 1 : Infinity }}
                        >
                          {livre.access ? (
                            <Unlock size={20} className="text-green-500" />
                          ) : (
                            <Lock size={20} className="text-red-500" />
                          )}
                        </motion.div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h2 className={`text-lg font-semibold mb-2 ${darkMode ? "text-[#17f]" : "text-[#17f]"}`}>
                        {livre.title}
                      </h2>
                      <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {lang === "fr" ? "Auteur" : "Author"}: {livre.author}
                      </p>
                      <p className={`text-sm mb-4 font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {livre.prix} Ar
                      </p>

                      <button
                        onClick={() => {
                        
                        window.open(`http://127.0.0.1:8000/forum/filesdownload/${encodeURIComponent(livre.pdf)}`, "_blank");

                      }}                   
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
                          livre.access
                            ? "bg-[#17f] hover:bg-[#0f0fcf] text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {livre.access ? (
                          <>
                            <Eye size={18} /> {lang === "fr" ? "Lire maintenant" : "Read now"}
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} /> {lang === "fr" ? "Acheter" : "Buy"}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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

            <div
              className={`flex flex-col lg:flex-row gap-6 max-w-4xl mx-auto ${cardClass} border ${borderClass} rounded-2xl shadow-lg p-6`}
            >
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
                  {selectedLivre.title}
                </h3>
                <p className={`text-sm opacity-80 mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {lang === "fr" ? "Formation" : "Course"}: {selectedFormation.titre}
                </p>
                <p className={`text-sm opacity-80 mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {lang === "fr" ? "Auteur" : "Author"}: {selectedLivre.author}
                </p>
                <p className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-black"}`}>
                  {selectedLivre.prix} Ar
                </p>

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
                  ? `Le livre ${selectedLivre?.title} est maintenant débloqué.`
                  : `Book ${selectedLivre?.title} is now unlocked.`}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {lang === "fr" ? "Télécharger le livre" : "Download the book"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
