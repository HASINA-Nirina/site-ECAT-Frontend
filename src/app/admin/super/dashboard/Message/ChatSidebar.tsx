"use client";

import Image from "next/image";
import { ChatUser } from "@/app/admin/super/dashboard/Message/type";

interface ChatSidebarProps {
  readonly users: ChatUser[];
  readonly activeId: string | null;
  readonly onSelect: (id: string) => void;
  readonly darkMode: boolean;
}

export default function ChatSidebar({
  users,
  activeId,
  onSelect,
  darkMode,
}: ChatSidebarProps) {
  // Fonction d'aide pour gérer le fond
  const getBgClass = (userId: string) => {
    if (userId === activeId) {
      return darkMode ? "bg-gray-800" : "bg-gray-200";
    }
    return darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
  };

  return (
    <aside
      className={`w-1/3 border-r ${
        darkMode
          ? "border-gray-700 bg-gray-900 text-white"
          : "border-gray-200 bg-gray-50 text-black"
      }`}
    >
      <div className="p-4 font-bold text-lg">Conversations</div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {/* bouton interactif accessible */}
            <button
              type="button"
              onClick={() => onSelect(user.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(user.id);
              }}
              className={`w-full text-left flex items-center justify-between p-3 cursor-pointer transition rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${getBgClass(user.id)}`}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                </div>
              </div>

              {user.unread > 0 && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  {user.unread}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
