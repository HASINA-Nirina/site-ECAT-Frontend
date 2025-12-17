"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import logo from "@/app/assets/logo.jpeg";
import { Sun, Moon, Bell, Menu, Pencil, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link";

interface HeaderProps {
  readonly darkMode: boolean;
  readonly setDarkMode: (mode: boolean) => void;
  readonly sidebarOpen: boolean;
  readonly setSidebarOpen: (open: boolean) => void;
}

export default function Header({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }: HeaderProps) {
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
  const openLogoutPopup = () => {
    setShowLogoutConfirm(true);
  };

  document.addEventListener("open-logout-confirm", openLogoutPopup);

  return () => {
    document.removeEventListener("open-logout-confirm", openLogoutPopup);
  };
  }, []);


  // Charger les données utilisateur
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
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Erreur lors de la récupération de l'utilisateur :", res.statusText);
          setAdminName("Utilisateur inconnu");
          setInitials("?");
          return;
        }

        const data = await res.json();

        setPrenom(data.prenom || "");
        setNom(data.nom || "");
        setAdminName(`${data.prenom || ""} ${data.nom || ""}`);
        setProfileImage(data.image || null);

        localStorage.setItem("idUser", data.id?.toString() || "");
        localStorage.setItem("userNom", data.nom || "");
        localStorage.setItem("userPrenom", data.prenom || "");

        if (data.theme === "dark") setDarkMode(true);
        else setDarkMode(false);

        const initials =
          (data.prenom?.[0] || "").toUpperCase() +
          (data.nom?.[0] || "").toUpperCase();
        setInitials(initials);

      } catch (err) {
        console.error("Erreur réseau lors de la récupération de l'utilisateur :", err);
        setAdminName("Utilisateur inconnu");
        setInitials("?");
      }
    }

    fetchUser();
  }, [setDarkMode]);

  // Déconnexion
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

  // Ajoute ces états en haut de ton composant Header
  interface Notification {
    id: number;
    message: string;
    action_status: "non_lu" | "lu" | "accepte" | "refuse" | string;
    date: string;
    type?: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const count = notifications.filter((notif) => notif.action_status === "non_lu").length;
    setUnreadCount(count);
  }, [notifications]);

  // Fonction pour récupérer les notifications

  const fetchNotifications = useCallback(async () => {

    const token = localStorage.getItem("token");
        if (!token) {
          console.warn("fetchNotifications: Token manquant, abandon de la requête");
          return; // stop la fonction si pas de token
        }

    try {
      const res = await fetch("http://localhost:8000/auth/notifications", {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMsg = errorData?.detail || "Erreur récupération notifications";
        console.error("Notifications fetch error:", errorMsg);
        return;
      }

      const data: Notification[] = await res.json();

      if (!Array.isArray(data)) {
        console.error("Format de données inattendu pour les notifications:", data);
        return;
      }

      // Trie par date décroissante
      const sorted = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNotifications(sorted);

      // Met à jour le compteur
      const unread = sorted.filter((notif) => notif.action_status === "non_lu").length;
      setUnreadCount(unread);

    } catch (error) {
      console.error("Erreur réseau lors de la récupération des notifications:", error);
    }
  }, []);

  // Charger les notifications au montage
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 🔁 Rafraîchissement automatique des notifications toutes les 5 secondes (polling)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) fetchNotifications(); // ne fetch que si token présent
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Marquer comme lu quand le popup notifications s’ouvre
  useEffect(() => {
    if (showNotifications) {
      // Marque les notifications comme lues
      const updated = notifications.map((notif) =>
        notif.action_status === "non_lu" ? { ...notif, action_status: "lu" } : notif
      );
      setNotifications(updated);

      // recalculer compteur (non lus restants)
      const unread = updated.filter((n) => n.action_status === "non_lu").length;
      setUnreadCount(unread);

      // Appel backend
      fetch("http://localhost:8000/auth/notifications/mark_read", {
        method: "PUT",
        credentials: "include",
      }).catch((err) => console.error("Erreur marque comme lu:", err));
     }
    }, [showNotifications, notifications]);

  const handleAccept = async (notifId: number) => {
      try {
        const res = await fetch(`http://localhost:8000/auth/notifications/${notifId}/accepter`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur lors de l'acceptation");
        setNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, action_status: "accepte" } : n))
        );
      } catch (err) {
        console.error(err);
      }
    };

    const handleRefuse = async (notifId: number) => {
      try {
        const res = await fetch(`http://localhost:8000/auth/notifications/${notifId}/refuser`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur lors du refus");
        setNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, action_status: "refuse" } : n))
        );
      } catch (err) {
        console.error(err);
      }
    };

    // Accept + refresh
    const handleAcceptAndRefresh = async (notifId: number) => {
      try {
        await handleAccept(notifId); // Appel backend pour accepter
        fetchNotifications();        // Recharge les notifications pour mise à jour UI
      } catch (err) {
        console.error("Erreur lors de l'acceptation :", err);
      }
    };

      // Refuse + refresh
    const handleRefuseAndRefresh = async (notifId: number) => {
      try {
        await handleRefuse(notifId); // Appel backend pour refuser
        fetchNotifications();         // Recharge les notifications pour mise à jour UI
      } catch (err) {
        console.error("Erreur lors du refus :", err);
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

      await fetch("http://localhost:8000/auth/me/theme", {
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
            href="/admin/super/dashboard"
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
              href="/admin/super/dashboard"
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
            onClick={() => setShowNotifications(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition relative"
          >
            <Bell size={20} color={iconColor} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition"
          >
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

          {/* <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            <LogOut size={20} color={iconColor} />
          </button> */}
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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-yellow-400 transition"
          >
            {darkMode ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
          </button>

          {/* <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 rounded-full border border-purple-500 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
          >
            <LogOut size={20} color={iconColor} />
          </button> */}
        </div>
      </div>

       {/* ====== POPUP NOTIFICATIONS ====== */}
{(showNotifications || isVisible) &&
 typeof window !== "undefined" &&
 createPortal(
   <div className="fixed inset-0 flex justify-end z-[9999]">
     {/* Fond semi-transparent pour fermer au clic */}
     <div
       className={`absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity duration-500 ${
         isVisible ? "opacity-100" : "opacity-0"
       }`}
       onClick={handleCloseNotifications}
     ></div>

     {/* Conteneur popup avec animation slide + fade et effet glass */}
     <div
       className={`relative w-full sm:w-96 h-full shadow-2xl rounded-l-2xl transform transition-all duration-500 ease-in-out
         backdrop-blur-md
         ${darkMode ? "bg-gray-900/80 text-white" : "bg-gray-100/80 text-gray-900"}
         ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
       `}
     >
            {/* Header notification */}
      <div className="flex flex-col px-5 py-4 border-b border-transparent relative">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notifications</h2>
      <button
        onClick={handleCloseNotifications}
        className="p-2 rounded-full border-2 border-purple-500 flex items-center justify-center transition"
      >
        <X className="w-5 h-5 text-red-500" />
      </button>
        </div>

        {/* Progress bar violette sous le titre */}
        <div className="mt-8 h-1 w-full rounded-full overflow-hidden">
          <div
            className={`h-full w-full rounded-full ${
              darkMode ? "bg-purple-400" : "bg-purple-600"
            }`}
          />
        </div>
      </div>

       {/* Contenu notifications avec couleur dynamique selon mode */}
        <div className="p-5 overflow-y-auto max-h-[calc(100%-4rem)]">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`border rounded-xl p-4 mb-4 shadow-md transition-colors duration-300
                ${darkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-purple-50"}
              `}
            >
              {/* Message */}
              <p className="font-medium">{notif.message}</p>

              {/* Date */}
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-5">
                {new Date(notif.date).toLocaleString()}
              </p>

              {/* Boutons Accepter / Refuser */}
              {notif.type === "demande_compte_admin_local" &&
                !["accepte", "refuse"].includes(notif.action_status) && (
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => handleRefuseAndRefresh(notif.id)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                    >
                      Refuser
                    </button>
                    <button
                      onClick={() => handleAcceptAndRefresh(notif.id)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                    >
                      Accepter
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>

     </div>
   </div>,
   document.getElementById("portal-root") as HTMLElement
 )}

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
                  className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
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
                    darkMode ? "bg-red-700 hover:bg-red-600" : "bg-red-500 hover:bg-red-600"
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
