"use server";

import axios from "axios";
import { API_BASE_URL, APP_COOKIES } from "../constants";
import { cookies } from "next/headers";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = cookies().get(APP_COOKIES.APP_USER_SESSION)?.value;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
