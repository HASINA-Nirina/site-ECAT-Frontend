"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import logo from "@/app/assets/logo.jpeg";
import { LogOut, Sun, Moon, Bell, User, Menu } from "lucide-react";
import Modal from "react-modal";

interface HeaderProps {
  readonly darkMode: boolean;
  readonly setDarkMode: (mode: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Admin Local"); // modifié
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const iconColor = darkMode ? "white" : "#7c3aed";

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        setSuccessMsg("Photo mise à jour avec succès !");
        setTimeout(() => setSuccessMsg(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className={`px-4 py-3 shadow-md bg-opacity-90 backdrop-blur-md ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Ligne 1 mobile : logo + nom université */}
      <div className="flex md:hidden justify-start items-start mb-2 px-4">
        <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
        <span className="text-[#17f] font-bold text-lg ml-2">
          Université ECAT TARATRA FIANARANTSOA
        </span>
      </div>

      {/* Grand écran */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-[#17f] font-bold text-lg">Université ECAT TARATRA FIANARANTSOA</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            {profilePic ? (
              <Image src={profilePic} alt="Profil" width={40} height={40} className="rounded-full border-2 border-purple-600 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-purple-600 bg-gray-300 flex items-center justify-center">
                <User size={20} color="gray" />
              </div>
            )}
            <span className="font-semibold">{adminName}</span>
          </button>

          <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition relative">
            <Bell size={20} color={iconColor} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

          <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
            <LogOut size={20} color={iconColor} />
          </button>
          <span className="font-semibold text-[#17f]">Se deconnecter</span>
        </div>
      </div>

      {/* Ligne 2 mobile */}
      <div className="flex md:hidden justify-between items-center">
        <button>
          <Menu color={iconColor} size={26} />
        </button>

        <div className="flex items-center gap-3">
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            {profilePic ? (
              <Image src={profilePic} alt="Profil" width={40} height={40} className="rounded-full border-2 border-purple-600 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-purple-600 bg-gray-300 flex items-center justify-center">
                <User size={20} color="gray" />
              </div>
            )}
          </button>

          <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition relative">
            <Bell size={20} color={iconColor} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

          <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
            <LogOut size={20} color={iconColor} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        appElement={typeof document !== "undefined" ? document.body : undefined}
        className={`relative p-6 rounded-2xl shadow-2xl w-80 mx-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
        overlayClassName="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      >
        <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white transition">✕</button>

        <button onClick={() => fileInputRef.current?.click()} className="w-28 h-28 rounded-full border-2 border-purple-500 overflow-hidden flex items-center justify-center mx-auto">
          {profilePic ? (
            <Image src={profilePic} alt="Profil" width={112} height={112} className="object-cover" />
          ) : (
            <User size={40} color="gray" />
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfileChange} className="hidden" />
        </button>

        <input
          type="text"
          value={adminName}
          onChange={e => setAdminName(e.target.value)}
          className="mt-4 p-2 border rounded-lg w-full text-black dark:text-white dark:bg-gray-700"
          placeholder="Nom"
        />

        <button onClick={() => setSuccessMsg("Modifications enregistrées !")} className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg w-full hover:bg-purple-700 transition">
          Modifier
        </button>

        {successMsg && <span className="text-green-500 text-sm mt-2 block text-center">{successMsg}</span>}
      </Modal>
    </header>
  );
}
