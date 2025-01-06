"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth";
import { getCustomerById } from "../apis/customers";
import {
  updateChatbot as updateChatbotApi,
  getChatbot as getChatbotApi,
} from "../apis/chatbot";
import { getVersion } from "../apis";
import { getCustomers as getCustomersApi } from "../apis/customers";
import { getMe } from "../apis/auth";
import { getGreetings, updateGreeting } from "../apis/greetings";
import { getOrdersByCustomer } from "../apis/orders";
import { getPrompts } from "../apis/prompts";
import { clearShoppingCartById } from "../apis/shopping-carts";

export async function refreshHistory(path: string) {
  redirect(path);
}

export async function getUserProfile() {
  return await getMe();
}

export async function getCustomers({
  search,
  sort = "name",
  order = "asc",
}: {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await getCustomersApi(session.token!, {
    page: 1,
    limit: 50,
    search,
    sort,
    order,
  });

  if (!response) {
    throw new Error("Error al cargar los datos del cliente");
  }

  return response;
}

export async function getCustomerInfo(customerId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await getCustomerById(session.token!, customerId);

  if (!response) {
    throw new Error("Error al cargar los datos del cliente");
  }

  return response;
}

export async function updateChatbot(id: string, dto: { config: any }) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await updateChatbotApi(id, dto);
  if (!response) {
    throw new Error("Error al actualizar los datos");
  }

  return response;
}

export async function getChatbot(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await getChatbotApi(id);
  if (!response) {
    throw new Error("Error al actualizar los datos");
  }

  return response;
}

export async function clearChatbotHistory(chatId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }

  return "success";
}

export async function getChatbotState(chatId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
}

export async function getVersionInfo() {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await getVersion(session.token!);
  if (!response) {
    throw new Error("Error al obtener la versión");
  }

  return response;
}

export async function fetchGreetings() {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await getGreetings();
  if (!response) {
    throw new Error("Error al obtener datos del servidor");
  }

  return response;
}

export async function saveGreeting(id: string, data: any) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await updateGreeting(id, data);
  if (!response) {
    throw new Error("Error al obtener la versión");
  }

  return response;
}

export async function getCustomerLastOrders(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await getOrdersByCustomer(session?.token!, id);
  return response;
}

export async function clearCart(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  const response = await clearShoppingCartById(id);
  return response;
}
