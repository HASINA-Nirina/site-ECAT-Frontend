"use client";

import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { ChatMessage, ChatUser } from "./types";

export default function MessagePopup() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const users: ChatUser[] = [
    { id: "1", name: "Admin Antenne Nord", avatar: "/default-profile.png", unread: 2 },
    { id: "2", name: "Admin Antenne Sud", avatar: "/default-profile.png", unread: 0 },
  ];

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  const messages: ChatMessage[] = [
    { id: "m1", senderId: "admin-local", content: "Bonjour super admin 👋", time: "08:30" },
    { id: "m2", senderId: "admin-super", content: "Bonjour, comment avance la formation ?", time: "08:31" },
  ];

  return (
    <div
      className={`fixed bottom-10 right-10 w-[800px] h-[500px] rounded-xl shadow-2xl flex overflow-hidden z-50 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <ChatSidebar
        users={users}
        activeId={selectedUserId}
        onSelect={setSelectedUserId}
        darkMode={darkMode}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}
