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
};
