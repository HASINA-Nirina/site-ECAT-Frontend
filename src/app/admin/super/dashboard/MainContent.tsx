"use client";

// Props immuables, readonly obligatoire
interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent(props: MainContentProps) {
  const { darkMode, lang } = props; // destructuration

  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {lang === "fr" ? "Dashboard Admin Local" : "Local Admin Dashboard"}
        </h1>
        <input
          type="text"
          placeholder={lang === "fr" ? "Rechercher..." : "Search..."}
          className="p-2 border rounded-lg w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-lg font-semibold mb-4">Statistiques Étudiants</h2>
          <div className="h-40 flex items-center justify-center">📊 Graphique</div>
        </div>
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-lg font-semibold mb-4">Paiements</h2>
          <div className="h-40 flex items-center justify-center">📈 Histogramme</div>
        </div>
      </div>
    </main>
  );
}
