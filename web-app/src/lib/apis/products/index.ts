import { V1_API_BASE_URL } from "@/lib/constants";
import { Product, ProductNoOrder } from "../../types";
import apiClient from "../http-client";

const API_URL = V1_API_BASE_URL;

export const getProducts = async (
  token: string,
  params: {
    page: number;
    limit: number;
    search?: string;
    filter?: string;
    sort?: string;
    order?: "asc" | "desc";
  },
) => {
  let error = null;
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...(params.sort && { orderBy: params.sort }),
    ...(params.order && { order: params.order.toUpperCase() }),
    ...(params.search && { search: params.search }),
    ...(params.filter && { filter: params.filter }),
  });

  const res = await fetch(`${API_URL}/products?${queryParams}`, {
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

export const getProductById = async (token: string, productId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/products/${productId}`, {
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

export const deleteProductById = async (token: string, productId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/products/${productId}`, {
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

type ProductUpdateForm = {
  profile_image_url: string;
  email: string;
  name: string;
  password: string;
};

export const updateProductById = async (
  token: string,
  productId: string,
  product: ProductUpdateForm,
) => {
  let error = null;

  const res = await fetch(`${API_URL}/products/${productId}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      profile_image_url: product.profile_image_url,
      email: product.email,
      name: product.name,
      password: product.password !== "" ? product.password : undefined,
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

export async function getProductsNotOrdered(
  customerId: string,
): Promise<ProductNoOrder[]> {
  try {
    const response = await apiClient.get(
      `/v1/products-no-order?customerId=${customerId}`,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get products");
  }
}

export async function getRecommendedProducts(
  customerId: string,
): Promise<Product[] | null> {
  try {
    const response = await apiClient.get(
      `/v1/recommendations/products?customerId=${customerId}`,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
