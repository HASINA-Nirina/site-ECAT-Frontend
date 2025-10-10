"use client";

import { useState } from "react";
import ChatSidebar from "@/app/Etudiant/dashboard/Message/ChatSidebar";
import ChatWindow from "@/app/Etudiant/dashboard/Message/ChatWindow";
import { ChatMessage, ChatUser } from "@/app/Etudiant/dashboard/Message/types";

interface MessagePopupProps {
  readonly darkMode: boolean;
  readonly onClose: () => void;
}

export default function MessagePopup({ darkMode, onClose }: MessagePopupProps) {
  const [localDarkMode, setLocalDarkMode] = useState(darkMode);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Groupes par antenne
  const groups: ChatUser[] = [
    { id: "1", name: "Formations en ligne Antananarivo", avatar: "/default-group.png", unread: 2 },
    { id: "2", name: "Formations en ligne Fianarantsoa", avatar: "/default-group.png", unread: 0 },
  ];

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;

  // Messages pour le groupe sélectionné
  const messages: ChatMessage[] = [
    { id: "m1", senderId: "etudiant", content: "Bonjour !", time: "08:30" },
    { id: "m2", senderId: "admin-local", content: "Bonjour, bienvenue dans le groupe.", time: "08:31" },
  ];

  const popupThemeClass = localDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-black";

  return (
    <div
      className={`fixed bottom-10 right-10 w-[800px] h-[500px] rounded-xl shadow-2xl flex overflow-hidden z-50 ${popupThemeClass}`}
    >
      <ChatSidebar
        users={groups}
        activeId={selectedGroupId}
        onSelect={setSelectedGroupId}
        darkMode={localDarkMode}
      />

      <ChatWindow
        selectedGroup={selectedGroup}
        messages={messages}
        darkMode={localDarkMode}
        toggleDarkMode={() => setLocalDarkMode(!localDarkMode)}
        onClose={onClose}
      />
    </div>
  );
}
