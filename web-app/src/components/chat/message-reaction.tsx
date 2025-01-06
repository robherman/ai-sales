"use client";

import { useState } from "react";
import { ChatMessage } from "../../lib/types";
import { submitMessageFeedback } from "../../lib/chat/actions";

interface MessageReactionProps {
  chatId: string;
  message: ChatMessage;
}

export default function MessageReaction({
  chatId,
  message,
}: MessageReactionProps) {
  const [reaction, setReaction] = useState<string | null>(
    message?.metadata?.feedback?.reaction || null,
  );

  const handleReaction = async (emoji: string) => {
    setReaction(emoji);
    try {
      await submitMessageFeedback({
        chatId,
        messageId: message.id,
        feedback: {
          reaction: emoji,
        },
      });
    } catch (error) {
      console.error("Failed to save reaction:", error);
    }
  };

  return (
    <div className="mt-2 flex space-x-2">
      {["👍", "👎"].map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className={`btn btn-xs ${reaction === emoji ? "btn-active" : ""}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
