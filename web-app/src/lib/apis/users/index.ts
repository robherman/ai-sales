import { V1_API_BASE_URL } from "@/lib/constants";

const API_URL = V1_API_BASE_URL;

export const getUsers = async (token: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/users/`, {
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

  return res ? res : [];
};

export const getUserSettings = async (token: string) => {
  let error = null;
  const res = await fetch(`${API_URL}/users/user/settings`, {
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

export const updateUserSettings = async (token: string, settings: object) => {
  let error = null;

  const res = await fetch(`${API_URL}/users/user/settings/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...settings,
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

export const getUserById = async (token: string, userId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/users/${userId}`, {
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

export const deleteUserById = async (token: string, userId: string) => {
  let error = null;

  const res = await fetch(`${API_URL}/users/${userId}`, {
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

type UserUpdateForm = {
  profile_image_url: string;
  email: string;
  name: string;
  password: string;
};

export const updateUserById = async (
  token: string,
  userId: string,
  user: UserUpdateForm,
) => {
  let error = null;

  const res = await fetch(`${API_URL}/users/${userId}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      profile_image_url: user.profile_image_url,
      email: user.email,
      name: user.name,
      password: user.password !== "" ? user.password : undefined,
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