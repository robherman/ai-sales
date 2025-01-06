"use server";

import apiClient from "../http-client";

export const getChatbots = async () => {
  let error = null;
  const res = await apiClient
    .get(`/v1/chatbots`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      error = err;
      console.log(err);
      return null;
    });
  if (error) {
    throw error;
  }

  return res?.data;
};

export const getChatbot = async (id: string) => {
  let error = null;
  const res = await apiClient
    .get(`/v1/chatbots/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      error = err;
      console.log(err);
      return null;
    });
  if (error) {
    throw error;
  }

  return res?.data;
};

export const updateChatbot = async (id: string, dto: { config: any }) => {
  let error = null;
  const res = await apiClient
    .put(`/v1/chatbots/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
    .catch((err) => {
      error = err;
      console.log(err);
      return null;
    });
  if (error) {
    throw error;
  }

  return res?.data;
};
