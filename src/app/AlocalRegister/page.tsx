"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // L'importation n'est pas utilisée et peut être supprimée
import background from "@/app/assets/background.png";
import { Eye, EyeOff } from "lucide-react";

interface Antenne {
  id: number;
  antenne: string;
}

const InscriptionAdminLocal = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [antenne, setAntenne] = useState(""); // État pour la province sélectionnée
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  // 🐛 FIX: Déclaration de l'état 'antennes' manquant
  const [antennes, setAntennes] = useState<Antenne[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      setSuccess(false); // rouge
      return;
    }
    // Ajout d'une vérification pour s'assurer qu'une antenne est sélectionnée
    if (!antenne) {
      setMessage("❌ Veuillez sélectionner une ville.");
      setSuccess(false);
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
          province: antenne, // Utilisez l'état 'antenne' pour la province
          role: "Admin Local",
          statut: "en attente",
        }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        setMessage(
          " Votre demande d’inscription a été envoyée. En attente de validation."
        );
        setSuccess(true); // vert
      } else if (data.error) {
        setMessage("❌ " + data.error);
        setSuccess(false);
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

  //  Récupération des antennes
  const fetchAntennes = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/antenne/ReadAntenne");
      if (res.ok) {
        const data: Antenne[] = await res.json();
        // Le champ est 'antenne' dans l'interface, mais le champ du backend est 'province' pour l'inscription.
        // On suppose que la réponse du backend contient la propriété 'province' que vous voulez afficher.
        // Pour être sûr, on mappe l'objet Antenne[] pour avoir la bonne propriété à afficher si le champ est 'antenne'
        // Si l'API retourne { id: 1, antenne: "Province X" }, le mapping dans le return est correct.
        setAntennes(data);
      } else {
        console.error("Erreur lors de la récupération des antennes");
        // Vous pouvez ajouter un message utilisateur ici si nécessaire
      }
    } catch (error) {
      console.error("Impossible de contacter le serveur d'antennes:", error);
      // Vous pouvez ajouter un message utilisateur ici si nécessaire
    }
  };

  useEffect(() => {
    fetchAntennes();
  }, []);

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

          {/* SÉLECTION  DES PROVINCES */}
          <select
            // Modification: Ajout d'une clé pour forcer le re-rendu après le chargement des antennes
            key={`antennes-${antennes.length}`}
            name="antenne"
            value={antenne}
            // 🐛 FIX: setAntenne au lieu de setPassword
            onChange={(e) => setAntenne(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Sélectionnez votre ville </option>
            {/* Si la liste est chargée, les options apparaissent ici */}
            {antennes.map((item) => (
          
              <option key={item.id} value={item.province}>
                {item.province}
              </option>
            ))}
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
            <button
              type="button" // Important pour éviter de soumettre le formulaire
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 cursor-pointer"
              aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
            <button
              type="button" // Important pour éviter de soumettre le formulaire
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 cursor-pointer"
              aria-label={showConfirmPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
                  ? "text-yellow-600" // Affiche en jaune pour 'en attente'
                  : "text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-center text-black mt-6">
            Déjà un compte ?{" "}
            <a
              href="/login"
              className="text-purple-700 font-semibold hover:underline"
            >
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default InscriptionAdminLocal;