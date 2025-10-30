"use client";

import { LayoutDashboard, Users, User, CreditCard, FileText, LogOut, BookOpen, X, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  readonly darkMode: boolean;
  readonly sidebarOpen: boolean;
  readonly setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ darkMode, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Tableau de bord", icon: <LayoutDashboard size={20} />, href: "/admin/local/dashboard" },
    { name: "Liste étudiants", icon: <Users size={20} />, href: "/admin/local/etudiants" },
    { name: "Gestion livres", icon: <BookOpen size={20} />, href: "/admin/local/livres" },
    { name: "Paiements", icon: <CreditCard size={20} />, href: "/admin/local/paiements" },
    { name: "Rapports", icon: <FileText size={20} />, href: "/admin/local/rapports" },
    { name: "Paramètre compte", icon: <Settings size={20} />, href: "/admin/local/SettingCompte" },
  ];

  return (
    <>
      {/* ===== Desktop sidebar (inchangé) ===== */}
      <aside
        className={`w-64 p-6 h-screen fixed top-0 left-0 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        } hidden md:flex flex-col gap-4`}
      >
        <div
          className={`p-5 rounded-lg shadow-md ${
            darkMode ? "bg-gray-900" : "bg-white"
          } flex flex-col gap-3 w-full h-full`}
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <div className="relative w-full">
                  {isActive && (
                    <span
                      className={`
                        absolute inset-0 -mx-4 rounded-lg
                        bg-[#17f]
                        opacity-90
                        transform transition-all duration-300
                        z-0
                      `}
                    ></span>
                  )}
                  <div
                    className={`
                      relative flex items-center gap-2 px-1 py-3 rounded-lg cursor-pointer transition-all duration-300 z-10
                      ${darkMode ? (isActive ? "text-white" : "text-white") : isActive ? "text-white" : "text-black"}
                      ${!isActive ? "hover:bg-[#17f]/20 hover:text-[#17f] hover:scale-105" : ""}
                    `}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="mt-auto flex items-center px-3 py-2 rounded-lg cursor-pointer bg-[#17f] hover:bg-blue-600 transition-colors">
            <LogOut size={20} color="white" />
            <span className="text-white font-medium">Se déconnecter</span>
          </div>
        </div>
      </aside>

      {/* ===== Mobile sidebar ===== */}
      {sidebarOpen && (
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => setSidebarOpen(false)}
      />

    <aside className={`w-64 h-full flex flex-col gap-4 relative`}>
      <button
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={20} />
      </button>

      {/* Conteneur interne pour le design comme desktop */}
      <div
        className={`p-10 rounded-lg shadow-md w-full h-full flex flex-col gap-4 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className="relative w-full">
                {isActive && (
                  <span
                    className="absolute inset-0 -mx-4 rounded-lg bg-[#17f] opacity-90 z-0"
                  />
                )}
                <div
                  className={`relative flex items-center gap-2 px-2 py-3 rounded-lg cursor-pointer z-10
                    ${darkMode ? (isActive ? "text-white" : "text-white") : isActive ? "text-white" : "text-black"}
                    ${!isActive ? "hover:bg-[#17f]/20 hover:text-[#17f] hover:scale-105" : ""}
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
          <div className="mt-auto flex items-center px-3 py-2 rounded-lg cursor-pointer bg-[#17f] hover:bg-blue-600 transition-colors">
            <LogOut size={20} color="white" />
            <span className="text-white font-medium">Se déconnecter</span>
          </div>
        </div>
      </aside>
    </div>
  )}
    </>
  );
}
