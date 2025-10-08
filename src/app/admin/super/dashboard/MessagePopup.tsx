"use client";

import { useState } from "react";
import { X, Paperclip, Smile, ImageIcon } from "lucide-react";

interface MessagePopupProps {
  darkMode: boolean;
  adminName: string;
  adminProfile?: string;
  onClose: () => void;
}

export default function MessagePopup({
  darkMode,
  adminName,
  adminProfile,
  onClose,
}: MessagePopupProps) {
  const [minimized, setMinimized] = useState(false);
  const bgClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <div
      className={`fixed bottom-20 right-6 w-80 rounded-xl shadow-xl flex flex-col transition-all duration-300 ${bgClass} ${
        minimized ? "h-12" : "h-96"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <img
            src={adminProfile || "/default-profile.png"}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover"
          />
          {!minimized && <span className="font-medium">{adminName}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(!minimized)}>
            {minimized ? "+" : "-"}
          </button>
          <button onClick={onClose}>
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
          <button><ImageIcon size={20} /></button>
          <button><Paperclip size={20} /></button>
          <button><Smile size={20} /></button>
        </div>
      )}
    </div>
  );
}
