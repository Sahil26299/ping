import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatMessage, ChatMessagesProps, convertFirestoreTimestamp } from "@/src/utilities";
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
          return (
            <section
              key={convertFirestoreTimestamp(message?.createdAt)?.toString()}
              className={`flex gap-2 p-2 rounded-md w-fit max-w-4/5 ${
                message?.sender?.uid === userDetails?.uid ? "bg-black/30 self-end flex-row-reverse" : ""
              }`}
            >
              <Avatar
                title={message?.sender?.uid === userDetails?.uid ? "You" : "Your friend"}
                className="h-6 w-6 rounded-full overflow-hidden"
              >
                <AvatarImage
                  src={message?.sender?.uid === userDetails?.uid ? userDetails?.profilePic : recipientDetails?.profilePic}
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
