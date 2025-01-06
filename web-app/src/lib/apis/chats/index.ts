"use server";

import { V1_API_BASE_URL } from "@/lib/constants";
import { getTimeRange } from "@/lib/utils";
import { AppChat, ChatMessage } from "../../types";
import apiClient from "../http-client";

export const createNewChat = async (
  token: string,
  chat: object,
): Promise<AppChat | null> => {
  let error = null;
  const res = await fetch(`${V1_API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(chat),
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

export const addChatMessage = async (
  token: string = "",
  id: string,
  body: object,
): Promise<ChatMessage | null> => {
  let error = null;
  const res = await fetch(`${V1_API_BASE_URL}/chat/${id}/message`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    })
    .catch((err) => {
      error = err;
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getChatList = async (
  token: string = "",
  page: number | null = null,
): Promise<AppChat[] | null> => {
  let error = null;
  const searchParams = new URLSearchParams();

  if (page !== null) {
    searchParams.append("page", `${page}`);
  }

  const res = await fetch(
    `${V1_API_BASE_URL}/chat?${searchParams.toString()}`,
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

  return res.map((chat: any) => ({
    ...chat,
    timeRange: getTimeRange(chat.updated_at),
  }));
};

export const getChatListByUserId = async (
  token: string = "",
  userId: string,
): Promise<Array<AppChat> | null> => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/user/${userId}`, {
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

  return res.map((chat: any) => ({
    ...chat,
    time_range: getTimeRange(chat.updated_at),
  }));
};

export const getChatHistory = async (
  chatId: string,
): Promise<Array<ChatMessage> | null> => {
  let error = null;

  const res = await apiClient
    .get(`/v1/chat/${chatId}/history`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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

  return res?.data;
};

export const getArchivedChatList = async (
  token: string = "",
): Promise<AppChat[] | null> => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/archived`, {
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

export const getAllChats = async (token: string): Promise<AppChat[] | null> => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat`, {
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

export const getChatById = async (id: string): Promise<AppChat | null> => {
  let error = null;

  const res = await apiClient
    .get(`/v1/chat/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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

  return res?.data;
};

export const getChatByShareId = async (token: string, share_id: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/share/${share_id}`, {
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

export const archiveChatById = async (token: string, id: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/${id}/archive`, {
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

export const updateChatById = async (
  token: string,
  id: string,
  chat: object,
) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      chat: chat,
    }),
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

export const deleteChatById = async (token: string, id: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/${id}`, {
    method: "DELETE",
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
      error = err.detail;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const deleteAllChats = async (token: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat`, {
    method: "DELETE",
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
      error = err.detail;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const archiveAllChats = async (token: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/archive/all`, {
    method: "POST",
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
      error = err.detail;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const clearChatHistory = async (token: string, id: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/${id}/clear`, {
    method: "POST",
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
      error = err.detail;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getChatsMetrics = async (
  token: string,
  start: string,
  end: string,
) => {
  let error = null;

  const searchParams = new URLSearchParams();
  searchParams.append("startDate", `${start}`);
  searchParams.append("endDate", `${end}`);

  const res = await fetch(
    `${V1_API_BASE_URL}/chat/metrics?${searchParams.toString()}`,
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
      error = err.detail;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getChatsMetricsById = async (token: string, chatId: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/${chatId}/metrics`, {
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
      error = err.detail;

      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};

export const getChatsByCustomer = async (token: string, customerId: string) => {
  let error = null;

  const res = await fetch(`${V1_API_BASE_URL}/chat/customers/${customerId}`, {
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
      error = err.detail;
      console.log(err);
      return null;
    });

  if (error) {
    throw error;
  }

  return res;
};
