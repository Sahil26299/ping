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
  setSessionStorageItem,
  socketEvents,
  userType,
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
  const [chatId, setChatId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const establishSocketConnection = (
    userId?: string,
    mappedChats?: GenericObjectInterface[]
  ) => {
    const socketInstance = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(socketInstance);
    // join user room to receive latest chats
    if (userId) {
      console.log(userId, "userId");
      // join user room to receive latest chats
      socketInstance?.emit(socketEvents.JOIN_USER_ROOM, userId);
    }

    if (!recipientDetails || !recipientDetails.username) {
      socketInstance.on(socketEvents.USER_MESSAGE, (msgData) => {
        console.log(
          "A user sent a message:",
          recipientDetails,
          msgData,
          mappedChats
        );
        const updatedChats = mappedChats?.map((chat) => {
          if (chat.chatRef === msgData.chatId) {
            return {
              ...chat,
              lastMessage: msgData?.lastMessage,
              unReadCount: chat.unReadCount + msgData?.unreadIncrement,
            };
          }
          return chat;
        });
        if (updatedChats && updatedChats?.length > 0) {
          console.log(
            updatedChats?.sort(
              (a, b) => a?.lastMessage?.sentAt - b?.lastMessage?.sentAt
            ),
            "updatedChats user sent"
          );
          setUserChatList(
            updatedChats?.sort(
              (a, b) => a?.lastMessage?.sentAt - b?.lastMessage?.sentAt
            )
          );
        }
      });
    }

    // Listen for individual chat messages (when user is viewing that chat)
    socketInstance.on(socketEvents.RECEIVE_CHAT_MESSAGE, (msg) => {
      console.log("A message received:", msg, userChatList);
      setMessagesArray((prev) => [...prev, msg]);
    });
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
      establishSocketConnection(user?.uid, mappedChats);
      setUserChatList(mappedChats);
    } catch (error) {
      console.error("Fetch chats error", error);
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
    }
  };

  const handleSendMessage = async (msg: string) => {
    console.log(msg, chatId, "msgmsg");
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
      console.log([...messagesArray, newMessage], "newMessage");
      setMessagesArray((prev) => [...prev, newMessage]);

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
    setSessionStorageItem(keys.CHAT_ID, null);
    setSessionStorageItem(keys.RECIPIENT_SELECTED, null);
    // Just remove the listener, don't disconnect the entire socket
    socket?.off(socketEvents.RECEIVE_CHAT_MESSAGE);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log(userChatList, "userChatList");

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
          />
        </section>
      </main>
    </SidebarProvider>
  );
}

export default Page;
