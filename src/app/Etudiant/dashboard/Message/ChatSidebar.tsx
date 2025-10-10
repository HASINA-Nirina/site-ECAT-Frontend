"use client";

import Image from "next/image";
import { ChatUser } from "@/app/Etudiant/dashboard/Message/types";

interface ChatSidebarProps {
  readonly group: ChatUser;
  readonly darkMode: boolean;
}

export default function ChatSidebar({ group, darkMode }: ChatSidebarProps) {
  const bgClass = darkMode ? "bg-gray-800" : "bg-gray-200";
  const hoverClass = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-300";

  return (
    <aside
      className={`w-1/3 border-r ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-200 bg-gray-50 text-black"}`}
    >
      <div className="p-4 font-bold text-lg">Groupes de discussion</div>
      <ul>
        <li>
          <button
            className={`w-full text-left flex items-center justify-between p-3 cursor-pointer rounded-md transition ${bgClass} ${hoverClass}`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={group.avatar}
                alt={group.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium">{group.name}</span>
              </div>
            </div>
            {group.unread > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {group.unread}
              </span>
            )}
          </button>
        </li>
      </ul>
    </aside>
  );
}
