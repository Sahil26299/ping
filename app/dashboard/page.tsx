"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth, db } from "@/lib/firebase";
import { AppSidebar } from "@/src/components/appSideBar/AppSideBar";
import ChatSection from "@/src/components/chatSection/ChatSection";
import Navbar from "@/src/components/navbar/Navbar";
import {
  chatMessage,
  firebaseCollections,
  firestoreGetCollectionOperation,
  firestoreReferDocOperation,
  firestoreSendMessage,
  firestoreUpdateOperation,
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  listenToChats,
  listenToUsers,
  resolveChatUsers,
  resolveLastMessageSender,
  resolveUserReference,
  setSessionStorageItem,
  userType,
} from "@/src/utilities";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function page() {
  const router = useRouter();
  const [recipientDetails, setRecipientDetails] = useState<
    userType | GenericObjectInterface
  >({});
  const [userDetails, setUserDetails] = useState<
    userType | GenericObjectInterface
  >({});
  const [usersList, setUsersList] = useState<userType[]>([]);
  const [mounted, setMounted] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [userChatList, setUserChatList] = useState<GenericObjectInterface[]>(
    []
  );
  const [messagesArray, setMessagesArray] = useState<chatMessage[]>([]);

  /**
   * onAuthStateChanged is a firebase auth listener which gets triggered automatically when the login status of user changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        handleGetGlobalUsers(user);
      } else {
        router.replace("/login");
      }
    });
    return () => {
      // handleSetUserInactive();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleSessionChange = () => {
      const recipientValue = getSessionStorageItem(keys.RECIPIENT_SELECTED);
      const userValue = getSessionStorageItem(keys.USER_DETAILS);
      if (recipientValue) {
        setRecipientDetails(recipientValue);
        handleFetchMessages(userValue, recipientValue);
      }
      if (userValue) {
        setUserDetails(userValue);
      }
    };

    window.addEventListener("sessionStorageUpdated", handleSessionChange);
    return () => {
      window.removeEventListener("sessionStorageUpdated", handleSessionChange);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userDetails) return;

    // Start listening to Firestore changes
    const unsubscribe = listenToChats(
      userDetails?.uid,
      async (newMessages: GenericObjectInterface[]) => {
        let chatsArray: any = await Promise.all(
          newMessages?.map(async (chat) => {
            const chatExtracted = await getDoc(chat?.chatRef);
            const chatObject = chatExtracted.data() as GenericObjectInterface;
            // Resolve chat users and last message sender in parallel
            const [resolvedUsers, resolvedSender] = await Promise.all([
              resolveChatUsers(chatObject.users || []),
              resolveLastMessageSender(chatObject.lastMessage),
            ]);
            return {
              ...chatObject,
              unReadCount: chat?.unReadCount,
              users: resolvedUsers,
              lastMessage: chatObject.lastMessage
                ? {
                    ...chatObject.lastMessage,
                    sender: resolvedSender,
                  }
                : undefined,
            };
          })
        );
        setUserChatList(chatsArray);
        handleFetchMessages();
      }
    );

    // Stop listening when component unmounts or chatId changes
    return () => unsubscribe();
  }, [userDetails]);

  useEffect(() => {
    console.log(userDetails, "userDetails");

    if (!userDetails?.uid) return;

    // Start listening to Firestore changes
    const unsubscribe = listenToUsers(async (users: userType[]) => {
      handleGetGlobalUsers(userDetails);
      if (recipientDetails?.uid) {
        let recipientValue = users?.find(
          (user) => user?.uid === recipientDetails?.uid
        );
        setSessionStorageItem(keys.RECIPIENT_SELECTED, recipientValue || null);
      }
    });

    // Stop listening when component unmounts
    return () => unsubscribe();
  }, [userDetails?.uid, recipientDetails?.uid]);

  const handleSetUserInactive = async () => {
    try {
      const data = {
        lastActive: serverTimestamp(),
        isOnline: false,
      };
      await firestoreUpdateOperation(firebaseCollections.USERS, data, [
        userDetails?.uid,
      ]);
    } catch (error) {}
  };

  /**
   * Get filtered users list (excluding current user)
   */
  const getUsersList = (
    usersArray: GenericObjectInterface[],
    currentUserId: string
  ): GenericObjectInterface[] => {
    return usersArray?.filter(
      (user: GenericObjectInterface) => user?.uid !== currentUserId
    );
  };

  /**
   * Step 1: Get all users,
   * Step 2: Get user's chat records (recipients),
   * step 3: Save current user, list of other users and chat records in a state
   * @param currentUserDetails
   * @returns
   */
  const handleGetGlobalUsers = async (
    currentUserDetails: GenericObjectInterface
  ) => {
    try {
      // ==================== HELPER FUNCTIONS ====================

      /**
       * Resolve a single chat object with all its references
       */
      const resolveChatObject = async (
        chatRef: GenericObjectInterface
      ): Promise<GenericObjectInterface | null> => {
        try {
          const chatDoc = await getDoc(chatRef?.chatRef);
          if (!chatDoc.exists()) return null;

          const chatObject = chatDoc.data() as GenericObjectInterface;

          // Resolve chat users and last message sender in parallel
          const [resolvedUsers, resolvedSender] = await Promise.all([
            resolveChatUsers(chatObject.users || []),
            resolveLastMessageSender(chatObject.lastMessage),
          ]);

          return {
            ...chatObject,
            unReadCount: chatRef?.unReadCount,
            users: resolvedUsers,
            lastMessage: chatObject.lastMessage
              ? {
                  ...chatObject.lastMessage,
                  sender: resolvedSender,
                }
              : undefined,
          };
        } catch (error) {
          console.error("Error resolving chat object:", error);
          return null;
        }
      };

      /**
       * Fetch and resolve all user chats
       */
      const getUserChats = async (
        userId: string
      ): Promise<GenericObjectInterface[]> => {
        try {
          const chatRefs = await firestoreGetCollectionOperation(
            firebaseCollections.USERS,
            userId,
            firebaseCollections.CHATS
          );

          if (!chatRefs || !Array.isArray(chatRefs)) {
            return [];
          }

          // Resolve all chats in parallel
          const resolvedChats = await Promise.all(
            chatRefs
              ?.filter((chat: GenericObjectInterface) => chat?.chatRef)
              .map(async (chat: GenericObjectInterface) =>
                resolveChatObject(chat)
              )
          );
          console.log(resolvedChats, chatRefs, "resolvedChats");

          return resolvedChats?.filter(Boolean) as GenericObjectInterface[];
        } catch (error) {
          console.error("Error fetching user chats:", error);
          return [];
        }
      };

      /**
       * Update user details in state and session storage
       */
      const updateUserDetails = (user: GenericObjectInterface) => {
        const userDetailsWithApiKey: GenericObjectInterface = {
          ...user,
          apiKey: currentUserDetails?.apiKey,
        };
        setUserDetails(userDetailsWithApiKey);
        setSessionStorageItem(keys.USER_DETAILS, userDetailsWithApiKey);
      };

      // ==================== MAIN LOGIC ====================

      // Fetch all users
      const usersArray = await firestoreGetCollectionOperation(
        firebaseCollections.USERS
      );

      if (!usersArray || !Array.isArray(usersArray)) {
        // console.warn("Users array is invalid or empty");
        return;
      }

      // Find current user
      const currentUser = usersArray.find(
        (user: GenericObjectInterface) => user?.uid === currentUserDetails?.uid
      );

      if (!currentUser) {
        // console.warn("Current user not found in users array");
        return;
      }

      // Set users list (excluding current user) and fetch chats in parallel
      const [filteredUsersList, userChats] = await Promise.all([
        Promise.resolve(getUsersList(usersArray, currentUserDetails.uid)),
        getUserChats(currentUser.uid),
      ]);
      console.log(userChats, "userChats");

      setUsersList(filteredUsersList as userType[]);
      setUserChatList(userChats);

      // Update user details
      updateUserDetails(currentUser);
    } catch (error) {
      console.error("Error in handleGetGlobalUsers:", error);
    } finally {
      setListLoading(false);
    }
  };

  const handleReadMessages = async (
    userInfo: userType = userDetails as userType,
    recipientInfo: userType = recipientDetails as userType
  ) => {
    try {
      const chatId = [userInfo?.uid, recipientInfo.uid].sort().join("_");
      await firestoreUpdateOperation(
        `${firebaseCollections.USERS}/${userInfo?.uid}/${firebaseCollections.CHATS}/${chatId}`,
        { unReadCount: 0 },
        []
      );
    } catch (error) {}
  };

  const handleFetchMessages = async (
    userInfo: userType = userDetails as userType,
    recipientInfo: userType = recipientDetails as userType
  ) => {
    try {
      const chatId = [userInfo?.uid, recipientInfo.uid].sort().join("_");

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
      console.log(result, "result");

      handleReadMessages(userInfo, recipientInfo);
      setMessagesArray(result?.sort((a, b) => a?.messageId - b?.messageId));
    } catch (error) {}
  };

  const handleSendMessage = async (msg: string) => {
    const newChats: chatMessage = {
      messageId: messagesArray?.length,
      createdAt: new Date(),
      mediaFiles: [],
      messageType: "text",
      readBy: [userDetails as userType],
      sender: userDetails as userType,
      text: msg,
    };
    setMessagesArray((prev) => [...prev, newChats]);
    try {
      const chatId = [userDetails?.uid, recipientDetails.uid].sort().join("_");
      const userChatDoc = doc(
        db,
        `${firebaseCollections.USERS}/${userDetails?.uid}/${firebaseCollections.CHATS}/${chatId}`
      );
      const chatDocs = await getDoc(userChatDoc);
      console.log(
        chatDocs?.exists(),
        chatDocs?.data()?.unReadCount,
        "user caht docs"
      );
      firestoreSendMessage(
        userDetails as userType,
        recipientDetails as userType,
        msg,
        chatDocs?.data()?.unReadCount,
        messagesArray?.length + 1
      );
    } catch (error) {}
  };
  console.log(recipientDetails, "recipientDetails");

  if (!mounted) {
    return null;
  }
  return (
    <SidebarProvider className="">
      <AppSidebar
        userDetails={userDetails}
        recipientDetails={recipientDetails}
        usersList={usersList}
        listLoading={listLoading}
        chatList={userChatList}
      />
      <main className="w-full">
        <section className="h-full w-full">
          <Navbar recipientDetails={recipientDetails} />
          <ChatSection
            recipientDetails={recipientDetails}
            handleSendMessage={handleSendMessage}
            messagesArray={messagesArray}
          />
        </section>
      </main>
    </SidebarProvider>
  );
}

export default page;
