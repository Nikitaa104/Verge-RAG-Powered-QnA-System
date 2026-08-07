export type DocumentStatus = 'READY' | 'PROCESSING' | 'FAILED';

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: DocumentStatus;
  textContent?: string;
  summary?: string;
  description?: string;
  category?: string;
  pagesCount?: number;
}

export interface Citation {
  id: string;
  text: string;
  page: number;
  score: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface Conversation {
  id: string;
  docId?: string; // Optional if chatting globally or with specific doc
  title: string;
  lastUpdated: string;
  messages: Message[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinedDate: string;
}
