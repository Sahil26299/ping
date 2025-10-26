import React, { useState } from "react";
import MessageInputWithSubmit from "./components/MessageInputWithSubmit";
import { chatMessage, GenericObjectInterface, userType } from "@/src/utilities";
import ChatMessages from "./components/ChatMessages";

function ChatSection({
  recipientDetails,
}: {
  recipientDetails: userType | GenericObjectInterface;
}) {
  const [messagesArray, setMessagesArray] = useState<chatMessage[]>([
    {
      id: 0,
      created_at: new Date(),
      is_self: true,
      message: "Hi",
      recipient: 0,
      sender: 1,
    },
    {
      id: 1,
      created_at: new Date(),
      is_self: false,
      message: "Hi, how are you?",
      recipient: 1,
      sender: 0,
    },
  ]);

  if (!recipientDetails || !recipientDetails.name) {
    return (
      <div className="h-[calc(100vh-60px)] w-full flex flex-col items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-3xl font-bold">P</span>
        </div>
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-60px)] w-full flex flex-col">
      <section 
        className="flex flex-col flex-1 py-4 px-16 overflow-y-auto"
      >
        <ChatMessages messages={messagesArray} />
      </section>
      <section className="h-[50px] border-t border-border/40">
        <MessageInputWithSubmit />
      </section>
    </div>
  );
}

export default ChatSection;
