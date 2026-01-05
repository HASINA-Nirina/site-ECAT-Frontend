"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "@/app/assets/logo.jpeg";
import { Sun, Moon, Bell, Menu, Pencil, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface HeaderProps {
  readonly darkMode: boolean;
  readonly setDarkMode: (mode: boolean) => void;
  readonly sidebarOpen: boolean;
  readonly setSidebarOpen: (open: boolean) => void;
}

export default function Header({ darkMode, setDarkMode,sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [adminName, setAdminName] = useState<string>("Chargement...");
  const [prenom, setPrenom] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [initials, setInitials] = useState<string>("?");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const router = useRouter();
  const iconColor = darkMode ? "white" : "#7c3aed";

  const [isVisible, setIsVisible] = useState(false); // contrôle animation

  useEffect(() => {
    if (showNotifications) setIsVisible(true); // quand showNotifications = true, le popup devient visible
  }, [showNotifications]);

  const handleCloseNotifications = () => {
    setIsVisible(false); // déclenche animation de sortie
    setTimeout(() => setShowNotifications(false), 500); // attend la transition avant de démonter le composant
  };

  useEffect(() => {
  const openLogout = () => setShowLogoutConfirm(true);

  document.addEventListener("open-logout-confirm", openLogout);

  return () => {
    document.removeEventListener("open-logout-confirm", openLogout);
  };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("Token manquant : impossible de récupérer les informations utilisateur");
      setAdminName("Utilisateur inconnu");
      setInitials("?");
      return;
    }
  
    async function fetchUser() {
      try {
        const res = await apiFetch("/auth/me", {
          credentials: "include",
        });
  
        if (!res.ok) throw new Error("Non autorisé");
        const data = await res.json();
  
        // Mise à jour Nom/Prénom
        const userPrenom = data.prenom || "";
        const userNom = data.nom || "";
        setPrenom(userPrenom);
        setNom(userNom);
        setAdminName(`${userPrenom} ${userNom}`.trim() || "Utilisateur");
  
        // Gestion de l'Image
        const envUrl = process.env.NEXT_PUBLIC_API_URL;
        const backendUrl = (envUrl && envUrl !== "undefined" && envUrl !== "None") 
                           ? envUrl 
                           : "http://localhost:8000";
  
        let finalImageUrl = null;
        if (data.image && typeof data.image === "string" && !data.image.includes("None")) {
          finalImageUrl = data.image.startsWith("http") 
            ? data.image 
            : `${backendUrl}${data.image.startsWith("/") ? "" : "/"}${data.image}`;
        }
        setProfileImage(finalImageUrl);
  
        // Stockage et Thème
        localStorage.setItem("idUser", data.id?.toString() || "");
        if (data.theme === "dark") {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        } else {
          setDarkMode(false);
          document.documentElement.classList.remove('dark');
        }
  
        const initialsStr = (userPrenom[0] || "").toUpperCase() + (userNom[0] || "").toUpperCase();
        setInitials(initialsStr || "?");
  
      } catch (error) {
        console.error("Erreur fetchUser:", error);
        setAdminName("Utilisateur inconnu");
        setInitials("?");
        setProfileImage(null);
      }
    }
  
    fetchUser();
  }, [setDarkMode]); 
  //   // Déconnexion
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("idUser");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
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
    
      const handleProfileUpdate = async () => {
        try {
          const formData = new FormData();
          formData.append("prenom", prenom);
          formData.append("nom", nom);
          if (profileImageFile) formData.append("file", profileImageFile);
    
          const res = await apiFetch("/auth/me/update", {
            method: "PUT",
            body: formData,
            credentials: "include",
          });
    
          const data = await res.json();
          
          if (!res.ok) {
            alert(data.detail || "Erreur lors de la mise à jour du profil");
            return;
          }
    
          // 1. Mise à jour du nom affiché
          setAdminName(`${data.user.prenom} ${data.user.nom}`);
    
          // 2. Mise à jour de l'image avec reconstruction de l'URL
          if (data.user.image) {
            const envUrl = process.env.NEXT_PUBLIC_API_URL;
            const backendUrl = (envUrl && envUrl !== "undefined" && envUrl !== "None") 
                               ? envUrl 
                               : "http://localhost:8000";
    
            // On vérifie si l'image renvoyée est déjà une URL complète ou juste un chemin
            const cleanPath = data.user.image.startsWith("http") 
              ? data.user.image 
              : `${backendUrl}${data.user.image.startsWith("/") ? "" : "/"}${data.user.image}`;
            
            setProfileImage(cleanPath);
          }
    
          // 3. Fermer le popup et réinitialiser le fichier temporaire
          setProfileImageFile(null);
          setShowSettings(false);
          
    
        } catch (error) {
          console.error("Erreur lors de la mise à jour :", error);
          alert("Erreur réseau lors de la mise à jour du profil");
        }
      };
  

  const handleThemeToggle = async () => {
  const newMode = !darkMode;
  setDarkMode(newMode);

  if (newMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  try {
    const formData = new FormData();
    formData.append("theme", newMode ? "dark" : "light");

    await apiFetch("/auth/me/theme", {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
     } catch (error) {
    console.error(error);
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
        <Link
            href="/admin/local/dashboard"
            className="flex items-center gap-2 no-underline cursor-pointer"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
            <span className="text-[#17f] font-bold text-lg">
              Université ECAT TARATRA
            </span>
        </Link>
      </div>

      {/* ============== Grand écran ============== */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
              href="/admin/local/dashboard"
              className="flex items-center gap-3 no-underline cursor-pointer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <Image src={logo} alt="Logo Université ECAT" width={40} height={40} className="rounded-full" />
              <span className="text-[#17f] font-bold text-lg">Université ECAT TARATRA</span>
          </Link>
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
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition"
          >
            <Pencil size={20} color={iconColor} />
          </button>

         

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition"
          >
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

        </div>
      </div>

      {/* ============== Ligne 2 mobile ============== */}
      <div className="flex md:hidden justify-between items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
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
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition"
          >
            <Pencil size={20} color={iconColor} />
          </button>

          <button
            onClick={() => setShowNotifications(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition relative"
          >
            <Bell size={20} color={iconColor} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition"
          >
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

        </div>
      </div>

       
      {/* ====== POPUP LOGOUT ====== */}
      {showLogoutConfirm &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-[9999]">
            <div
              className={`rounded-2xl p-6 w-105 text-center shadow-xl transition ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              {/* Icône Logout animée */}
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-300 animate-spin">
                  <LogOut className="w-6 h-6 text-red-600 dark:text-red-500" />
                </div>
              </div>

              {/* Titre principal */}
              <h2 className="text-lg font-semibold mb-2">
                Voulez-vous vraiment vous déconnecter ?
              </h2>

              {/* Texte secondaire explicatif */}
              <p className="text-sm opacity-80 mb-4">
                Votre session sera fermée et vous devrez vous reconnecter pour continuer.
              </p>

              {/* Boutons */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`px-4 py-2 rounded-lg font-semibold text-white ${
                    darkMode
                      ? "bg-red-700 hover:bg-red-600"
                      : "bg-red-500 hover:bg-red-700"
                  } transition`}
                >
                  Non
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Oui
                </button>
              </div>
            </div>
          </div>,
          document.getElementById("portal-root") as HTMLElement
      )}

      {/* ====== POPUP PARAMÈTRES ====== */}
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
                    darkMode ? "bg-red-700 hover:bg-red-600" : "bg-red-500 hover:bg-red-700"
                  } transition`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleProfileUpdate}
                  className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
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