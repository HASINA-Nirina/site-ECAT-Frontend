"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Paperclip, Smile, ImageIcon, Sun, Moon, Send, Maximize, Minimize } from "lucide-react";

// On peut créer un petit tableau d'emoji
const emojiList = ["😀","😂","😍","😎","🤔","🥳","😢","😡","👍","❤️"];

interface MessagePopupProps {
  readonly adminName: string;
  readonly adminProfile?: string;
  readonly onClose: () => void;
}

export default function MessagePopup({
  adminName,
  adminProfile,
  onClose,
}: MessagePopupProps) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [message, setMessage] = useState("");

  const bgClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-600" : "border-gray-300";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/") && ["image/png","image/jpeg","image/jpg"].includes(file.type)) {
      console.log("Image acceptée:", file.name);
    } else {
      alert("Seules les images PNG, JPG, JPEG sont autorisées !");
    }
  };

  return (
    <div
      className={`fixed bottom-20 right-6 transition-all duration-300 rounded-xl shadow-xl flex flex-col z-50
        ${minimized ? "h-12 w-64" : expanded ? "h-[500px] w-96" : "h-96 w-80"} ${bgClass}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-2 border-b ${borderClass}`}>
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
            <button onClick={() => setDarkMode(!darkMode)} title="Mode sombre/clair">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
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
          </div>
        </div>
      )}

      {/* Footer */}
      {!minimized && (
        <div className={`flex items-center gap-2 p-2 border-t ${borderClass}`}>
          {/* Emoji, image et fichier à gauche */}
          <div className="flex items-center gap-2 relative">
            <button onClick={() => setShowEmoji(!showEmoji)} title="Emoji">
              <Smile size={20} />
            </button>

            {showEmoji && (
              <div className="absolute bottom-12 left-0 flex flex-wrap w-48 p-2 bg-gray-200 dark:bg-gray-700 rounded shadow-lg gap-1 z-50">
                {emojiList.map((e) => (
                  <button key={e} onClick={() => setMessage(msg => msg + e)} className="text-lg">{e}</button>
                ))}
              </div>
            )}

            <label className="cursor-pointer">
              <ImageIcon size={20} />
              <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFileChange} className="hidden" />
            </label>

            <label className="cursor-pointer">
              <Paperclip size={20} />
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Input message */}
          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 p-2 border rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Bouton envoyer */}
          <button className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition">
            <Send size={18} color="white" />
          </button>
        </div>
      )}
    </div>
  );
}
