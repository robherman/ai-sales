"use server";

import apiClient from "../http-client";

export const getPrompts = async () => {
  let error = null;
  const res = await apiClient
    .get(`/v1/prompts`, {
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

export const getPrompt = async (id: string) => {
  let error = null;
  const res = await apiClient
    .get(`/v1/prompts/${id}`, {
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

export const updatePrompt = async (id: string, dto: { config: any }) => {
  let error = null;
  const res = await apiClient
    .put(`/v1/prompts/${id}`, {
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
