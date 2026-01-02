import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse, GenericObjectInterface } from "@/src/utilities";

// In Next.js App Router, using relative paths /api proxies to the backend automatically
// or we can use the full URL if needed.
export const BASE_URL = "/api";

export const headersList = {
  Accept: "*/*",
  "Content-Type": "application/json",
};

export const endpoints = {
  // Auth
  AUTH_SIGNUP: `${BASE_URL}/auth/signup`,
  AUTH_LOGIN: `${BASE_URL}/auth/login`,
  AUTH_ME: `${BASE_URL}/auth/me`,
  AUTH_LOGOUT: `${BASE_URL}/auth/logout`,

  // Core Features
  CHATS: `${BASE_URL}/chats`,
  MESSAGES: `${BASE_URL}/messages`,
  USERS: `${BASE_URL}/users`, // For search
  MARK_READ: `${BASE_URL}/chats/read`,
};

export const socketEvents = {
  JOIN_USER_ROOM: "join-user-room",
  JOIN_CHAT_ROOM: "join-chat-room",
  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGES_IN_CHAT: "chat-message", // when user is viewing messages inside a particular chat
  RECEIVE_NEW_CHAT: "user-message", // when user is on dashboard, without any of the chat opened and new message is received
  DISCONNECT: "disconnect",
};

export const makeApiRequest = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  data: any = null,
  customHeaders: GenericObjectInterface = {}
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url,
      data,
      headers: { ...headersList, ...customHeaders },
      withCredentials: true, // Crucial for HttpOnly cookies
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response) {
      // Return error response from server if available
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    throw error;
  }
};
