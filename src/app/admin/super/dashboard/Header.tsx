"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "@/app/assets/logo.jpeg";
import { LogOut, Menu, Sun, Moon } from "lucide-react";
import Modal from "react-modal";

interface HeaderProps {
  readonly darkMode: boolean;
  readonly setDarkMode: (mode: boolean) => void;
  readonly toggleSidebar: () => void;
}

export default function Header({ darkMode, setDarkMode, toggleSidebar }: HeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [name, setName] = useState("Super Admin");
  const [successMsg, setSuccessMsg] = useState("");

  const iconColor = darkMode ? "white" : "#7c3aed";

  // Gestion changement photo
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        setSuccessMsg("Photo de profil mise à jour avec succès !");
        setTimeout(() => setSuccessMsg(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initiales si pas d’image
  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts.map(p => p[0].toUpperCase()).join("").slice(0, 2);
  };

  return (
    <header
      className={`flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 shadow-md bg-opacity-90 backdrop-blur-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Partie du haut en mode mobile : hamburger à gauche */}
      <div className="flex w-full items-center justify-between md:hidden mb-2">
        <button onClick={toggleSidebar}>
          <Menu color={iconColor} size={26} />
        </button>

        {/* Icônes à droite en mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

          <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
            <LogOut size={20} color={iconColor} />
          </button>

          <button onClick={() => setModalOpen(true)} className="relative">
            {profilePic ? (
              <Image
                src={profilePic}
                alt="Profil"
                width={36}
                height={36}
                className="rounded-full border-2 border-purple-600 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full border-2 border-purple-600 bg-[#17f] flex items-center justify-center text-white font-bold">
                {getInitials(name)}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Logo et nom université */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-3 w-full md:w-auto pl-6">
        <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
        <span className="text-[#17f] font-bold text-lg text-center md:text-left">
          Université ECAT TARATRA FIANARANTSOA
        </span>
      </div>

      {/* Partie droite (grands écrans uniquement) */}
      <div className="hidden md:flex items-center gap-4 pl-6">
        {/* Nom Super Admin (visible seulement en grand écran) */}
        <span className="font-semibold">{name}</span>

        {/* Toggle clair/sombre */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
        </button>

        {/* Déconnexion */}
        <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
          <LogOut size={20} color={iconColor} />
        </button>

        {/* Photo de profil */}
        <button onClick={() => setModalOpen(true)} className="relative">
          {profilePic ? (
            <Image
              src={profilePic}
              alt="Profil"
              width={40}
              height={40}
              className="rounded-full border-2 border-purple-600 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-purple-600 bg-[#17f] flex items-center justify-center text-white font-bold">
              {getInitials(name)}
            </div>
          )}
        </button>
      </div>

      {/* Modal de modification du profil */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className={`p-6 rounded-2xl shadow-2xl w-80 mx-auto ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Modifier le profil</h2>

        <div className="flex flex-col items-center gap-3">
          <Image
            src={profilePic || "/default-profile.png"}
            alt="Profil"
            width={100}
            height={100}
            className="rounded-full object-cover border-2 border-purple-500"
          />

          <label className="w-full">
            <span className="block mb-1 font-medium">Choisir une image</span>
            <input type="file" accept="image/*" onChange={handleProfileChange} className="block w-full" />
          </label>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-2 border rounded-lg w-full text-black dark:text-white dark:bg-gray-700"
            placeholder="Nom"
          />

          <button
            onClick={() => {
              setSuccessMsg("Profil mis à jour avec succès !");
              setTimeout(() => setSuccessMsg(""), 3000);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg mt-2 w-full hover:bg-purple-700 transition"
          >
            Mettre à jour
          </button>

          {successMsg && <span className="text-green-500 text-sm">{successMsg}</span>}

          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2 w-full hover:bg-red-600 transition"
          >
            Fermer
          </button>
        </div>
      </Modal>
    </header>
  );
}
