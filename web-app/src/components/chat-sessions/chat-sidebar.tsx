"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatSessionList } from "./chat-sessions-list";
import { ChatControls } from "./chat-controls";
import { AppChat } from "../../lib/types";

interface ChatSidebarProps {
  sessions: AppChat[];
  selectedSessionId: string | undefined;
}

export function ChatSidebar({ sessions, selectedSessionId }: ChatSidebarProps) {
  const router = useRouter();
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  const handleClear = () => {
    // Implement clear logic
    console.log("Clear chats");
  };

  const handleDelete = () => {
    // Implement delete logic
    console.log("Delete selected chat");
  };

  const handleArchive = () => {
    // Implement archive logic
    console.log("Archive selected chat");
  };

  const handleSearch = (query: string) => {
    const filtered = sessions.filter((chat) =>
      chat.title.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredSessions(filtered);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <ChatControls
        onClear={handleClear}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onSearch={handleSearch}
      />
      <ChatSessionList
        sessions={filteredSessions}
        selectedSessionId={selectedSessionId}
        onChatSelect={(chatId) =>
          router.push(`/chat-sessions/?chatId=${chatId}`)
        }
      />
    </div>
  );
}
