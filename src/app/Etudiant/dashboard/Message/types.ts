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
