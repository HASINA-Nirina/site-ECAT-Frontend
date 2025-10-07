"use client";

import { LayoutDashboard, Users, User, CreditCard, FileText } from "lucide-react";

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
      className={`w-64 p-6 min-h-screen ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      } hidden md:flex flex-col gap-4`}
    >
      {menuItems.map((item) => (
        <button
          key={item.name}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:text-purple-600 hover:bg-opacity-20 transition-colors ${textColor} bg-transparent border-none cursor-pointer`}
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
        </button>
      ))}
    </aside>
  );
}
