"use client";

import Image from "next/image";
import { useState } from "react";
import { ChatMessage, ChatUser } from "@/app/admin/super/dashboard/Message/type";
import { Sun, Moon, Paperclip, ImageIcon, Send, X } from "lucide-react";

interface ChatWindowProps {
  readonly selectedUser: ChatUser | null;
  readonly messages: ChatMessage[];
  readonly onClose: () => void;
  readonly darkMode: boolean;
  readonly toggleDarkMode: () => void;
  readonly adminName: string;
}

export default function ChatWindow({
  selectedUser,
  messages,
  onClose,
  darkMode,
  toggleDarkMode,
  adminName, // ✅ utilisé
}: ChatWindowProps) {
  const [message, setMessage] = useState("");

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("📁 Fichier envoyé :", file.name);
  };

  if (!selectedUser) {
    return (
      <main className={`flex-1 flex items-center justify-center ${bgClass}`}>
        <p className="opacity-70">Sélectionnez une conversation</p>
      </main>
    );
  }

  return (
    <main className={`flex flex-col flex-1 ${bgClass}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${borderClass}`}>
        <div className="flex items-center gap-3">
          <Image
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <span className="font-semibold">{selectedUser.name}</span>
            <p className="text-xs opacity-70">{adminName}</p> {/* ✅ affiche admin */}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} title="Changer le thème">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={onClose} title="Fermer le chat">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg) => {
          let messageClass = "self-start bg-gray-200";
          if (msg.senderId === "admin-super") {
            messageClass = "self-end bg-purple-600 text-white";
          } else if (darkMode) {
            messageClass = "self-start bg-gray-700 text-white";
          }

          return (
            <div
              key={msg.id}
              className={`max-w-[70%] p-3 rounded-lg ${messageClass}`}
            >
              {msg.content}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`flex items-center gap-2 p-3 border-t ${borderClass}`}>
        <label className="cursor-pointer">
          <ImageIcon size={22} />
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        <label className="cursor-pointer">
          <Paperclip size={22} />
          <input type="file" onChange={handleFile} className="hidden" />
        </label>

        <input
          type="text"
          placeholder="Écrire un message..."
          className={`flex-1 p-2 border rounded-lg ${borderClass}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">
          <Send size={18} />
        </button>
      </div>
    </main>
  );
}
