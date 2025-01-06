"use client";

import { Message } from "ai";
import { MessageGroup } from "./message-group";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onReact: (messageId: string, reaction: string) => void;
  addToolResult: any;
}

export function MessageList({
  messages,
  isLoading,
  error,
  messagesEndRef,
  onReact,
  addToolResult,
}: MessageListProps) {
  return (
    <div className="space-y-4">
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error.message}</span>
        </div>
      )}
      <MessageGroup
        messages={messages}
        onReact={onReact}
        addToolResult={addToolResult}
      />
      {isLoading && (
        <div className="flex justify-center">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
