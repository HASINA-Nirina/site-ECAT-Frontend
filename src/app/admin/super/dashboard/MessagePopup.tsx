"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Paperclip, Smile, ImageIcon, Maximize, Minimize } from "lucide-react";

interface MessagePopupProps {
  readonly darkMode: boolean;
  readonly adminName: string;
  readonly adminProfile?: string;
  readonly onClose: () => void;
}

export default function MessagePopup({
  darkMode,
  adminName,
  adminProfile,
  onClose,
}: MessagePopupProps) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bgClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <div
      className={`fixed bottom-20 right-6 w-80 rounded-xl shadow-xl flex flex-col transition-all duration-300 ${
        minimized ? "h-12" : expanded ? "h-[500px]" : "h-96"
      } ${bgClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={adminProfile || "/default-profile.png"}
              alt="Admin"
              width={32}
              height={32}
            />
          </div>
          {!minimized && <span className="font-medium">{adminName}</span>}
        </div>
        <div className="flex items-center gap-2">
          {!minimized && (
            <button onClick={() => setExpanded(!expanded)} title="Agrandir/Réduire">
              {expanded ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          )}
          <button onClick={() => setMinimized(!minimized)} title="Réduire">
            {minimized ? "+" : "-"}
          </button>
          <button onClick={onClose} title="Fermer">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Contenu messages */}
      {!minimized && (
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="p-2 bg-purple-100 rounded self-start">Bonjour étudiant !</div>
            <div className="p-2 bg-purple-600 text-white rounded self-end">Bonjour admin !</div>
            {/* Ajouter ici les messages dynamiques du forum */}
          </div>
        </div>
      )}

      {/* Footer */}
      {!minimized && (
        <div className="flex items-center gap-2 p-2 border-t border-gray-300">
          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button title="Ajouter image"><ImageIcon size={20} /></button>
          <button title="Joindre fichier"><Paperclip size={20} /></button>
          <button title="Emoji"><Smile size={20} /></button>
        </div>
      )}
    </div>
  );
}
