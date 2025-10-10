"use client";

interface SettingsModalProps {
  readonly darkMode: boolean;
  readonly lang: string;
  readonly setDarkMode: (mode: boolean) => void;
  readonly setShowSettings: (show: boolean) => void;
}

export default function SettingsModal({
  darkMode,
  lang,
  setDarkMode,
  setShowSettings,
}: SettingsModalProps) {
  const isFrench = lang === "fr";
  const themeText = darkMode
    ? isFrench
      ? "Passer en mode clair"
      : "Switch to Light Mode"
    : isFrench
    ? "Passer en mode sombre"
    : "Switch to Dark Mode";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-96 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">
          {isFrench ? "Paramètres étudiant" : "Student Settings"}
        </h2>

        <div className="mb-4">
          <label className="block mb-2">
            {isFrench ? "Langue :" : "Language:"}
          </label>
          <select
            value={lang}
            onChange={() => {}}
            className="p-2 border rounded-lg w-full text-black"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            {isFrench ? "Thème :" : "Theme:"}
          </label>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
          >
            {themeText}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            {isFrench ? "Fermer" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
