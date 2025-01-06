import React from "react";
import Link from "next/link";

interface MessagePartProps {
  part: { type: "text" | "link"; content: string };
}

export const MessagePart: React.FC<MessagePartProps> = ({ part }) => {
  if (part.type === "link") {
    return (
      <Link href={part.content} target="_blank" rel="noopener noreferrer">
        <span className="text-blue-500 hover:underline">{part.content}</span>
      </Link>
    );
  }
  return <div className="whitespace-pre-wrap text-sm">{part.content}</div>;
};
