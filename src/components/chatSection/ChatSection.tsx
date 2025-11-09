import React, { useEffect, useState } from "react";
import MessageInputWithSubmit from "./components/MessageInputWithSubmit";
import {
  chatMessage,
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  userType,
} from "@/src/utilities";
import ChatMessages from "./components/ChatMessages";

function ChatSection({
  messagesArray,
  recipientDetails,
  handleSendMessage
}: {
  messagesArray: chatMessage[];
  recipientDetails: userType | GenericObjectInterface;
  handleSendMessage: (param:string) => void
}) {
  const [userDetails, setUserDetails] = useState<userType | null>(null);


  useEffect(() => {
    if (recipientDetails && recipientDetails?.uid) {
      const userInfo = getSessionStorageItem(keys.USER_DETAILS);
      // handleReadMessages(userInfo);
      setUserDetails(userInfo);
      // handleFetchMessages(userInfo);
    }
  }, [recipientDetails]);

  if (!recipientDetails || !recipientDetails.user_name) {
    return (
      <div className="h-[calc(100vh-60px)] w-full flex flex-col items-center justify-center gap-1">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-4xl font-bold">P</span>
        </div>
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-60px)] w-full flex flex-col">
      <section className="flex flex-col flex-1 py-4 px-16 overflow-y-auto">
        <ChatMessages
          messages={messagesArray}
          recipientDetails={recipientDetails as userType}
          userDetails={userDetails as userType}
        />
      </section>
      <section className="h-[50px] border-t border-border/40">
        <MessageInputWithSubmit handleSubmitChat={handleSendMessage} />
      </section>
    </div>
  );
}

export default ChatSection;
