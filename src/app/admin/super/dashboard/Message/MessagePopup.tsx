"use client";

import { useState } from "react";
import ChatSidebar from "@/app/admin/super/dashboard/Message/ChatSidebar";
import ChatWindow from "@/app/admin/super/dashboard/Message/ChatWindow";
import { ChatMessage, ChatUser } from "@/app/admin/super/dashboard/Message/type";

// 🔹 Définir les props attendues
interface MessagePopupProps {
  readonly darkMode: boolean;
  readonly adminName: string;
  readonly onClose: () => void;
}

export default function MessagePopup({ darkMode, adminName, onClose }: MessagePopupProps) {
  const [localDarkMode, setLocalDarkMode] = useState(darkMode);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Liste des admins locaux
  const users: ChatUser[] = [
    { id: "1", name: "Admin Antenne Nord", avatar: "/default-profile.png", unread: 2 },
    { id: "2", name: "Admin Antenne Sud", avatar: "/default-profile.png", unread: 0 },
  ];

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  // Messages simulés
  const messages: ChatMessage[] = [
    { id: "m1", senderId: "admin-local", content: "Bonjour super admin 👋", time: "08:30" },
    { id: "m2", senderId: "admin-super", content: "Bonjour, comment avance la formation ?", time: "08:31" },
  ];

  return (
    <div
      className={`fixed bottom-10 right-10 w-[800px] h-[500px] rounded-xl shadow-2xl flex overflow-hidden z-50 ${
        localDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <ChatSidebar
        users={users}
        activeId={selectedUserId}
        onSelect={setSelectedUserId}
        darkMode={localDarkMode}
      />

      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        darkMode={localDarkMode}
        toggleDarkMode={() => setLocalDarkMode(!localDarkMode)}
        onClose={onClose} // ✅ ici on utilise la prop reçue
        adminName={adminName}
      />
    </div>
  );
}
