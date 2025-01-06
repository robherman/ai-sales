"use client";

import { useState } from "react";
import { clearChat } from "../../lib/chat/actions";
import Icon from "@heroicons/react/24/outline/XCircleIcon";
import { useRouter } from "next/navigation";
import { clearChatbotHistory } from "../../lib/app/actions";
import { toast } from "sonner";

interface Props {
  chatId: string;
  onClear?: () => void;
}

export default function ClearChat({ chatId, onClear }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handle = async () => {
    setIsLoading(true);
    try {
      if (window.confirm("Limpiar chat?")) {
        await clearChat(chatId);
        await clearChatbotHistory(chatId);
        toast.success(`Chat actualizado!`);
        router.refresh();
        onClear && onClear();
      }
    } catch (error) {
      toast.error(`No se pudo limpiar el chat.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-circle btn-ghost btn-sm`}
      onClick={handle}
      disabled={isLoading}
    >
      <Icon className={"w-8"} />
    </button>
  );
}
