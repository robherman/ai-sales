"use client";

import MessageReaction from "./message-reaction";
import { useState } from "react";
import { ChatMessage as IChatMessage } from "../../lib/types";
import moment from "moment";
import { parseTextWithLinks } from "../../lib/utils";
import { MessagePart } from "./chat-message-part";
import Link from "next/link";

interface MessageBubbleProps {
  chatId: string;
  message: IChatMessage;
  onEdit?: (id: string, content: string) => void;
}

export default function MessageBubble({
  chatId,
  message,
  onEdit,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const parts = parseTextWithLinks(message.content);
  const isUser = ["human", "user"].includes(message.role);

  const handleEdit = () => {
    onEdit && onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  const renderContent = () => {
    const parts = message.content.split(/({{link:.*?}})/);
    return parts.map((part, index) => {
      const linkMatch = part.match(/{{link:(.*?)\|(.*?)}}/);
      if (linkMatch) {
        const [, url, text] = linkMatch;
        return (
          <Link
            key={index}
            href={url}
            className="btn btn-ghost btn-md"
            target="_blank"
            rel="noreferrer noopener"
          >
            {text}
          </Link>
        );
      }
      return (
        <div key={index} className="whitespace-pre-wrap text-sm">
          {part}
        </div>
      );
    });
  };

  return (
    <div
      className={`chat-bubble ${
        isUser ? "chat-bubble-primary" : "chat-bubble-secondary"
      } mb-1 p-3`}
    >
      {renderContent()}
      {!isUser && <MessageReaction chatId={chatId} message={message} />}
    </div>
  );
}
