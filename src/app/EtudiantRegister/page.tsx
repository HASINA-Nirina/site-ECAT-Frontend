"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    paymentMethod: "",
  });
  const router = useRouter();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
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
       setMessage(" Votre compte est creé avec succées !");
      
    } else {
      alert(data.detail || "Erreur lors de l'inscription");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Impossible de contacter le serveur.");
  }
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

        {/* Contenu animé */}
        <form onSubmit={handleSubmit} className="relative">

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