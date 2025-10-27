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
  SimpleDialogProps
} from "./commonInterface/commonInterfaces";
import {
  keys,
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
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
  firebaseAuthService,
  firebaseAuthType,
  metaType,
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
  firebaseCollections,
} from "./apiconfig/apiConfig";
export {
  poppins,
  keys,
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
  getAuthConfig,
  getBrandingConfig,
  getFormConfig,
  getLayoutConfig,
  getValidationConfig,
  hasFormErrors,
  validateField,
  validateForm,
  getLandingConfig,
  firebaseAuthService,
  BASE_URL,
  endpoints,
  headersList,
  makeApiRequest,
  firebaseCollections,
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
  firebaseAuthType,
  metaType,
  SimpleDialogProps
};
