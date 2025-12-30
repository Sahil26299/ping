import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { chatMessage, ChatMessagesProps } from "@/src/utilities";
import React from "react";

function ChatMessages({
  messages,
  recipientDetails,
  userDetails,
}: ChatMessagesProps) {
  
  return (
    <div className="flex flex-col w-full h-full gap-3">
      {messages?.length > 0 &&
        messages?.map((message: chatMessage) => {
          console.log(userDetails?.uid, message, messages, 'userDetails x message');
          
          return (
            <section
              key={message?.messageId}
              className={`flex gap-2 p-2 rounded-md w-fit max-w-4/5 ${
                message?.sender?.uid === userDetails?.uid ? "bg-black/30 self-end flex-row-reverse" : ""
              }`}
            >
              <Avatar
                title={message?.sender?.uid === userDetails?.uid ? "You" : "Your friend"}
                className="h-6 w-6 rounded-full overflow-hidden"
              >
                <AvatarImage
                  src={message?.sender?.uid === userDetails?.uid ? userDetails?.profilePicture : recipientDetails?.profilePicture}
                  className="object-cover"
                />
              </Avatar>
              <div className="text-sm" dangerouslySetInnerHTML={{"__html": message.text}} ></div>
            </section>
          );
        })}
    </div>
  );
}

export default ChatMessages;
