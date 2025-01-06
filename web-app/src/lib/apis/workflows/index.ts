"use server";

import { V1_API_BASE_URL } from "@/lib/constants";

export const getWorkflows = async (
  token: string = "",
  page: number | null = null,
) => {
  let error = null;
  const searchParams = new URLSearchParams();

  if (page !== null) {
    searchParams.append("page", `${page}`);
  }

  const res = await fetch(
    `${V1_API_BASE_URL}/workflows?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { authorization: `Bearer ${token}` }),
      },
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
      error = err;
      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res.map((item: any) => ({
    ...item,
  }));
};

export const getWorkflowById = async (token: string, id: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/workflows/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { authorization: `Bearer ${token}` }),
    },
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((err) => {
      error = err;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getWorkflowGraphById = async (token: string, id: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/workflows/:${id}/graph`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { authorization: `Bearer ${token}` }),
    },
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.blob();
    })
    .catch((err) => {
      error = err;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const executeWorkflow = async (token: string, id: string, body: any) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/workflows/:${id}/execute`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      ...body,
    }),
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.blob();
    })
    .catch((err) => {
      error = err;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};
