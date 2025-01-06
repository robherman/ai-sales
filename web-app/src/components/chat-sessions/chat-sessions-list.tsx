"use client";

import { AppChat } from "../../lib/types";

interface ChatSessionListProps {
  sessions: AppChat[];
  selectedSessionId: string | undefined;
  onChatSelect: (chatId: string) => void;
}

export function ChatSessionList({
  sessions,
  selectedSessionId,
  onChatSelect,
}: ChatSessionListProps) {
  return (
    <div className="h-full overflow-y-auto">
      {sessions.map((chat) => (
        <div
          key={chat.id}
          className={`cursor-pointer border-b p-4 hover:bg-gray-100 ${
            chat.id === selectedSessionId ? "bg-gray-200" : ""
          }`}
          onClick={() => onChatSelect(chat.id)}
        >
          <h3 className="font-semibold">{chat.title}</h3>
          <p className="truncate text-sm text-gray-500">
            {chat.lastMessage?.content || "No messages"}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(chat.updatedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
