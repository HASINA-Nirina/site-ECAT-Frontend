"use client";

interface SidebarProps {
  readonly darkMode: boolean;
}

export default function Sidebar({ darkMode }: SidebarProps) {
  return (
    <aside className={`w-64 p-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"} min-h-screen`}>
      <nav className="space-y-4">
        <button className="block hover:text-purple-500">Tableau de bord</button>
        <button className="block hover:text-purple-500">Étudiants</button>
        <button className="block hover:text-purple-500">Formateurs</button>
        <button className="block hover:text-purple-500">Paiements</button>
        <button className="block hover:text-purple-500">Rapports</button>
      </nav>
    </aside>
  );
}
