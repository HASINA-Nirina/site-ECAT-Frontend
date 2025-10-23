"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "@/app/assets/logo.jpeg";
import { LogOut, Sun, Moon, Bell, Menu, Settings, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface HeaderProps {
  readonly darkMode: boolean;
  readonly setDarkMode: (mode: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [adminName, setAdminName] = useState<string>("Chargement...");
  const [prenom, setPrenom] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [initials, setInitials] = useState<string>("?");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const router = useRouter();
  const iconColor = darkMode ? "white" : "#7c3aed";

  // Charger les données utilisateur
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Non autorisé");
        const data = await res.json();

        setPrenom(data.prenom || "");
        setNom(data.nom || "");
        setAdminName(`${data.prenom} ${data.nom}`);
        setProfileImage(data.image || null);

        const initials =
          (data.prenom?.[0] || "").toUpperCase() +
          (data.nom?.[0] || "").toUpperCase();
        setInitials(initials);
      } catch {
        setAdminName("Utilisateur inconnu");
        setInitials("?");
      }
    }
    fetchUser();
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.clear();
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
  };

  // Changement d'image local
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Mise à jour du profil
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("prenom", prenom);
      formData.append("nom", nom);
      if (profileImageFile) formData.append("file", profileImageFile);

      const res = await fetch("http://localhost:8000/auth/me/update", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Erreur lors de la mise à jour du profil");
        return;
      }

      setAdminName(`${data.user.prenom} ${data.user.nom}`);
      if (data.user.image) setProfileImage(data.user.image);
      setShowSettings(false);
    } catch (error) {
      console.error(error);
      alert("Erreur réseau lors de la mise à jour du profil");
    }
  };

  return (
    <header
      className={`px-4 py-3 shadow-md bg-opacity-90 backdrop-blur-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* ============== Ligne 1 mobile ============== */}
      <div className="flex md:hidden justify-start items-start mb-2 px-4">
        <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
        <span className="text-[#17f] font-bold text-lg ml-2">
          Université ECAT TARATRA FIANARANTSOA
        </span>
      </div>

      {/* ============== Grand écran ============== */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-[#17f] font-bold text-lg">
            Université ECAT TARATRA FIANARANTSOA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold border-2 border-purple-600 shadow-sm overflow-hidden ${
                darkMode ? "bg-[#17f]" : "bg-blue-400"
              }`}
            >
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profil"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                initials
              )}
            </div>
            <span className="font-semibold">{adminName}</span>
          </div>

          {/* Icônes */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            <Settings size={20} color={iconColor} />
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

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            <LogOut size={20} color={iconColor} />
          </button>
        </div>
      </div>

      {/* ============== Ligne 2 mobile ============== */}
      <div className="flex md:hidden justify-between items-center">
        <button>
          <Menu color={iconColor} size={26} />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold border-2 border-purple-600 shadow-sm overflow-hidden ${
              darkMode ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profil"
                width={40}
                height={40}
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              initials
            )}
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            <Settings size={20} color={iconColor} />
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

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            <LogOut size={20} color={iconColor} />
          </button>
        </div>
      </div>

      {/* ============== Popups ============== */}
      {showLogoutConfirm &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-[9999]">
            <div
              className={`rounded-2xl p-6 w-80 text-center shadow-xl transition ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Voulez-vous vraiment vous déconnecter ?</h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
                  } transition`}
                >
                  Non
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Oui
                </button>
              </div>
            </div>
          </div>,
          document.getElementById("portal-root") as HTMLElement
        )}

      {showSettings &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-[9999]">
            <div
              className={`rounded-2xl p-6 w-96 text-center shadow-xl transition ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Paramètres du profil</h2>

              {/* ✅ Cercle profil + crayon ajusté */}
              <div className="relative flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500">
                  {profileImage ? (
                    <Image src={profileImage} alt="Profil" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Crayon bien au-dessus du bord */}
                <label
                  htmlFor="profile-upload"
                  className="absolute -top-2 right-[38%] bg-purple-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-purple-700 transition"
                >
                  <Pencil size={14} color="white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* ✅ Champs à légende flottante propre */}
              <div className="space-y-5 text-left">
                <div className="relative">
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className={`peer w-full px-3 pt-4 pb-2 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-900"
                    }`}
                  />
                  <label
                    className={`absolute -top-2 left-3 px-1 text-sm font-medium ${
                      darkMode ? "bg-gray-800 text-purple-400" : "bg-white text-purple-600"
                    }`}
                  >
                    Prénom
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className={`peer w-full px-3 pt-4 pb-2 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-900"
                    }`}
                  />
                  <label
                    className={`absolute -top-2 left-3 px-1 text-sm font-medium ${
                      darkMode ? "bg-gray-800 text-purple-400" : "bg-white text-purple-600"
                    }`}
                  >
                    Nom
                  </label>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
                  } transition`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleProfileUpdate}
                  className="px-4 py-2 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>,
          document.getElementById("portal-root") as HTMLElement
        )}
    </header>
  );
}
