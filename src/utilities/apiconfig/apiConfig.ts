import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import {ApiResponse, GenericObjectInterface, CustomResponse} from "@/src/utilities"


export let BASE_URL = ""; //Local

export const headersList = {
  Accept: "*/*",
  "Content-Type": "application/json",
};

export const endpoints = {
 
};
export const firebaseCollections = {
  USERS: "users",
  CHATS: "chats",
  MESSAGES: "messages"
}

export const makeApiRequest = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  data: any = null,
  customHeaders: GenericObjectInterface,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const authHeaders = {
      ...customHeaders,
      ...(token ? { Authorization: `Token ${token}` } : {}),
    };
    const response: AxiosResponse<T> = await axios({
      method,
      url,
      data,
      headers: authHeaders,
      // withCredentials: true,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    throw error; // Rethrow the error to be handled where the function is called
  }
};

// export const fetchUserSetting = async (token: string) => {
//   const customHeaders = {
//     ...headersList,
//     Authorization: `Token ${token}`,
//   };
//   return fetchData(endpoints.USER_PROFILE_SETTING, customHeaders);
// };

// export const ChangeUserSetting = async (profileData: any, token: string) => {
//   const customHeaders = {
//     ...headersList,
//     Authorization: `Token ${token}`,
//   };
//   return patchData(endpoints.USER_PROFILE_SETTING, customHeaders, profileData);
// };

// export const createOrder = async (subscription_plan_id: number, token: string) => {
//   const customHeaders = {
//     ...headersList,
//     Authorization: `Token ${token}`,
//   };
//   return postData(endpoints.CREATE_ORDER, { subscription_plan_id }, customHeaders);
// };