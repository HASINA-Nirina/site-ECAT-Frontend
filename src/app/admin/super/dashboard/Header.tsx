"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "@/app/assets/logo.jpeg";
import { Bell, Settings, LogOut, Menu } from "lucide-react";
import Modal from "react-modal";

interface HeaderProps {
  readonly setShowSettings: (show: boolean) => void;
  readonly darkMode: boolean;
}

export default function Header({ setShowSettings, darkMode }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("/default-profile.png"); // chemin par défaut
  const [successMsg, setSuccessMsg] = useState("");

  const iconColor = darkMode ? "white" : "#7c3aed";

  // Gestion changement photo
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        setSuccessMsg("Photo mise à jour avec succès !");
        setTimeout(() => setSuccessMsg(""), 3000); // message disparaît après 3s
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-3 shadow-md bg-opacity-90 backdrop-blur-md relative">
      {/* Logo + Nom université */}
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
        <span className="text-[#17f] font-bold text-lg">
          Université ECAT TARATRA FIANARANTSOA
        </span>
      </div>

      {/* Barre de recherche */}
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full max-w-xs p-2 border rounded-lg"
        />
      </div>

      {/* Nom super admin + icones */}
      <div className="flex items-center gap-3">
        {/* Super admin info */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setModalOpen(true)}>
          <Image src={profilePic} alt="Profil" width={32} height={32} className="rounded-full" />
          <span>SuperAdmin</span>
        </div>

        {/* Hamburger menu sur petit écran */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu color={iconColor} size={24} />
        </button>

        {/* Icônes normales */}
        <div className={`gap-3 items-center hidden md:flex`}>
          <Bell color={iconColor} size={24} />
          <Settings color={iconColor} size={24} onClick={() => setShowSettings(true)} />
          <LogOut color={iconColor} size={24} />
        </div>
      </div>

      {/* Menu responsive */}
      {menuOpen && (
        <div className="absolute right-4 top-16 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col gap-3 md:hidden">
          <Bell color={iconColor} size={24} />
          <Settings color={iconColor} size={24} onClick={() => setShowSettings(true)} />
          <LogOut color={iconColor} size={24} />
        </div>
      )}

      {/* Modal pour modification photo */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className={`p-6 rounded-lg shadow-lg w-80 mx-auto my-24 bg-white dark:bg-gray-800`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Modifier la photo</h2>

        <div className="flex flex-col items-center gap-3">
          <Image src={profilePic} alt="Profil" width={100} height={100} className="rounded-full object-cover" />
          <input type="file" accept="image/*" onChange={handleProfileChange} className="mt-2" />
          {successMsg && <span className="text-green-500">{successMsg}</span>}
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2"
          >
            Fermer
          </button>
        </div>
      </Modal>
    </header>
  );
}
