import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatMessage, ChatMessagesProps } from "@/src/utilities";
import React from "react";

function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-col w-full h-full gap-3">
      {messages?.length > 0 &&
        messages?.map((message: chatMessage) => {
          return (
            <section key={message.id} className={`flex gap-2 p-2 rounded-md w-fit max-w-4/5 ${message?.is_self ? "bg-black/30 self-end flex-row-reverse" : ""}`} >
              <Avatar title={message?.is_self ? "You" : "Your friend"} className="h-6 w-6 rounded-full overflow-hidden">
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  className="object-cover"
                />
              </Avatar>
              <span className="text-sm" >{message.message}</span>
            </section>
          );
        })}
    </div>
  );
}

export default ChatMessages;
