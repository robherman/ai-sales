"use server";

import apiClient from "../http-client";

export const getGreetings = async () => {
  const res = await apiClient.get(`/v1/conversation-settings/greetings`);
  return res.data;
};

export const updateGreeting = async (id: string, dto: any) => {
  const res = await apiClient.put(
    `/v1/conversation-settings/greetings/${id}`,
    dto,
  );
  return res.data;
};
