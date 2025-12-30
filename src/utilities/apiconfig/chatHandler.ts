import { GenericObjectInterface } from "../commonInterface/commonInterfaces";
import { endpoints, makeApiRequest } from "./apiConfig";

/**
 * Fetch user chats. 
 * This fetches all chats of the current user(based on auth token). 
 * It returns an array of objects containing chat details (including chat id).
 */
export const fetchUserChats = async () => {
  return makeApiRequest("GET", endpoints.CHATS);
};

/**
 * This api returns the chat with a particular user if chat already exists, else creates a new chat.
 * In both the cases, it returns the chat object containing chat id used to send a message.
 */
export const createUserChats = async (data: GenericObjectInterface) => {
  return makeApiRequest("POST", endpoints.CHATS, data);
};

/**
 * Fetch chat messages
 * Based on chat ID fetch chat messages (array of objects)
 */
export const fetchChatMessages = async (chatId:string) => {
  return makeApiRequest("GET", `${endpoints.MESSAGES}?chatId=${chatId}`);
};

/**
 * Send a new chat message
 */
export const postChatMessages = async (data: GenericObjectInterface) => {
  return makeApiRequest("POST", endpoints.MESSAGES, data);
};