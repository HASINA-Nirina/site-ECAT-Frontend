 
"use client";

import { useState, useEffect,useCallback } from "react";
import { BookOpen, ChevronLeft, ShoppingCart, Lock, Unlock, Eye, FileX, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Image from "next/image";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";


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
  description?: string;
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
  const [showMessage, setShowMessage] = useState(false);

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    paymentMethod: "airtel",
    mobileNumber: "",
  });

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
  // 1. Définition de la fonction de récupération (accessible partout)
const fetchLivres = useCallback(async () => {
  if (!selectedFormation || !userId) return;

  try {
    setLoadingLivres(true);
    const url = `http://localhost:8000/livre/ReadLivres/${selectedFormation.id}/${userId}`;
    console.log("🔍 Fetching livres from:", url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

    const data = await res.json();
    const arr = Array.isArray(data) ? data : data.livres || [];

    const formatted = arr.map((l: any) => ({
      id: l.id ?? l.idLivre ?? 0,
      title: l.title ?? l.titre ?? "Livre",
      author: l.author ?? l.auteur ?? "",
      pdf: l.pdf ?? l.urlPdf ?? "",
      prix: l.prix ?? l.price ?? "",
      image: normalizeImage(l.image ?? l.cover ?? ""),
      access: l.access ?? false,
      description: l.description ?? l.desc ?? "",
    }));

    setLivres(formatted);
  } catch (error) {
    console.error("Erreur:", error);
    setLivres([]);
  } finally {
    setLoadingLivres(false);
  }
}, [selectedFormation, userId]);
useEffect(() => {
fetchLivres();
}, [fetchLivres]);

//  Gestion téléphone internationale avec typage
const handlePhoneChange = (value: string) => {
  const formattedValue = value.startsWith("+") ? value : "+" + value;
    try {
      const phoneNumber = parsePhoneNumberFromString(formattedValue);
      if (phoneNumber) {
        const formatted = phoneNumber.formatInternational();
        setForm((prev) => ({ ...prev, mobileNumber: formatted }));
      } else {
        setForm((prev) => ({ ...prev, mobileNumber: formattedValue }));
      }
    } catch {
      setForm((prev) => ({ ...prev, mobileNumber: formattedValue }));
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
      window.open(`http://127.0.0.1:8000/forum/filesdownload/${encodeURIComponent(livre.pdf)}`, "_blank");

                     
      // Sinon, afficher le formulaire de paiement
    } else {
      setSelectedLivre(livre);
    }
  };
  const handlePayment = async () => {
    if (!selectedLivre || !userId) return;
  
    // Génération d'une référence unique simple (ex: PAY-17353...)
    const transactionRef = `PAY-${Date.now()}-${userId}`;
  
    const paymentData = {
      idUser: userId,
      idLivre: selectedLivre.id,
      contact: form.mobileNumber,      // Provient de votre PhoneInput
      montant: parseFloat(selectedLivre.prix),
      operateur: form.paymentMethod,   // airtel, orange, telma
      reference: transactionRef,
      canAccess: true
    };
  
    try {
      const response = await fetch("http://localhost:8000/livre/Debloque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
  
      if (response.ok) {
        setShowConfirmation(true);
      } else {
        alert("Erreur lors de la transaction.");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
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
              <p className={`flex flex-col items-center justify-center text-center py-40 
                ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                
                <FileX 
                  className="w-20 h-20 mb-4 text-red-500"
                />

                {lang === "fr" 
                  ? "Aucun livre disponible pour cette formation." 
                  : "No books available for this formation."
                }
              </p>

            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {livres.map((livre, i) => (
  <motion.div
    key={livre.id}
    className={`rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02] hover:shadow-2xl relative ${
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: i * 0.08 }}
  >
    {/* Image du livre */}
    <div className="relative w-full h-35 overflow-hidden">
      {livre.image ? (
        <Image
          src={livre.image}
          alt={livre.title}
          fill
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-2xl">
          {livre.title.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Cadenas animé */}
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

    {/* Contenu */}
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2 text-[#17f]">
        {livre.title}
      </h2>

      <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {lang === "fr" ? "Auteur" : "Author"} : {livre.author}
      </p>

      <p className={`text-sm mb-4 font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
        {livre.prix} Ar
      </p>

      <button
        onClick={() => handleLivreClick(livre)}
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

      {/* Fin de la grille des livres */}
      </div>
        )}
      </motion.div>
    )}

    {/* =============== PAGE 3 : PAIEMENT =============== */}
      {selectedLivre && !showConfirmation && (
        <motion.div
          key="paiement-screen"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700 font-medium"
            onClick={() => setSelectedLivre(null)}
          >
            <ChevronLeft size={20} /> {lang === "fr" ? "Retour aux livres" : "Back to books"}
          </button>

          <div className={`flex flex-col lg:flex-row gap-6 max-w-4xl mx-auto ${cardClass} border ${borderClass} rounded-2xl shadow-lg p-6`}>
            
            {/* Formulaire de paiement */}
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-2xl font-bold mb-2">
                {lang === "fr" ? "Finaliser l'achat" : "Complete Purchase"}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder={lang === "fr" ? "Prénom" : "First Name"}
                  value={form.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder={lang === "fr" ? "Nom" : "Last Name"}
                  value={form.lastName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`}
                />
              </div>

              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`}
              >
                <option value="airtel">Airtel Money</option>
                <option value="orange">Orange Money</option>
                <option value="telma">Telma Money</option>
              </select>

              <PhoneInput
                country={"mg"}
                value={form.mobileNumber}
                onChange={handlePhoneChange}
                containerClass="!w-full"
                inputClass={`!w-full !h-12 !rounded-lg ${darkMode ? "!bg-gray-700 !text-white !border-gray-600" : ""}`}
                buttonClass={`${darkMode ? "!bg-gray-600 !border-gray-600" : ""}`}
              />

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setSelectedLivre(null)} 
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
                >
                  {lang === "fr" ? "Annuler" : "Cancel"}
                </button>
                <button 
  onClick={handlePayment} // Appelle l'API au lieu de juste changer l'état
  className="flex-1 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-md transition"
>
  {lang === "fr" ? "Payer" : "Pay"} {selectedLivre.prix} Ar
</button>
              </div>
            </div>

            {/* Récapitulatif du livre sélectionné */}
            <div className="flex-1 flex flex-col gap-4 bg-gray-100 dark:bg-gray-900/50 p-6 rounded-xl items-center justify-center text-center">
              <div className="relative w-32 h-44 shadow-xl rounded-lg overflow-hidden mb-2">
                {selectedLivre.image ? (
                   <Image src={selectedLivre.image} alt={selectedLivre.title} fill className="object-cover" />
                ) : (
                   <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                     {selectedLivre.title.charAt(0)}
                   </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-purple-600">{selectedLivre.title}</h3>
              <p className="text-sm opacity-75 italic">{selectedLivre.author}</p>
              <div className="h-px w-16 bg-gray-300 my-2"></div>
              <p className="text-2xl font-black">{selectedLivre.prix} Ar</p>
            </div>
          </div>
        </motion.div>
      )}
      

      {/* =============== PAGE 4 : CONFIRMATION =============== */}
      {showConfirmation && selectedLivre && (
        <motion.div
          key="confirmation-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <div className={`p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center ${cardClass} border ${borderClass}`}>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Unlock size={40} />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {lang === "fr" ? "Achat réussi !" : "Purchase Successful!"}
            </h1>
            <p className="mb-6 opacity-80">
              {lang === "fr" 
                ? `Le livre "${selectedLivre.title}" est désormais disponible dans votre bibliothèque.` 
                : `The book "${selectedLivre.title}" is now available in your library.`}
            </p>
            <button 
              onClick={() => {
                setShowConfirmation(false);
                setSelectedLivre(null);
                fetchLivres(); 
              }} 
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition"
            >
              {lang === "fr" ? "Accéder au livre" : "Access Book"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence> 
    {/* Floating message button */}
    
    <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
        title="Messages"
        onClick={() => setShowMessage(true)}
      >
        <MessageCircle size={28} />
      </button>

      {/* Utilisation du composant MessagePopup simulé localement */}
      {showMessage && (
        <MessagePopup
          darkMode={darkMode}
          onClose={() => setShowMessage(false)}
        />
      )}
  </main>
);
}