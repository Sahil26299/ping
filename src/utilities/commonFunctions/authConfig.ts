import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  Unsubscribe,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import authConfig from "../json/authConfig.json";
import { auth } from "@/lib/firebase";
import { GenericObjectInterface } from "../commonInterface/commonInterfaces";

export interface FieldConfig {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  showToggle?: boolean;
  description?: string;
  validation?: {
    required?: string;
    pattern?: {
      regex: string;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
  };
}

export interface FormConfig {
  fields: FieldConfig[];
  options: {
    rememberMe: {
      enabled: boolean;
      label: string;
    };
    forgotPassword: {
      enabled: boolean;
      label: string;
    };
  };
  submitButton: {
    text: string;
    loadingText: string;
    size: string;
  };
  socialLogin: {
    enabled: boolean;
    provider: string;
    text: string;
  };
  footer: {
    text: string;
    linkText: string;
    linkHref: "/login" | "/signup";
  };
}

export interface AuthConfig {
  branding: {
    logo: {
      text: string;
      size: string;
      color: string;
      textColor: string;
      textSize: string;
    };
    title: string;
    subtitle: {
      login: string;
      signup: string;
    };
  };
  forms: {
    login: FormConfig;
    signup: FormConfig;
  };
  layout: {
    container: {
      className: string;
    };
    formContainer: {
      className: string;
    };
    brandingSection: {
      className: string;
    };
    formCard: {
      className: string;
    };
    divider: {
      className: string;
      text: string;
    };
  };
  validation: {
    showErrors: boolean;
    errorClassName: string;
    inputErrorClassName: string;
  };
}

export type firebaseAuthType =
  | "onAuthChange"
  | "signup"
  | "sendVerificationLink"
  | "login"
  | "updateProfile";
export interface metaType {
  email: string;
  password: string;
  username: string;
  user: User;
}

export const getAuthConfig = (): AuthConfig => authConfig as AuthConfig;

export const getFormConfig = (formType: "login" | "signup"): FormConfig => {
  const config = getAuthConfig();
  return config.forms[formType];
};

export const getBrandingConfig = () => {
  const config = getAuthConfig();
  return config.branding;
};

export const getLayoutConfig = () => {
  const config = getAuthConfig();
  return config.layout;
};

export const getValidationConfig = () => {
  const config = getAuthConfig();
  return config.validation;
};

export const firebaseAuthService: (
  type: firebaseAuthType,
  meta: metaType | GenericObjectInterface
) => Promise<void | UserCredential | Unsubscribe> = async (type, meta) => {
  switch (type) {
    case "login":
      if (meta) {
        return await signInWithEmailAndPassword(
          auth,
          meta.email,
          meta.password
        );
      }
      break;
    case "signup":
      if (meta) {
        return await createUserWithEmailAndPassword(auth, meta?.email, meta?.password);
      }
      break;
    case "sendVerificationLink":      
      if (meta) {
        return await sendEmailVerification(meta.user);
      }
      break;
    case "updateProfile":
      if (meta) {
        return await updateProfile(meta.user, { displayName: meta?.username });
      }
      break;

    default:
      break;
  }
};
