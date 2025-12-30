
import { makeApiRequest, endpoints } from "./apiConfig";

/**
 * Fetch current user session (Me)
 */
export const fetchUserProfile = async () => {
  return makeApiRequest("GET", endpoints.AUTH_ME);
};

/**
 * Update current user profile
 * @param data { profilePicture, isOnline, lastActive, etc. }
 */
export const updateUserProfile = async (data: any) => {
  return makeApiRequest("PATCH", endpoints.AUTH_ME, data);
};

/**
 * Search users
 * @param query Search term
 */
export const searchUsers = async (query: string) => {
  return makeApiRequest(
    "GET",
    `${endpoints.USERS}?query=${encodeURIComponent(query)}`
  );
};

/**
 * Fetch user list
 */
export const fetchUserList = async () => {
  return makeApiRequest("GET", endpoints.USERS);
};