"use server";

import { V1_API_BASE_URL } from "@/lib/constants";
import apiClient from "../http-client";

export const getConversationSettings = async (name: string) => {
  const res = await apiClient.get(`/v1/conversation-settings/${name}`);
  return res.data;
};

export const createConversationSetting = async (dto: any) => {
  const res = await apiClient.post(`/v1/conversation-settings`, dto);
  return res.data;
};
export const updateConversationSetting = async (id: string, dto: any) => {
  const res = await apiClient.put(`/v1/conversation-settings/${id}`, dto);
  return res.data;
};

export const initializateConversation = async (dto: {
  customerId: string;
  chatbotId: string;
  companyId: string;
  channel: string;
}) => {
  const res = await apiClient.post(`/v1/conversation/initialize`, dto);
  return res.data?.data;
};

export const conversationGenerateResponse = async (body: {
  message: string;
  customerId: string;
  chatId: string;
  channel: string;
}) => {
  let error = null;
  const res = await apiClient.post(`/v1/conversation/response/generate`, body);
  return res.data;
};

export const conversationStreamResponse = async (
  token: string = "",
  body: {
    message: string;
    customerId: string;
    chatId: string;
    channel: string;
  },
) => {
  let error = null;
  const res = await fetch(`${V1_API_BASE_URL}/conversation/response/stream`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body }),
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res;
    })
    .catch((err) => {
      error = err;
      console.error(`Process message failed`, err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};
