// import { Dayjs } from "dayjs";
import React from "react";
/**
 * Form and Input events
 */
export type inputChangeEventType = React.ChangeEvent<HTMLInputElement>;
export type formSubmitEventType = React.FormEvent<HTMLFormElement>;

/**
 * Axios API Client: Types for custom responses and payloads
 */
export type ApiResponse<T> = {
  data: T;
  status: number;
};
export type CustomResponse<DataType> = {
  data: DataType;
  status: number;
};

/**
 * Generic Interfaces
 */
export interface GenericObjectInterface {
  [key: string]: any;
}
export type ArrayOfStringType = string[];

export interface userType {
  _id?: string;
  uid: number;
  username: string;
  email: string;
  profilePicture: string;
  isOnline?: boolean;
  lastActive?: Date;
}

export interface inputMessageType {
  text: string;
  textHTML: string;
}

export interface chatMessage {
  messageId: number;
  text: string;
  sender: userType;
  createdAt: Date;
  readBy: userType[];
  messageType: "text" | "image";
  mediaFiles: string[];
}
export interface ChatMessagesProps {
  messages: chatMessage[];
  recipientDetails: userType;
  userDetails: userType;
}

/**
 * LottieProvider interface
 */
export interface LottieFileType {
  v: string;
  fr: number;
  ip: number;
  op: number;
  layers: any[];
  assets: any[];
}
export interface lottieAnimProviderProptypes {
  animationFile: LottieFileType;
  height?: number | string;
  width?: number | string;
  autoplay?: boolean;
  loop?: boolean;
  lottieStyle?: React.CSSProperties;
}

/**
 * Profile picture dialog props
 */
export interface SimpleDialogProps {
  onClose: (value?: string) => void;
  imageSrc: string;
}
