"use client";

import React, { useState, useEffect } from "react";
import background from "@/app/assets/background.png";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

interface Antenne {
  id: number;
  antenne: string;
  province: string;
}

const RegisterPage = () => {
  const [message, setMessage] = useState("");
  // État pour stocker la liste des provinces/antennes
  const [antennes, setAntennes] = useState<Antenne[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // 'city' est le choix du select 
    city: "",  
    paymentMethod: "",
    customCity: "",
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
          province: form.city,
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
   //  Gestion des changements dans le formulaire
   const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prevForm) => {
      const newForm = { ...prevForm, [name]: value };
      return newForm;
    });
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
          <div className="relative ">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
                type="button" // Important pour éviter de soumettre le formulaire
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-6 -translate-y-1/2 text-purple-600 cursor-pointer"
                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
          </div>

          {/* SÉLECTION  DES PROVINCES */}
          <select
            // Modification: Ajout d'une clé pour forcer le re-rendu après le chargement des antennes
            key={`antennes-${antennes.length}`} 
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            >
        
            <option value="">Sélectionnez votre ville (Antenne existante)</option>
            {/* Si la liste est chargée, les options apparaissent ici */}
            {antennes.map((antenne) => (
              <option key={antenne.id} value={antenne.province}>
                {antenne.province}
              </option>
            ))}
          </select>
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