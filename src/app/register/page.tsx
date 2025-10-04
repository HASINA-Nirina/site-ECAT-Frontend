"use client";

import React, { useState } from "react";

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "", // nouvelle propriété pour la ville
    role: "etudiant", // rôle fixé par défaut
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", form);
    alert("Inscription soumise. L'admin local validera votre compte.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">Inscription Étudiant</h1>

        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <select
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          S’inscrire
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
