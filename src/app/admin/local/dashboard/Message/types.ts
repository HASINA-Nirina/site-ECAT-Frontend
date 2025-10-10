export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string; // "admin-local" ou "etudiant"
  content: string;
  time: string;
}
