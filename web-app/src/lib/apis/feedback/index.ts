"use server";

import { V1_API_BASE_URL } from "@/lib/constants";

export const createFeedback = async (
  token: string,
  chatId: string,
  messageId: string,
  feedback: any,
) => {
  let error = null;

  const res = await fetch(
    `${V1_API_BASE_URL}/chat/${chatId}/feedback/${messageId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ feedback }),
    },
  )
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((err) => {
      error = err.detail;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};
