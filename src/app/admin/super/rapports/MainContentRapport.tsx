"use client";

import { useState } from "react";
import { Clock, Trash2, CheckCircle } from "lucide-react";

interface Action {
id: number;
text: string;
date: string;
antenne: string;
user: "admin_local" | "student" | "system";
}

const initialActions: Action[] = [
{ id: 1, text: "Étudiant Rabe Luc a mis à jour son profil.", date: "2025-11-01 à 22:00", antenne: "Antananarivo", user: "student" },
{ id: 2, text: "Admin local Paul s'est connecté au système.", date: "2025-11-02 à 08:30", antenne: "Fianarantsoa", user: "admin_local" },
{ id: 3, text: "Formation 'Git et GitHub' créée par l'Admin Super.", date: "2025-11-02 à 09:00", antenne: "Toutes", user: "system" },
{ id: 4, text: "Paiement en attente de Marie Rasoa validé.", date: "2025-11-03 à 14:00", antenne: "Toamasina", user: "admin_local" },
{ id: 5, text: "Admin local Paul s'est déconnecté du système.", date: "2025-11-03 à 17:50", antenne: "Fianarantsoa", user: "admin_local" },
];

export default function Historique({ darkMode }: { darkMode: boolean }) {
const [actions, setActions] = useState<Action[]>(initialActions);
const [selectedActions, setSelectedActions] = useState<number[]>([]);

const toggleSelectAction = (id: number) => {
setSelectedActions(prev =>
prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
);
};

const toggleSelectAll = () => {
if (selectedActions.length === actions.length) setSelectedActions([]);
else setSelectedActions(actions.map(a => a.id));
};

const deleteSelectedActions = () => {
setActions(prev => prev.filter(a => !selectedActions.includes(a.id)));
setSelectedActions([]);
};

const deleteSingleAction = (id: number) => {
setActions(prev => prev.filter(a => a.id !== id));
setSelectedActions(prev => prev.filter(a => a !== id));
};

return (
<div className={`p-6 rounded-xl shadow-2xl transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
{/* TITRE HISTORIQUE */} <div className="flex items-center justify-between mb-6 border-b border-gray-500/20 pb-3"> <h2 className="text-2xl font-bold flex items-center gap-2"> <Clock size={24} className="text-[#17f]" />
Historique des Actions </h2>

    <div className="flex items-center gap-2">
      <button
        onClick={toggleSelectAll}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedActions.length === actions.length ? "bg-blue-600 text-white hover:bg-blue-700" : darkMode ? "bg-blue-700 text-white hover:bg-blue-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
      >
        {selectedActions.length === actions.length ? "Désélectionner tout" : "Sélectionner tout"}
      </button>
      <button
        onClick={deleteSelectedActions}
        disabled={selectedActions.length === 0}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition text-white ${selectedActions.length > 0 ? "bg-red-600 hover:bg-red-700" : "bg-red-600 text-white-600 cursor-not-allowed"}`}
      >
        <Trash2 size={16} />
        Supprimer ({selectedActions.length})
      </button>
    </div>
  </div>

  {/* LISTE ACTIONS */}
  <ul className="space-y-3">
    {actions.map(action => {
      const isSelected = selectedActions.includes(action.id);
      return (
        <li key={action.id} className={`p-4 rounded-xl flex items-center justify-between transition-all duration-200 shadow-sm ${isSelected ? "bg-yellow-500/20 ring-2 ring-yellow-500" : darkMode ? "bg-gray-800 hover:bg-gray-700/80" : "bg-gray-100 hover:bg-gray-200"}`}>
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => toggleSelectAction(action.id)}
              className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition ${isSelected ? "bg-yellow-500 border-yellow-500 text-white" : "border-gray-400"}`}
            >
              {isSelected && <CheckCircle size={12} />}
            </button>
            <span className="text-sm">{action.text}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs opacity-70">{action.date}</span>
            <button onClick={() => deleteSingleAction(action.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full transition hover:bg-red-500/20">
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      );
    })}
  </ul>

  {actions.length === 0 && (
    <p className={`text-center py-10 text-lg opacity-60 rounded-xl`}>
      Aucune action récente dans l&apos;historique.
    </p>
  )}
</div>
);
}
