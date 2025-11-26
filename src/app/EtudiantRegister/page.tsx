"use client";

import React, { useState, useEffect } from "react";
import background from "@/app/assets/background.png";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface Antenne {
  id: number;
  antenne: string; 
}

const RegisterPage = () => {
  const [message, setMessage] = useState("");
  // État pour stocker la liste des provinces/antennes
  const [antennes, setAntennes] = useState<Antenne[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // 'city' est le choix du select 
    city: "", 
    // 'customCity' est la valeur tapée dans le champ texte libre
    customCity: "", 
    paymentMethod: "",
  });
  const router = useRouter();

  //  Récupération des antennes
  const fetchAntennes = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/antenne/ReadAntenne");
      if (res.ok) {
        const data: Antenne[] = await res.json();
        setAntennes(data);
      } else {
        console.error("Erreur lors de la récupération des antennes");
      }
    } catch (error) {
      console.error("Impossible de contacter le serveur d'antennes:", error);
    }
  };

  useEffect(() => {
    fetchAntennes();
  }, []);
  
  //  Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prevForm) => {
      let newForm = { ...prevForm, [name]: value };

      // interdiction des champs de province
      if (name === "city") {
        // Si l'utilisateur choisit une province dans le select, vide le champ customCity
        newForm.customCity = "";
      } else if (name === "customCity") {
        // Si l'utilisateur tape dans customCity, vide le select
        newForm.city = "";
      }
      return newForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Déterminer la valeur finale de la province à envoyer au backend
    const provinceToSend = form.city || form.customCity;

    if (!provinceToSend) {
        alert("Veuillez sélectionner ou saisir votre province.");
        return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/Etudiantregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.lastName,
          prenom: form.firstName,
          email: form.email,
          mot_de_passe: form.password,
          province: provinceToSend, 
          role: "etudiante",
          statuts: "Actif",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Votre compte est creé avec succées !");
        router.push("/login");
      } else {
        alert(data.detail || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de contacter le serveur.");
    }
  };

  // Déterminer si l'input texte libre doit être désactivé
  const isCustomCityDisabled = form.city !== "";
  // Déterminer si le select doit être désactivé
  const isCitySelectDisabled = form.customCity !== "";

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

      <div className="relative z-10 w-full max-w-lg bg-white/90 p-8 rounded-2xl shadow-lg mx-4">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Inscription - Étudiant
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          {/* Champs de base */}
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* SÉLECTION  DES PROVINCES */}
          <select
            // Modification: Ajout d'une clé pour forcer le re-rendu après le chargement des antennes
            key={`antennes-${antennes.length}`} 
            name="city"
            value={form.city}
            onChange={handleChange}
            className={`w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCitySelectDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            required={!form.customCity} // Requis SEULEMENT si customCity est vide
            disabled={isCitySelectDisabled} // Désactivé si customCity est rempli
          >
            <option value="">Sélectionnez votre ville (Antenne existante)</option>
            {/* Si la liste est chargée, les options apparaissent ici */}
            {antennes.map((antenne) => (
              <option key={antenne.id} value={antenne.province}>
                {antenne.province}
              </option>
            ))}
          </select>
          
          <div className="text-center text-gray-500 italic mb-4">OU</div>

          {/* PROVINCE NON EXISTANTE (CHAMP LIBRE) */}
          <div className="relative w-full mb-6">
            <input
              type="text"
              name="customCity" // Nom différent pour le champ libre
              placeholder="Province non existante, saisir votre province"
              value={form.customCity}
              onChange={handleChange}
              className={`w-full p-3 pl-10 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCustomCityDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              required={!form.city} // Requis SEULEMENT si city est vide
              disabled={isCustomCityDisabled} // Désactivé si city est sélectionné
            />
            <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            S’inscrire
          </button>

          {message && (
            <p className="text-center mt-4 text-green-700 font-medium">{message}</p>
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

export default RegisterPage;