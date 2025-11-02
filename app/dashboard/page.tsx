"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/firebase";
import { AppSidebar } from "@/src/components/appSideBar/AppSideBar";
import ChatSection from "@/src/components/chatSection/ChatSection";
import Navbar from "@/src/components/navbar/Navbar";
import {
  firebaseCollections,
  firestoreGetCollectionOperation,
  firestoreReferDocOperation,
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  listenToChats,
  setSessionStorageItem,
  userType,
} from "@/src/utilities";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";
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
  const [usersList, setUsersList] = useState<GenericObjectInterface>([]);
  const [mounted, setMounted] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [userChatList, setUserChatList] = useState<GenericObjectInterface[]>(
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userDetails) return;

    // Start listening to Firestore changes
    const unsubscribe = listenToChats(userDetails?.uid, (newMessages: GenericObjectInterface[]) => {
      console.log(newMessages,'newMessages');
      toast("Message recieved")
      // setMessages(newMessages);
    });

    // Stop listening when component unmounts or chatId changes
    return () => unsubscribe();
  }, [userDetails]);

  const handleGetGlobalUsers = async (
    currentUserDetails: GenericObjectInterface
  ) => {
    try {
      // ==================== HELPER FUNCTIONS ====================

      /**
       * Get filtered users list (excluding current user)
       */
      const getUsersList = (
        usersArray: GenericObjectInterface[],
        currentUserId: string
      ): GenericObjectInterface[] => {
        return usersArray.filter(
          (user: GenericObjectInterface) => user?.uid !== currentUserId
        );
      };

      /**
       * Resolve a single user reference from Firestore
       */
      const resolveUserReference = async (
        userRef: any
      ): Promise<GenericObjectInterface | null> => {
        try {
          if (!userRef?.path) return null;
          const userDocRef = firestoreReferDocOperation(userRef.path);
          const userDoc = await getDoc(userDocRef);
          return userDoc?.exists()
            ? (userDoc.data() as GenericObjectInterface)
            : null;
        } catch (error) {
          console.error("Error resolving user reference:", error);
          return null;
        }
      };

      /**
       * Resolve all user references in a chat
       */
      const resolveChatUsers = async (
        userRefs: any[]
      ): Promise<GenericObjectInterface[]> => {
        const resolvedUsers = await Promise.all(
          userRefs.map(resolveUserReference)
        );
        return resolvedUsers.filter(Boolean) as GenericObjectInterface[];
      };

      /**
       * Resolve last message sender reference
       */
      const resolveLastMessageSender = async (
        lastMessage: GenericObjectInterface | undefined
      ): Promise<GenericObjectInterface | null> => {
        try {
          if (!lastMessage?.sender?.path) return null;
          const senderRef = firestoreReferDocOperation(lastMessage.sender.path);
          const senderDoc = await getDoc(senderRef);
          return senderDoc.exists()
            ? (senderDoc.data() as GenericObjectInterface)
            : null;
        } catch (error) {
          console.error("Error resolving last message sender:", error);
          return null;
        }
      };

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
              .filter((chat: GenericObjectInterface) => chat?.chatRef)
              .map(async (chat: GenericObjectInterface) =>
                resolveChatObject(chat)
              )
          );

          return resolvedChats.filter(Boolean) as GenericObjectInterface[];
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
        console.warn("Users array is invalid or empty");
        return;
      }

      console.log(usersArray, "usersArray");

      // Find current user
      const currentUser = usersArray.find(
        (user: GenericObjectInterface) => user?.uid === currentUserDetails?.uid
      );

      if (!currentUser) {
        console.warn("Current user not found in users array");
        return;
      }

      // Set users list (excluding current user) and fetch chats in parallel
      const [filteredUsersList, userChats] = await Promise.all([
        Promise.resolve(getUsersList(usersArray, currentUserDetails.uid)),
        getUserChats(currentUser.uid),
      ]);

      setUsersList(filteredUsersList);
      console.log(userChats, "userChats");
      setUserChatList(userChats);

      // Update user details
      updateUserDetails(currentUser);
    } catch (error) {
      console.error("Error in handleGetGlobalUsers:", error);
    } finally {
      setListLoading(false);
    }
  };

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
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleSessionChange = () => {
      const recipientValue = getSessionStorageItem(keys.RECIPIENT_SELECTED);
      const userValue = getSessionStorageItem(keys.USER_DETAILS);
      if (recipientValue) {
        setRecipientDetails(recipientValue);
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
          <ChatSection recipientDetails={recipientDetails} />
        </section>
      </main>
    </SidebarProvider>
  );
}

export default page;
