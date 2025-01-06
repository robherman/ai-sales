"use server";

import { getSession } from "../auth";
import { AppChat } from "@/lib/types";
import {
  clearChatHistory,
  createNewChat,
  deleteChatById,
  getChatById,
  getChatByShareId,
  getChatHistory,
  getChatList,
  getChatListByUserId,
  getChatsMetrics,
  getChatsMetricsById,
  updateChatById,
} from "../apis/chats";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createFeedback } from "../apis/feedback";

export async function createNewchat() {
  const session = await getSession();

  try {
    const chat = await createNewChat(session?.token!, {});

    return chat;
  } catch (error) {
    return null;
  }
}

export async function getChats() {
  const session = await getSession();

  try {
    const chats = await getChatList(session?.token);

    return chats as AppChat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string) {
  const session = await getSession();
  try {
    const chat = await getChatById(id);
    if (!chat) {
      return null;
    }
    return chat;
  } catch (err: any) {
    console.error(`failed to get chat ${id}`);
    return null;
  }
}

export async function removeChat(id: string) {
  const session = await getSession();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await deleteChatById(session.token!, id);
  revalidatePath(`/c/${id}`);
  return redirect("/history");
  // return true;
}

export async function clearChat(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }
  await clearChatHistory(session.token!, id);
  // revalidatePath(`/c/${id}`);
  // return redirect("/history");
  return true;
}

export async function clearChats() {
  const session = await getSession();
  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const chats = await getChatList(session.token!);
  if (!chats?.length) {
    return redirect("/");
  }

  // todo: clear history

  revalidatePath("/");
  return redirect("/");
}

export async function getSharedChat(id: string) {
  const session = await getSession();

  const chat = await getChatByShareId(session?.token!, id);

  if (!chat || !chat.sharePath) {
    return null;
  }

  return chat;
}

export async function shareChat(id: string) {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const chat = await getChatById(id);

  if (!chat || chat.userId !== session.user.id) {
    return {
      error: "Something went wrong",
    };
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  };

  // await shareChatById(session.token!, chat.id);

  return payload;
}

export async function saveChat(chat: AppChat) {
  const session = await getSession();

  if (session && session.user) {
    await updateChatById(session.token!, chat.id, chat);
  }
}

export async function getChatsAnalytcs(start: string, end: string) {
  const session = await getSession();

  const result = await getChatsMetrics(session?.token!, start, end);
  return result;
}

export async function getChatsAnalytcsById(id: string) {
  const session = await getSession();

  const result = await getChatsMetricsById(session?.token!, id);
  return result;
}

export async function submitMessageFeedback(body: any) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const { chatId, messageId, feedback } = body;
  if (!messageId) {
    return "Failed to submit";
  }

  await createFeedback(session?.token!, chatId, messageId, feedback);
  return "Feeback created";
}

export async function getChatHistoryById(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }

  return await getChatHistory(id);
}
