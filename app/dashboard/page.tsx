"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/src/components/appSideBar/AppSideBar";
import ChatSection from "@/src/components/chatSection/ChatSection";
import Navbar from "@/src/components/navbar/Navbar";
import {
  chatMessage,
  fetchChatMessages,
  fetchUserChats,
  fetchUserList,
  fetchUserProfile,
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  postChatMessages,
  removeSessionStorageItem,
  setSessionStorageItem,
  socketEvents,
  userType,
  markChatAsRead,
} from "@/src/utilities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

function Page() {
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
  const [loader, setLoader] = useState<"" | "messages" | "chats">("")
  const [chatId, setChatId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Helper function to add message with uniqueness check
  const addMessageIfUnique = (newMessage: chatMessage) => {
    setMessagesArray((prev) => {
      // Check if message already exists
      const exists = prev.some((msg) => msg.messageId === newMessage.messageId);
      
      if (exists) {
        return prev; // Don't add if it already exists
      }
      return [...prev, newMessage];
    });
  };

  const listenForChatMessages = (socketInstance: Socket | null = socket) => {
    // Listen for individual chat messages (when user is viewing that chat)
    socketInstance?.on(socketEvents.RECEIVE_CHAT_MESSAGE, (msg) => {
      addMessageIfUnique(msg);
    });
  };

  const establishSocketConnection = (userId?: string) => {
    const socketInstance = io(
      "chat-socket-server-production-478b.up.railway.app",
      {
        withCredentials: true,
        transports: ["websocket"],
      }
    );
    setSocket(socketInstance);
    // join user room to receive latest chats
    if (userId) {
      // join user room to receive latest chats
      socketInstance?.emit(socketEvents.JOIN_USER_ROOM, userId);
    }

    // listen for each chats.
    socketInstance.on(socketEvents.USER_MESSAGE, (msgData) => {
      const recipient = getSessionStorageItem(keys.RECIPIENT_SELECTED);

      setUserChatList((prev) => {
        const updatedChats = prev?.map((chat) => {

          if (chat.chatRef === msgData.chatId) {
            let finalCount = chat.unReadCount + msgData?.unreadIncrement;

            // if recipient is selected AND matches the sender
            if (
              recipient &&
              (msgData?.lastMessage?.sender?.uid === recipient?._id ||
                msgData?.lastMessage?.sender?.uid === recipient?.uid)
            ) {
              finalCount = 0; // Reset to 0 if chat is open
              // Chat is open, mark as read in DB so it doesn't show as unread on refresh
              markChatAsRead(msgData.chatId);
            }

            return {
              ...chat,
              lastMessage: msgData?.lastMessage,
              unReadCount: finalCount,
            };
          }
          return chat;
        });

        return updatedChats?.sort(
          (a, b) => a?.lastMessage?.sentAt - b?.lastMessage?.sentAt
        );
      });
    });

    listenForChatMessages(socketInstance);
  };

  // 1. Auth Check & Socket Connection
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res: GenericObjectInterface = await fetchUserProfile();
        if (res.status === 200) {
          const user = res?.data?.user;
          setUserDetails(user);
          setSessionStorageItem(keys.USER_DETAILS, user);
          removeSessionStorageItem(keys.RECIPIENT_SELECTED);

          // Connect socket once upon auth
          establishSocketConnection(user?.uid);

          // Load initial data
          fetchUsers();
          fetchChats(user);
        } else if (res?.status === 401) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.replace("/login");
      }
    };
    checkAuth();

    // Cleanup: disconnect socket when component unmounts
    return () => {
      socket?.disconnect();
    };
  }, []);

  // 2. Fetch Global Users
  const fetchUsers = async () => {
    try {
      const res: GenericObjectInterface = await fetchUserList();
      setUsersList(res?.data?.users);
    } catch (error) {
      console.error(error);
    } finally {
      setListLoading(false);
    }
  };

  // 3. Fetch Chats (Polling)
  const fetchChats = async (
    user: userType | GenericObjectInterface = userDetails
  ) => {
    setLoader("chats")
    try {
      const res: GenericObjectInterface = await fetchUserChats();
      // Map API chats to frontend expected format
      const mappedChats = res?.data?.chats?.map((c: any) => ({
        chatRef: c._id,
        users: c.participants?.map((u: userType) => ({ ...u, uid: u._id })),
        lastMessage: c.lastMessage
          ? {
              text: c.lastMessage.content,
              sentAt: c.lastMessage.timestamp,
              sender: {
                ...c.lastMessage.sender,
                uid: c.lastMessage.sender._id,
              },
            }
          : null,
        unReadCount: c.unreadCounts?.[user.uid as string] || 0,
      }));
      // establishSocketConnection(user?.uid); // Removed to prevent duplicate sockets
      setUserChatList(mappedChats);
    } catch (error) {
      console.error("Fetch chats error", error);
    } finally {
      setLoader("")
    }
  };

  // // 4. Client-side Session Restoration
  // useEffect(() => {
  //   const handleSessionChange = () => {
  //     const chatId = getSessionStorageItem(keys.CHAT_ID);
  //     const recipientValue = getSessionStorageItem(keys.RECIPIENT_SELECTED);
  //     if (chatId && recipientValue) {
  //       setChatId(chatId);
  //       setRecipientDetails(recipientValue);
  //     }
  //   };

  //   handleSessionChange(); // Run once on mount

  //   window.addEventListener("sessionStorageUpdated", handleSessionChange);
  //   return () => {
  //     window.removeEventListener("sessionStorageUpdated", handleSessionChange);
  //   };
  // }, []);

  // 5. Fetch Messages
  const fetchMessages = async (currentChatId: string) => {
    if (!currentChatId) return;
    setLoader("messages")
    try {
      const res: GenericObjectInterface = await fetchChatMessages(
        currentChatId
      );
      const mappedMessages = res.data.messages.map((m: any) => ({
        messageId: m._id,
        text: m.content,
        sender: m.sender,
        createdAt: m.createdAt,
        readBy: m.readBy,
        messageType: "text",
        mediaFiles: [],
      }));
      setMessagesArray(mappedMessages);
    } catch (error) {
      console.error("Fetch messages error", error);
    } finally {
      setLoader("")
    }
  };

  const handleSendMessage = async (msg: string) => {
    if (!chatId) return;
    try {
      const response: GenericObjectInterface = await postChatMessages({
        chatId,
        content: msg,
        type: "text",
      });
      const newMessage: chatMessage = {
        messageId: response?.data?.message?._id,
        text: response?.data?.message?.content,
        sender: response?.data?.message?.sender,
        createdAt: response?.data?.message?.createdAt,
        readBy: response?.data?.message?.readBy,
        messageType: "text",
        mediaFiles: [],
      };
      addMessageIfUnique(newMessage);

      socket?.emit(
        socketEvents.SEND_MESSAGE,
        newMessage,
        recipientDetails?.uid,
        chatId
      );

      fetchChats(); // Refresh sidebar list
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleSelectUser = (selectedUser: userType, chatId: string) => {
    setSessionStorageItem(keys.CHAT_ID, chatId);
    setSessionStorageItem(keys.RECIPIENT_SELECTED, selectedUser);
    socket?.emit(socketEvents.JOIN_CHAT_ROOM, chatId);
    listenForChatMessages();
    // socket?.emit(socketEvents.JOIN_CHAT, chatId);
    setUserChatList((prev) => {
      return prev.map((chat) => {
        if (chat.chatRef === chatId) {
          return {
            ...chat,
            unReadCount: 0,
          };
        }
        return chat;
      });
    });
    setRecipientDetails(selectedUser);
    setChatId(chatId);
    fetchMessages(chatId);
  };

  const handleDeselectUser = () => {
    setRecipientDetails({});
    setChatId(null);
    setMessagesArray([]);
    removeSessionStorageItem(keys.CHAT_ID);
    removeSessionStorageItem(keys.RECIPIENT_SELECTED);
    // Just remove the listener, don't disconnect the entire socket
    socket?.off(socketEvents.RECEIVE_CHAT_MESSAGE);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarProvider className="">
      <AppSidebar
        userDetails={userDetails}
        recipientDetails={recipientDetails}
        usersList={usersList}
        listLoading={listLoading}
        chatList={userChatList}
        handleSelectUser={handleSelectUser}
      />
      <main className="w-full">
        <section className="h-full w-full">
          <Navbar recipientDetails={recipientDetails} />
          <ChatSection
            recipientDetails={recipientDetails}
            handleSendMessage={handleSendMessage}
            messagesArray={messagesArray}
            handleDeselectUser={handleDeselectUser}
            loader={loader}
          />
        </section>
      </main>
    </SidebarProvider>
  );
}

export default Page;
