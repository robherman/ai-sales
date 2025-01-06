import { API_BASE_URL } from "@/lib/constants";

export const getVersion = async (token: string) => {
  let error = null;
  const res = await fetch(`${API_BASE_URL}/version`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      error = err;
      console.error(err);
      return null;
    });
  if (error) {
    throw error;
  }

  return res;
};

export const getHealth = async (token: string) => {
  let error = null;
  const res = await fetch(`${API_BASE_URL}/health`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      error = err;
      console.error(err);
      return null;
    });
  if (error) {
    throw error;
  }

  return res;
};
