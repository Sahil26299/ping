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
  endpoints,
  headersList,
  logoutUser,
  emptySessionStorage,
} from "@/src/utilities";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

let typingTimeout: NodeJS.Timeout;

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
  const [loader, setLoader] = useState<"" | "messages" | "chats">("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);

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

  const establishSocketConnection = (user?: userType) => {
    // Step 1.
    // Initialize socket io connection
    const socketInstance = io(
      // "http://localhost:3001",
      "chat-socket-server-production-478b.up.railway.app",
      {
        withCredentials: true,
        transports: ["websocket"],
      }
    );
    // set socket instance to a state variable to use it throughout the screen
    setSocket(socketInstance);
    socketRef.current = socketInstance;

    // Step 2.
    // join user room (dashboard) to receive latest chats
    if (user?.uid) {
      socketInstance?.emit(socketEvents.JOIN_USER_ROOM, user?.uid);
      // console.log(`User ${user?.uid} joined the dashboard.`);
    }

    const recipient = getSessionStorageItem(keys.RECIPIENT_SELECTED);

    // Step 3.
    // Start listening for new chats.
    socketInstance.on(socketEvents.RECEIVE_NEW_CHAT, (msgData) => {
      setUserChatList((prev) => {
        const alreadyExists = prev?.some(
          (chat) => chat.chatRef === msgData.chatId
        );
        if (alreadyExists) {
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
        } else {
          fetchChats(user);
          return prev;
        }
      });
    });

    // Step 4. Below start listening to active status of recipient
    socketInstance?.on(socketEvents.USER_ONLINE, (userId: string) => {
      console.log("User active status: online", userId);
      setOnlineUsers((prev) =>
        prev.includes(userId) || user?.uid === userId ? prev : [...prev, userId]
      );

      setRecipientDetails((prev) => {
        setSessionStorageItem(keys.RECIPIENT_SELECTED, {
          ...prev,
          isOnline: true,
        });
        if (prev && prev?.uid === userId && !prev?.isOnline) {
          return { ...prev, isOnline: true };
        } else {
          return prev;
        }
      });
    });
    socketInstance?.on(socketEvents.USER_OFFLINE, (userId: string) => {
      console.log("User active status: offline", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));

      setRecipientDetails((prev) => {
        setSessionStorageItem(keys.RECIPIENT_SELECTED, {
          ...prev,
          isOnline: false,
          lastActive: new Date(),
        });

        if (prev && prev?.uid === userId && prev?.isOnline) {
          return {
            ...prev,
            isOnline: false,
            lastActive: new Date(),
          };
        } else {
          return prev;
        }
      });
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
          removeSessionStorageItem(keys.RECIPIENT_SELECTED);

          // Connect socket once upon auth
          establishSocketConnection(user);

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

    const handleBeforeUnload = () => {
      handleSetUserOffline();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleSetUserOffline();
    };
  }, []);

  const handleSetUserOffline = async (logout: boolean = true) => {
    // Just remove the listener, don't disconnect the entire socket
    socketRef.current?.off(socketEvents.RECEIVE_MESSAGES_IN_CHAT);
    socketRef?.current?.off(socketEvents.USER_START_TYPING);
    // also stop listening to active status of recipient
    socketRef.current?.off(socketEvents.USER_ONLINE);
    socketRef.current?.off(socketEvents.USER_OFFLINE);
    socketRef.current?.disconnect();
    if (logout) {
      await fetch(endpoints.AUTH_ME, {
        method: "PATCH",
        headers: headersList,
        body: JSON.stringify({ isOnline: false, lastActive: new Date() }),
        keepalive: true, // special key to keep the request ongoing even when browser shuts down
      }).catch((err) => console.error("Failed to update offline status", err));
    }
  };

  const handleLogout = async () => {
    try {
      handleSetUserOffline(false);
      await logoutUser();
    } catch (error) {
    } finally {
      emptySessionStorage();
      router.push("/login");
    }
  };

  // 2. Fetch Global Users
  const fetchUsers = async () => {
    try {
      const res: GenericObjectInterface = await fetchUserList();
      setUsersList(res?.data?.users);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Fetch Chats (Polling)
  // 3. Fetch Chats (Polling)
  const fetchChats = async (
    user: userType | GenericObjectInterface = userDetails
  ) => {
    setLoader("chats");
    try {
      const res: GenericObjectInterface = await fetchUserChats();
      const onlineIds = new Set<string>();

      // Map API chats to frontend expected format
      const mappedChats = res?.data?.chats?.map((c: any) => {
        const recipient = c.participants?.find(
          (u: userType) => u._id !== user.uid
        );

        if (recipient?._id) {
          if (recipient?.isOnline) {
            onlineIds.add(recipient._id);
          }
        }

        return {
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
          recipient: { ...recipient, uid: recipient._id },
          unReadCount: c.unreadCounts?.[user.uid as string] || 0,
        };
      });

      setOnlineUsers((prev) => {
        const newSet = new Set([...prev, ...Array.from(onlineIds)]);
        if (user?.uid) newSet.delete(user.uid);
        return Array.from(newSet);
      });

      setUserChatList(mappedChats);
    } catch (error) {
      console.error("Fetch chats error", error);
    } finally {
      setLoader("");
      setListLoading(false);
    }
  };

  /**
   * Listen for individual chat messages (when user is viewing that chat)
   * @param socketInstance Socket instance to listen on
   */
  const listenForChatMessages = (socketInstance: Socket | null = socketRef.current) => {
    // start listening to new messages in the chat
    socketInstance?.on(socketEvents.RECEIVE_MESSAGES_IN_CHAT, (msg) => {
      addMessageIfUnique(msg);
    });

    // start listening to user's Typing event
    socketInstance?.on(socketEvents.USER_START_TYPING, (userId: string) => {
        // console.log("user started typing", userId);
        setShowTypingIndicator(true);
        // Clear previous timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        // Auto-stop typing after 3 seconds
        typingTimeout = setTimeout(() => {
          // console.log("user stopped typing", userId);
          setShowTypingIndicator(false);
        }, 3000);
      });
  };

  /**
   * Fetch messages for a specific chat (based on chatId)
   * @param currentChatId ID of the chat to fetch messages for
   */
  const fetchMessages = async (currentChatId: string) => {
    if (!currentChatId) return;
    setLoader("messages");
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
      setLoader("");
    }
  };

  const handleSendMessage = async (
    msg: string,
    chat_id: string | null = chatId,
    recipientId: string | null = recipientDetails?.uid
  ) => {
    if (!chat_id) return;
    try {
      const response: GenericObjectInterface = await postChatMessages({
        chatId: chat_id,
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

      socket?.emit(socketEvents.SEND_MESSAGE, newMessage, recipientId, chat_id);

      fetchChats(); // Refresh sidebar list
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleSelectUser = (selectedUser: userType, chatId: string) => {
    const modifiedSelectedUser = {
      ...selectedUser,
      isOnline: onlineUsers.includes(selectedUser.uid),
    };
    // Set chat ID and User details in sessionStorage
    setSessionStorageItem(keys.CHAT_ID, chatId);
    setSessionStorageItem(keys.RECIPIENT_SELECTED, modifiedSelectedUser);

    // Set recipient details and chat ID
    setRecipientDetails(modifiedSelectedUser);
    setChatId(chatId);

    // Join chat room (Socket) to start listening to new messages (real time connection)
    socket?.emit(socketEvents.JOIN_CHAT_ROOM, chatId);

    // After joining a chat room, start listening to messages in that chat
    listenForChatMessages();

    // Reset unread count for the selected chat
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

    // Fetch messages for the selected chat
    fetchMessages(chatId);
  };

  const handleDeselectUser = () => {
    setRecipientDetails({});
    setChatId(null);
    setMessagesArray([]);
    removeSessionStorageItem(keys.CHAT_ID);
    removeSessionStorageItem(keys.RECIPIENT_SELECTED);
    // Just remove the listener, don't disconnect the entire socket
    socketRef?.current?.off(socketEvents.RECEIVE_MESSAGES_IN_CHAT);
    socketRef?.current?.off(socketEvents.USER_START_TYPING);
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
        handleSendMessage={handleSendMessage}
        handleLogout={handleLogout}
      />
      <main className="w-full">
        <section className="h-full w-full">
          <Navbar recipientDetails={recipientDetails} showTypingIndicator={showTypingIndicator} />
          <ChatSection
            recipientDetails={recipientDetails}
            handleSendMessage={handleSendMessage}
            messagesArray={messagesArray}
            handleDeselectUser={handleDeselectUser}
            loader={loader}
            socket={socket}
          />
        </section>
      </main>
    </SidebarProvider>
  );
}

export default Page;
