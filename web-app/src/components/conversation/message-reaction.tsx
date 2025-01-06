"use client";

import { useState } from "react";

interface ReactionProps {
  messageId: string;
  onReact: (messageId: string, reaction: string) => void;
}

export function MessageReaction({ messageId, onReact }: ReactionProps) {
  const reactions = ["👍", "👎", "😄", "😕", "❤️"];
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const handleReact = (reaction: string) => {
    setSelectedReaction(reaction);
    onReact(messageId, reaction);
  };

  return (
    <div className="mt-1 flex space-x-1">
      {reactions.map((reaction) => (
        <button
          key={reaction}
          className={`btn btn-circle btn-xs ${selectedReaction === reaction ? "btn-primary" : "btn-ghost"}`}
          onClick={() => handleReact(reaction)}
        >
          {reaction}
        </button>
      ))}
    </div>
  );
}
