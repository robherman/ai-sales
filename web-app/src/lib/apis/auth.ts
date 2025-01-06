"use server";

import apiClient from "./http-client";

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const getMe = async () => {
  try {
    const response = await apiClient.get("/v1/profile");
    return response.data;
  } catch (err: any) {
    console.error(`Get profile failed`, err?.message);
    return null;
  }
};
