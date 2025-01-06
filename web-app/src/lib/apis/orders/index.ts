import { V1_API_BASE_URL } from "@/lib/constants";
import { Order } from "../../types";

const API_URL = V1_API_BASE_URL;

export const getOrders = async (
  token: string,
  params: {
    page: number;
    limit: number;
    search?: string;
    filter?: string;
    sort?: string;
    order?: "asc" | "desc";
  },
): Promise<{ orders: Order[]; total: number }> => {
  let error = null;
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...(params.sort && { orderBy: params.sort }),
    ...(params.order && { order: params.order.toUpperCase() }),
    ...(params.search && { search: params.search }),
    ...(params.filter && { filter: params.filter }),
  });

  const res = await fetch(`${API_URL}/orders?${queryParams}`, {
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
      console.log(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getOrdersByCustomer = async (
  token: string,
  customerId: string,
) => {
  let error = null;

  const res = await fetch(`${API_URL}/orders/customers/${customerId}`, {
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
      console.log(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getOrderById = async (token: string, orderId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/orders/${orderId}`, {
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
      console.log(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const deleteOrderById = async (token: string, orderId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/orders/${orderId}`, {
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
      console.log(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

type OrderUpdateForm = {
  profile_image_url: string;
  email: string;
  name: string;
  password: string;
};

export const updateOrderById = async (
  token: string,
  orderId: string,
  order: OrderUpdateForm,
) => {
  let error = null;

  const res = await fetch(`${API_URL}/orders/${orderId}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      profile_image_url: order.profile_image_url,
      email: order.email,
      name: order.name,
      password: order.password !== "" ? order.password : undefined,
    }),
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      error = err.detail;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};
