import { userType } from "../commonInterface/commonInterfaces";

interface keysType {
  USER_DETAILS: string;
  RECIPIENT_SELECTED: string
}

export const keys: keysType = {
  RECIPIENT_SELECTED: "recipient_selected",
  USER_DETAILS: "user_details"
};

// Function to set a value in sessionStorage
export const setSessionStorageItem = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("sessionStorageUpdated"));
  } catch (error) {
    console.error(`Error setting item in sessionStorage: ${error}`);
  }
};

// Function to get a value from sessionStorage
export const getSessionStorageItem = (key: string) => {
  try {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error(`Error getting item from sessionStorage: ${error}`);
    return null;
  }
};

// Function to remove an item from sessionStorage
export const removeSessionStorageItem = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from sessionStorage: ${error}`);
  }
};

export const emptySessionStorage = () => {
  try {
    sessionStorage.clear()
  } catch (error) {
    
  }
}