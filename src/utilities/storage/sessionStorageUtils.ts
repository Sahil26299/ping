interface keysType {
  USER_DETAILS: string;
  RECIPIENT_SELECTED: string;
  CHAT_ID: string;
}

export const keys: keysType = {
  RECIPIENT_SELECTED: "recipient_selected",
  USER_DETAILS: "user_details",
  CHAT_ID: "chat_id",
};

// Function to set a value in sessionStorage
export const setSessionStorageItem = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("sessionStorageUpdated"));
  } catch {
    console.error(`Error setting item in sessionStorage`);
  }
};

// Function to get a value from sessionStorage
export const getSessionStorageItem = (key: string) => {
  try {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    console.error(`Error getting item from sessionStorage`);
    return null;
  }
};

// Function to remove an item from sessionStorage
export const removeSessionStorageItem = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    console.error(`Error removing item from sessionStorage`);
  }
};

export const emptySessionStorage = () => {
  try {
    sessionStorage.clear();
  } catch {
    console.error(`Error removing item from sessionStorage`);
  }
};
