import React, { useEffect, useState } from "react";
import MessageInputWithSubmit from "./components/MessageInputWithSubmit";
import {
  chatMessage,
  firebaseCollections,
  firestoreGetCollectionOperation,
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  resolveChatUsers,
  resolveUserReference,
  userType,
} from "@/src/utilities";
import ChatMessages from "./components/ChatMessages";

function ChatSection({
  recipientDetails,
}: {
  recipientDetails: userType | GenericObjectInterface;
}) {
  const [messagesArray, setMessagesArray] = useState<chatMessage[]>([]);
  const [userDetails, setUserDetails] = useState<userType | null>(null);

  useEffect(() => {
    if (recipientDetails && recipientDetails?.uid) {
      const userInfo = getSessionStorageItem(keys.USER_DETAILS);
      setUserDetails(userInfo);
      handleFetchMessages(userInfo);
    }
  }, [recipientDetails]);

  const handleFetchMessages = async (userInfo: userType) => {
    try {
      const chatId = [userInfo?.uid, recipientDetails.uid].sort().join("_");
      const messagesCollection = await firestoreGetCollectionOperation(
        firebaseCollections.CHATS,
        chatId,
        firebaseCollections.MESSAGES
      );
      const result: chatMessage[] = (await Promise.all(
        messagesCollection?.map(async (message) => {
          const resolvedReadByUsers = await resolveChatUsers(message?.readBy);
          const resolvedSender = await resolveUserReference(message?.sender);
          return {
            ...message,
            readBy: resolvedReadByUsers,
            sender: resolvedSender,
          };
        }) ?? []
      )) as chatMessage[];
      setMessagesArray(result);
    } catch (error) {}
  };

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
        <ChatMessages messages={messagesArray} recipientDetails={recipientDetails as userType} userDetails={userDetails as userType} />
      </section>
      <section className="h-[50px] border-t border-border/40">
        <MessageInputWithSubmit />
      </section>
    </div>
  );
}

export default ChatSection;
