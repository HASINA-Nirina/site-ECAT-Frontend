"use client";

import Image from "next/image";
import { ChatUser } from "./types";

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
  return (
    <aside
      className={`w-1/3 border-r ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-200 bg-gray-50 text-black"}`}
    >
      <div className="p-4 font-bold text-lg">Conversations</div>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => onSelect(user.id)}
            className={`flex items-center justify-between p-3 cursor-pointer transition ${
              user.id === activeId
                ? darkMode
                  ? "bg-gray-800"
                  : "bg-gray-200"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
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
          </li>
        ))}
      </ul>
    </aside>
  );
}
