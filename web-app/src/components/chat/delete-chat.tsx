"use client";

import { useState } from "react";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { removeChat } from "../../lib/chat/actions";
import { useRouter } from "next/navigation";

interface Props {
  chatId: string;
  onDelete?: () => void;
}

export default function DeleteChat({ chatId, onDelete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handle = async () => {
    setIsLoading(true);
    try {
      if (window.confirm("Borrar chat?")) {
        await removeChat(chatId);
        onDelete && onDelete();
      }
    } catch (error) {
      console.error("Failed to expclearort chat:", error);
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
      <TrashIcon className={"w-8"} />
    </button>
  );
}
