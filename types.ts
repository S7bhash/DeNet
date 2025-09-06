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
  POLL = 'POLL',
  EVENT = 'EVENT',
  LOCATION = 'LOCATION',
}

export interface Message {
  id: string;
  authorId: string;
  type: MessageType;
  content: string;
  timestamp: string;
  fileName?: string;
  fileSize?: string;
  reactions: { [emoji: string]: string[] }; // emoji -> userIds
  readBy: string[]; // userIds
  poll?: {
    question: string;
    options: { text: string; votes: string[] }[];
  };
  event?: {
    title: string;
    dateTime: string;
    location: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    label: string;
  };
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