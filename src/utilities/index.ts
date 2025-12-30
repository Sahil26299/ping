import { poppins } from "./themes/font";
import {
  formSubmitEventType,
  inputChangeEventType,
  ArrayOfStringType,
  GenericObjectInterface,
  userType,
  inputMessageType,
  ChatMessagesProps,
  chatMessage,
  ApiResponse,
  CustomResponse,
  LottieFileType,
  lottieAnimProviderProptypes,
  SimpleDialogProps,
} from "./commonInterface/commonInterfaces";
import {
  keys,
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
  emptySessionStorage,
} from "./storage/sessionStorageUtils";

import {
  getAuthConfig,
  getBrandingConfig,
  getFormConfig,
  getLayoutConfig,
  getValidationConfig,
  FieldConfig,
  AuthConfig,
  FormConfig,
} from "./commonFunctions/authConfig";
import {
  hasFormErrors,
  validateField,
  validateForm,
  FormErrors,
} from "./commonFunctions/formValidation";
import {
  getLandingConfig,
  LandingConfig,
} from "./commonInterface/landingConfig";
import {
  BASE_URL,
  endpoints,
  headersList,
  makeApiRequest,
  socketEvents,
  // firebaseCollections, // Removed if not present in apiConfig anymore, but it was there in my last read. Let's check apiConfig again. It was NOT in my last write to apiConfig.
} from "./apiconfig/apiConfig";

import { registerUser, loginUser, logoutUser } from "./apiconfig/authHandler";

import {
  fetchUserChats,
  fetchChatMessages,
  postChatMessages,
  createUserChats
} from "./apiconfig/chatHandler";

import {
  fetchUserList,
  fetchUserProfile,
  searchUsers,
  updateUserProfile,
} from "./apiconfig/userHandler";

// Deprecated firestore operations exported as no-ops for safety.
import {
  firestoreUpdateOperation,
  firestoreSetOperation,
  firestoreGetCollectionOperation,
  firestoreReferDocOperation,
  convertFirestoreTimestamp,
  listenToChats,
  resolveUserReference,
  resolveChatUsers,
  resolveLastMessageSender,
  firestoreSendMessage,
  listenToUsers,
} from "./commonFunctions/firestoreOperations";

export {
  poppins,
  keys,
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
  emptySessionStorage,
  getAuthConfig,
  getBrandingConfig,
  getFormConfig,
  getLayoutConfig,
  getValidationConfig,
  hasFormErrors,
  validateField,
  validateForm,
  getLandingConfig,
  BASE_URL,
  endpoints,
  headersList,
  makeApiRequest,
  registerUser,
  loginUser,
  fetchUserProfile,
  updateUserProfile,
  searchUsers,
  logoutUser,
  fetchUserList,
  fetchUserChats,
  fetchChatMessages,
  postChatMessages,
  createUserChats,
  socketEvents,
  // firebaseCollections, // Removing as I likely removed it from apiConfig in step 195
  firestoreUpdateOperation,
  firestoreSetOperation,
  firestoreGetCollectionOperation,
  firestoreReferDocOperation,
  convertFirestoreTimestamp,
  listenToChats,
  resolveUserReference,
  resolveChatUsers,
  resolveLastMessageSender,
  firestoreSendMessage,
  listenToUsers,
};
export type {
  FieldConfig,
  AuthConfig,
  FormConfig,
  FormErrors,
  LandingConfig,
  formSubmitEventType,
  inputChangeEventType,
  ArrayOfStringType,
  GenericObjectInterface,
  userType,
  inputMessageType,
  ChatMessagesProps,
  chatMessage,
  ApiResponse,
  CustomResponse,
  LottieFileType,
  lottieAnimProviderProptypes,
  SimpleDialogProps,
};
