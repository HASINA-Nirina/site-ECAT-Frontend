export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string; // "etudiant" ou "admin-local"
  content: string;
  time: string;
}

// Props pour ChatSidebar
export interface ChatSidebarProps {
  readonly groups: ChatUser[];
  readonly activeId: string | null;
  readonly onSelect: (id: string) => void;
  readonly darkMode: boolean;
}

// Props pour ChatWindow
export interface ChatWindowProps {
  readonly selectedGroup: ChatUser | null;
  readonly messages: ChatMessage[];
  readonly darkMode: boolean;
  readonly toggleDarkMode: () => void;
  readonly onClose: () => void;
}
