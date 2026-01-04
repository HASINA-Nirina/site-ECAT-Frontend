"use client";

import {
  LayoutDashboard,
  X,
  BookLockIcon,
  UnlockIcon,
  SettingsIcon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import sidebarImg from "@/app/assets/sidebar.jpg";

interface SidebarProps {
  readonly darkMode: boolean;
  readonly sidebarOpen: boolean;
  readonly setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ darkMode, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Tableau de bord", icon: <LayoutDashboard size={20} />, href: "/Etudiant/dashboard" },
    { name: "Consulter livres", icon: <BookLockIcon size={20} />, href: "/Etudiant/Achatlivre" },
    { name: "Livres débloqué", icon: <UnlockIcon size={20} />, href: "/Etudiant/LivreDebloque" },
    { name: "Paramètre compte", icon: <SettingsIcon size={20} />, href: "/admin/local/SettingCompte" },
  ];

  return (
    <>
      {/* ======= Desktop Sidebar ======= */}
      <aside
        className={`w-64 p-6 h-screen fixed top-0 left-0 will-change-transform transform-gpu ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        } hidden md:flex flex-col gap-5`}
      >
        <div
          className={`p-5 rounded-lg shadow-md flex flex-col gap-3 w-full h-full ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          {/* === Menu principal === */}
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} prefetch>
                <div className="relative w-full">
                  {isActive && (
                    <span
                      className="absolute inset-0 -mx-2 rounded-lg bg-[#17f] opacity-90 transform transition-colors duration-300 z-0"
                    ></span>
                  )}
                  <div
                    className={`relative flex items-center gap-2 px-1 py-3 rounded-lg cursor-pointer transition-colors duration-300 z-10
                      ${darkMode ? "text-white" : "text-black"}
                      ${!isActive ? "hover:bg-[#17f]/20 hover:text-[#17f] " : ""}
                      ${isActive ? "text-white" : ""}
                    `}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* === Image décorative en bas === */}
          <div className="mt-auto">
            <button
              onClick={() => {
                document.dispatchEvent(new Event("open-logout-confirm"));
              }}
              className="mt-auto flex items-center gap-2 px-3 py-3 my-6 rounded-lg bg-[#17f] hover:bg-blue-600 transition-colors w-full text-left"
            >
              <LogOut size={20} color="white" />
              <span className="text-white font-medium">Se déconnecter</span>
          </button>
            <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-md">
              <Image
                src={sidebarImg}
                alt="Sidebar illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ======= Mobile Sidebar ======= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />

          <aside className={`w-64 h-full flex flex-col gap-4 relative will-change-transform transform-gpu`}>
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>

            <div
              className={`p-10 rounded-lg shadow-md w-full h-full flex flex-col gap-4 ${
                darkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} prefetch>
                    <div className="relative w-full">
                      {isActive && (
                        <span className="absolute inset-0 -mx-4 rounded-lg bg-[#17f] opacity-90 z-0" />
                      )}
                      <div
                        className={`relative flex items-center gap-2 px-2 py-3 rounded-lg cursor-pointer z-10
                          ${darkMode ? "text-white" : "text-black"}
                          ${!isActive ? "hover:bg-[#17f]/20 hover:text-[#17f]" : ""}
                          ${isActive ? "text-white" : ""}
                        `}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* === Image décorative en bas pour mobile === */}
              <div className="mt-auto">

                <button
                    onClick={() => {
                      document.dispatchEvent(new Event("open-logout-confirm"));
                    }}
                    className="mt-auto flex items-center gap-2 px-3 py-3 my-6 rounded-lg bg-[#17f] hover:bg-blue-600 transition-colors w-full text-left"
                  >
                    <LogOut size={20} color="white" />
                    <span className="text-white font-medium">Se déconnecter</span>
                </button>

                <div className="relative w-full h-28 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={sidebarImg}
                    alt="Sidebar illustration"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
