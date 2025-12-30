// --- Creation/Auth Functions ---
import { emptySessionStorage, updateUserProfile } from "..";
import { makeApiRequest, endpoints } from "./apiConfig";

/**
 * Register a new user
 * @param data { username, email, password }
 */
export const registerUser = async (data: any) => {
  return makeApiRequest("POST", endpoints.AUTH_SIGNUP, data);
};

/**
 * Login existing user
 * @param data { email, password }
 */
export const loginUser = async (data: any) => {
  return makeApiRequest("POST", endpoints.AUTH_LOGIN, data);
};

/**
 * Logout user
 * Update the user's isOnline, lastActive; clear the session storage and then 
 * logout the user (clear the cookie from the backend)
 */
export const logoutUser = async () => {
  await updateUserProfile({ isOnline: false, lastActive: new Date() });
  emptySessionStorage();
  return makeApiRequest("POST", endpoints.AUTH_LOGOUT);
};