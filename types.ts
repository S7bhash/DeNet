export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

export interface Message {
  id: string;
  authorId: string;
  type: MessageType;
  content: string;
  timestamp: string;
  fileName?: string;
  fileSize?: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  messages: Message[];
  unreadCount: number;
}

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  // In a real app, you might have a phone number or email
  // and a way to check if they are a user of the service.
  isUser: boolean; 
}

export interface Invitation {
  id: string;
  group: Group;
  inviter: User;
}
