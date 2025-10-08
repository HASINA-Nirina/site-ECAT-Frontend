"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import logo from "@/app/assets/logo.jpeg";
import { LogOut, Menu, Sun, Moon, Bell, User } from "lucide-react";
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

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts.map(p => p[0].toUpperCase()).join("").slice(0, 2);
  };

  return (
    <header
      className={`px-4 py-3 shadow-md bg-opacity-90 backdrop-blur-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Grand écran */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-3 pl-4">
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-[#17f] font-bold text-lg">
            Université ECAT TARATRA FIANARANTSOA
          </span>
        </div>

        <div className="flex items-center gap-5 pr-4">
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            {profilePic ? (
              <Image
                src={profilePic}
                alt="Profil"
                width={40}
                height={40}
                className="rounded-full border-2 border-purple-600 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-purple-600 bg-gray-300 flex items-center justify-center text-white">
                <User size={20} color="gray" />
              </div>
            )}
            <span className="font-semibold hidden md:inline">{name}</span>
          </button>

          <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition relative">
            <Bell size={20} color={iconColor} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

          <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
            <LogOut size={20} color={iconColor} />
          </button>
        </div>
      </div>

      {/* Responsive */}
      <div className="flex flex-col md:hidden items-center w-full">
        <div className="flex flex-col items-center justify-center w-full">
          <Image src={logo} alt="Logo" width={35} height={35} className="rounded-full mb-1" />
          <span className="text-[#17f] font-bold text-base text-center">
            Université ECAT TARATRA FIANARANTSOA
          </span>
        </div>

        <div className="flex items-center justify-between w-full mt-3 px-3">
          <button onClick={toggleSidebar}>
            <Menu color={iconColor} size={26} />
          </button>

          <div className="flex items-center gap-3">
            <button onClick={() => setModalOpen(true)}>
              {profilePic ? (
                <Image
                  src={profilePic}
                  alt="Profil"
                  width={35}
                  height={35}
                  className="rounded-full border-2 border-purple-600 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full border-2 border-purple-600 bg-gray-300 flex items-center justify-center text-white">
                  <User size={18} color="gray" />
                </div>
              )}
            </button>

            <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition relative">
              <Bell size={20} color={iconColor} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
            </button>

            <button className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
              <LogOut size={20} color={iconColor} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal modification profil */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className={`relative p-6 rounded-2xl shadow-2xl w-80 mx-auto ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        overlayClassName="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      >
        {/* Bouton X */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
        >
          ✕
        </button>

        {/* Cercle clicable */}
        <div
          className="w-28 h-28 rounded-full border-2 border-purple-500 overflow-hidden cursor-pointer flex items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          {profilePic ? (
            <Image src={profilePic} alt="Profil" width={112} height={112} className="object-cover" />
          ) : (
            <User size={40} color="gray" />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleProfileChange}
            className="hidden"
          />
        </div>

        {successMsg && <span className="text-green-500 text-sm mt-3 block text-center">{successMsg}</span>}
      </Modal>
    </header>
  );
}
