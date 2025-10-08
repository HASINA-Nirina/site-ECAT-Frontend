"use client";

import { LayoutDashboard, Users, User, CreditCard, FileText, LogOut } from "lucide-react";

interface SidebarProps {
  readonly darkMode: boolean;
}

export default function Sidebar({ darkMode }: SidebarProps) {
  const textColor = darkMode ? "text-white" : "text-black";
  const iconColor = darkMode ? "white" : "black";

  const menuItems = [
    { name: "Tableau de bord", icon: <LayoutDashboard size={20} color={iconColor} /> },
    { name: "Étudiants", icon: <Users size={20} color={iconColor} /> },
    { name: "Formateurs", icon: <User size={20} color={iconColor} /> },
    { name: "Paiements", icon: <CreditCard size={20} color={iconColor} /> },
    { name: "Rapports", icon: <FileText size={20} color={iconColor} /> },
  ];

  return (
    <aside
      className={`w-64 p-6 h-screen fixed top-0 left-0 ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      } hidden md:flex flex-col gap-4`}
    >
      {/* Conteneur menu */}
      <div
        className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-700" : "bg-white"} flex flex-col gap-3 w-full h-full`}
      >
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:text-purple-600 hover:bg-opacity-20 transition-colors ${textColor} bg-transparent border-none cursor-pointer whitespace-nowrap`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </button>
        ))}

        {/* Div séparée pour le bouton de déconnexion */}
        <div className="mt-auto flex items-center px-3 py-2 rounded-lg cursor-pointer bg-[#17f] hover:bg-blue-600 transition-colors">
          <LogOut size={20} color="white" />
          <span className="text-white font-medium">Se déconnecter</span>
        </div>
      </div>
    </aside>
  );
}
