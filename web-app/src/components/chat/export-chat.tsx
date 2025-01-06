"use client";

import { useState } from "react";
import ArrowDownIcon from "@heroicons/react/24/outline/ArrowDownIcon";
import { getChat } from "../../lib/chat/actions";

interface ExportChatProps {
  chatId: string;
}

export default function ExportChat({ chatId }: ExportChatProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await getChat(chatId);
      const jsonString = JSON.stringify(response, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `chat-${chatId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export chat:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className={`btn btn-circle btn-ghost btn-sm`}
      onClick={handleExport}
      disabled={isExporting}
    >
      <ArrowDownIcon className={"w-8"} />
    </button>
  );
}
