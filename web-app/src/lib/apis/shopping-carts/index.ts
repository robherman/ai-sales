"use server";

import { V1_API_BASE_URL } from "@/lib/constants";
import apiClient from "../http-client";

export const getShoppingCartById = async (cartId: string) => {
  let error = null;

  const res = await apiClient
    .get(`/v1/shopping-carts/${cartId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      console.log(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res?.data;
};

export const clearShoppingCartById = async (cartId: string) => {
  let error = null;

  const res = await apiClient
    .post(`/v1/shopping-carts/${cartId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch((err) => {
      console.log(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res?.data;
};
