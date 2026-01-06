import React, { useEffect, useRef, useState } from "react";
import MessageInputWithSubmit from "./components/MessageInputWithSubmit";
import {
  chatMessage,
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  socketEvents,
  userType,
} from "@/src/utilities";
import ChatMessages from "./components/ChatMessages";
import { Spinner } from "@/components/ui/spinner";
import { Socket } from "socket.io-client";

function ChatSection({
  messagesArray,
  recipientDetails,
  handleSendMessage,
  handleDeselectUser,
  loader,
  socket,
}: {
  messagesArray: chatMessage[];
  recipientDetails: userType | GenericObjectInterface;
  handleSendMessage: (param: string) => void;
  handleDeselectUser: () => void;
  loader: "" | "messages" | "chats";
  socket: Socket | null;
}) {
  const [userDetails, setUserDetails] = useState<userType | null>(null);
  const scrollingDiv = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string>("");

  useEffect(() => {
    if (
      scrollingDiv.current &&
      messagesArray.length > 0 &&
      scrollingDiv.current.scrollHeight > scrollingDiv.current.clientHeight
    ) {
      scrollingDiv.current?.scrollTo({
        top: scrollingDiv.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [messagesArray, scrollingDiv]);

  useEffect(() => {
    if (recipientDetails && recipientDetails?.uid) {
      const userInfo = getSessionStorageItem(keys.USER_DETAILS);
      const chatId = getSessionStorageItem(keys.CHAT_ID);
      setChatId(chatId as string);
      // handleReadMessages(userInfo);
      setUserDetails(userInfo);
      // handleFetchMessages(userInfo);
    }
  }, [recipientDetails]);

  const handleChangeInput = () => {
    // console.log("user typing", `${chatId}:${userDetails?.uid}`);
    socket?.emit(socketEvents.START_TYPING, chatId, userDetails?.uid);
  };

  if (!recipientDetails || !recipientDetails.username) {
    return (
      <div className="h-[calc(100vh-60px)] w-full flex flex-col items-center justify-center gap-1">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-4xl font-bold">P</span>
        </div>
      </div>
    );
  } else if (loader === "messages") {
    return (
      <div className="h-[calc(100vh-60px)] w-full flex items-center justify-center gap-2">
        <Spinner />
        <span className="animate-pulse text-gray-300">Loading messages...</span>
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-60px)] w-full flex flex-col">
      <section
        ref={scrollingDiv}
        className="flex flex-col flex-1 py-4 px-16 overflow-y-auto"
      >
        <ChatMessages
          messages={messagesArray}
          recipientDetails={recipientDetails as userType}
          userDetails={userDetails as userType}
        />
      </section>
      <section className="h-[50px] border-t border-border/40">
        <MessageInputWithSubmit
          handleSubmitMessage={handleSendMessage}
          handleDeselectUser={handleDeselectUser}
          handleChangeInput={handleChangeInput}
        />
      </section>
    </div>
  );
}

export default ChatSection;
