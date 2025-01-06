export type ChatMessageType = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMetadata extends Record<string, any> {
  duration?: number;
  satisfaction?: string;
  score?: string;
  sentiment?: string;
  intent?: string;
}

export interface ChatMessageMetadata {
  isRead?: boolean;
  feedback?: {
    reaction?: string;
    comment?: string;
    score?: number;
    answerRelevanceScore?: number;
  };
  reactions?: string[];
  sentiment?: string;
  intent?: string;
  language?: string;
  hidden?: boolean;
  displayStyle?: 'default' | 'highlighted' | 'minimized';
  attachments?: {
    type: 'image' | 'file' | 'link';
    url: string;
  }[];
  responseMetadata?: {
    finishReason?: string;
    modelId?: string;
  };
  finishReason?: string;
  metrics?: {
    latencyMs?: number;
  };
  usage?: {
    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;
    inputTokens?: number;
    outputTokens?: number;
  };
}
