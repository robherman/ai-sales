import { V1_API_BASE_URL } from "@/lib/constants";
import { Customer } from "../../types";

const API_URL = V1_API_BASE_URL;

export const getCustomers = async (
  token: string,
  params: {
    page: number;
    limit: number;
    search?: string;
    filter?: string;
    sort?: string;
    order?: "asc" | "desc";
  },
): Promise<{ customers: Customer[]; total: number }> => {
  let error = null;

  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...(params.sort && { orderBy: params.sort }),
    ...(params.order && { order: params.order.toUpperCase() }),
    ...(params.search && { search: params.search }),
    ...(params.filter && { filter: params.filter }),
  });
  const res = await fetch(`${API_URL}/customers?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getCustomerById = async (token: string, customerId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/customers/${customerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const deleteCustomerById = async (token: string, customerId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/customers/${customerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

type CustomerUpdateForm = {
  profile_image_url: string;
  email: string;
  name: string;
  password: string;
};

export const updateCustomerById = async (
  token: string,
  customerId: string,
  customer: CustomerUpdateForm,
) => {
  let error = null;

  const res = await fetch(`${API_URL}/customers/${customerId}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      profile_image_url: customer.profile_image_url,
      email: customer.email,
      name: customer.name,
      password: customer.password !== "" ? customer.password : undefined,
    }),
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};
