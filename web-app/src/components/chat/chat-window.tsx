import { ChatMessage as IChatMessage } from "../../lib/types";
import ChatMessage from "./message-bubble";

interface ChatWindowProps {
  chatId: string;
  messages: IChatMessage[];
  onEditMessage?: (id: string, content: string) => void;
}

export default function ChatWindow({
  chatId,
  messages,
  onEditMessage,
}: ChatWindowProps) {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((m, index) => (
        <div
          key={index}
          className={`chat ${["human", "user"].includes(m.role) ? "chat-end" : "chat-start"}`}
        >
          <ChatMessage
            chatId={chatId}
            key={m.id}
            message={m}
            onEdit={onEditMessage}
          />
        </div>
      ))}
    </div>
  );
}
