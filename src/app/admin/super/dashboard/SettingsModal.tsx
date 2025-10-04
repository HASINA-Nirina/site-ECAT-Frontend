"use client";

interface SettingsModalProps {
  darkMode: boolean;
  lang: string;
  setDarkMode: (mode: boolean) => void;
  setShowSettings: (show: boolean) => void;
}

export default function SettingsModal({ darkMode, lang, setDarkMode, setShowSettings }: SettingsModalProps) {
  const modeText = darkMode 
    ? (lang === "fr" ? "Passer en mode clair" : "Switch to Light Mode") 
    : (lang === "fr" ? "Passer en mode sombre" : "Switch to Dark Mode");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <h2 className="text-xl font-bold mb-4">{lang === "fr" ? "Paramètres" : "Settings"}</h2>

        <div className="mb-4">
          <label className="block mb-2">{lang === "fr" ? "Langue :" : "Language:"}</label>
          <select
            value={lang}
            onChange={(e) => {}}
            className="p-2 border rounded-lg w-full text-black"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">{lang === "fr" ? "Thème :" : "Theme:"}</label>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
          >
            {modeText}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            {lang === "fr" ? "Fermer" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
