"use client";

import Image from "next/image";
import logo from "@/app/assets/logo.jpeg";

interface HeaderProps {
  darkMode: boolean;
  setShowSettings: (show: boolean) => void;
}

export default function Header({ darkMode, setShowSettings }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md bg-opacity-90 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button title="Notifications" className="text-xl">🔔</button>
        <button onClick={() => setShowSettings(true)} title="Paramètres" className="text-xl">⚙️</button>
        <button title="Déconnexion" className="text-xl">🚪</button>
        <span className="ml-2 font-semibold">Admin Local</span>
      </div>

      <div className="flex items-center gap-3">
        <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
        <span className="text-[#17f] font-bold">Université ECAT TARATRA FIANARANTSOA</span>
      </div>
    </header>
  );
}
