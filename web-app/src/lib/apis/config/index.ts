"use server";

import { SalesConfigSettings } from "../../types";
import apiClient from "../http-client";

export const getUserConfig = async () => {
  const res = await apiClient.get(`/v1/config/user`);
  return res.data?.data;
};

export const updateUserConfig = async (body: any) => {
  let error = null;
  const res = await apiClient.put(`/v1/config/user`, body);
  return res.data;
};

export const getSalesConfig = async () => {
  let error = null;
  const res = await apiClient.get(`/v1/config/sales`);
  return res.data;
};

export const updateSalesConfig = async (body: SalesConfigSettings) => {
  let error = null;
  const res = await apiClient.put(`/v1/config/sales`, body);
  return res.data;
};
