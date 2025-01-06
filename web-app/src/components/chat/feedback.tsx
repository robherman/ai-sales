"use client";

import { useState } from "react";
import { submitMessageFeedback } from "../../lib/chat/actions";

interface FeedbackProps {
  messageId: string;
}

export default function Feedback({ messageId }: FeedbackProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(
    null,
  );

  const handleFeedback = async (type: "positive" | "negative") => {
    setFeedback(type);
    await submitMessageFeedback({ messageId, type: "thumbs", data: { type } });
  };

  return (
    <div className="mt-2 flex items-center space-x-2">
      <button
        className={`btn btn-sm ${feedback === "positive" ? "btn-success" : "btn-outline"}`}
        onClick={() => handleFeedback("positive")}
      >
        👍
      </button>
      <button
        className={`btn btn-sm ${feedback === "negative" ? "btn-error" : "btn-outline"}`}
        onClick={() => handleFeedback("negative")}
      >
        👎
      </button>
    </div>
  );
}
