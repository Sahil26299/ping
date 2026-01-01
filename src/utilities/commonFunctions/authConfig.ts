import authConfig from "../json/authConfig.json";

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
