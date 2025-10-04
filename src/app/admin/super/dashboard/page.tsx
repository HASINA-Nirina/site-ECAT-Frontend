"use client";

import React, { useState } from "react";

type AdminLocal = {
  id: number;
  name: string;
  email: string;
  city: string;
};

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState<AdminLocal[]>([
    { id: 1, name: "Admin Tana", email: "tana@ecat.mg", city: "Antananarivo" },
    { id: 2, name: "Admin Fianar", email: "fianar@ecat.mg", city: "Fianarantsoa" },
  ]);

  const [form, setForm] = useState({ name: "", email: "", city: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: AdminLocal = {
      id: admins.length + 1,
      name: form.name,
      email: form.email,
      city: form.city,
    };
    setAdmins([...admins, newAdmin]);
    setForm({ name: "", email: "", city: "" });
    alert("Nouvel admin local créé !");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Dashboard Super Admin</h1>

      {/* Section : Création d'un Admin local */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Créer un Admin local</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nom de l'admin"
            value={form.name}
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email de l'admin"
            value={form.email}
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          >
            <option value="">Sélectionnez une ville</option>
            <option value="Antananarivo">Antananarivo</option>
            <option value="Fianarantsoa">Fianarantsoa</option>
            <option value="Toliara">Toliara</option>
            <option value="Mahajanga">Mahajanga</option>
            <option value="Toamasina">Toamasina</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Créer Admin Local
          </button>
        </form>
      </div>

      {/* Section : Liste des Admins locaux */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Liste des Admins Locaux</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-100">
              <th className="p-3 border">Nom</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Ville</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="text-center">
                <td className="p-3 border">{admin.name}</td>
                <td className="p-3 border">{admin.email}</td>
                <td className="p-3 border">{admin.city}</td>
                <td className="p-3 border">
                  <button className="text-blue-600 hover:underline mr-2">Modifier</button>
                  <button className="text-red-600 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
