import {
  Settings,
  HelpCircle,
  LogOut,
  User,
  SearchCheck,
  Users,
  Heart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import CustomSearchInput from "../animatedSeachInput/CustomSearchInput";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  firebaseCollections,
  firestoreGetCollectionOperation,
  firestoreReferDocOperation,
  firestoreSetOperation,
  firestoreUpdateOperation,
  GenericObjectInterface,
  inputChangeEventType,
  keys,
  setSessionStorageItem,
  userType,
} from "@/src/utilities";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import ProfilePictureDialogue from "../profilePicDialogBox/ProfilePictureDialogue";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import LottieAnimationProvider from "../lottieAnimProvider/LottieAnimationProvider";
import chatAnimationEmptySpace from "@/public/lottieFiles/chatAnimationEmptySpace.json";

export function AppSidebar({
  recipientDetails,
  usersList,
  userDetails,
  listLoading,
  chatList,
}: {
  recipientDetails: userType | GenericObjectInterface;
  userDetails: userType | GenericObjectInterface;
  usersList: GenericObjectInterface;
  listLoading: boolean;
  chatList: GenericObjectInterface[];
}) {
  const [searchedText, setSearchedText] = useState("");
  const [openProfilePicture, setOpenProfilePicture] = useState(false);
  const [imageSrc, setimageSrc] = useState("");
  const [imageSrcFinal, setImageSrcFinal] = useState("");
  const [submittingImage, setSubmittingImage] = useState(false);
  const [pingUserSelected, setPingUserSelected] = useState<userType | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageSrcFinal(userDetails.profilePic || "");
  }, [userDetails]);

  const handleSearch = (value: string) => {
    setSearchedText(value);
  };

  const searchResults = useMemo(() => {
    let result = {
      users: usersList,
    };
    if (searchedText !== "") {
      result = {
        users: usersList.filter((el: userType) =>
          el?.user_name?.toLowerCase()?.includes(searchedText)
        ),
      };
    }

    return result;
  }, [searchedText]);

  const handleClick = (user: userType) => {
    setSessionStorageItem(keys.RECIPIENT_SELECTED, user);
  };

  const handleLogout = async () => {
    try {
      // update the login status and last active status of the user
      const data = {
        lastActive: serverTimestamp(),
        isOnline: false,
      };
      await firestoreUpdateOperation(firebaseCollections.USERS, data, [
        userDetails?.uid,
      ]);
      // call the signout function of firebase firestore which automatically logs user out.
      // this event is triggered in the firebase auth model and immediately triggers an event which can be catched using onAuthStateChanged() in realtime.
      await signOut(auth);
    } catch (error) {}
  };

  const handleProfilePicChange = () => {
    if (fileInputRef?.current) {
      fileInputRef?.current?.click();
    }
  };
  const handleProfilDialogClose = useCallback(
    (croppedImage?: string) => {
      if (croppedImage !== undefined) {
        setImageSrcFinal(croppedImage);
        handleSubmitImage(croppedImage);
      }
      setOpenProfilePicture(false);
    },
    [userDetails]
  );

  const handleSubmitImage = async (croppedImage: string) => {
    setSubmittingImage(true);
    try {
      const data = {
        profilePic: croppedImage,
      };
      await firestoreUpdateOperation(firebaseCollections.USERS, data, [
        userDetails?.uid,
      ]);
      toast("Profile pic updated!");
    } catch (error) {
      console.log(error, "error");
    } finally {
      setSubmittingImage(false);
    }
  };

  const handleDrop = (files: inputChangeEventType) => {
    if (files?.target?.files?.length && files?.target?.files?.length > 0) {
      setOpenProfilePicture(true);
      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result;
        setimageSrc(binaryStr as string);
      };
      if (files?.target?.files) {
        reader.readAsDataURL(files?.target?.files["0"] as Blob);
      }
    }
  };

  const handleSendMessage = async () => {
    try {
      // find out whether current user chats contains
      const isAlreadyAdded = chatList?.some(
        (chat) =>
          chat?.users?.find(
            (user: userType) => user?.uid === pingUserSelected?.uid
          ) !== undefined
      );

      console.log(isAlreadyAdded, chatList, "isAlreadyAdded");

      if (!chatList || chatList?.length === 0 || !isAlreadyAdded) {
        // this is a new user to start chat with
        const chatRef = collection(db, firebaseCollections.CHATS);
        const userDocRef = firestoreReferDocOperation(
          firebaseCollections.USERS,
          userDetails.uid
        );
        const recipientDocRef = firestoreReferDocOperation(
          firebaseCollections.USERS,
          pingUserSelected?.uid
        );
        // save this new chat
        const newChatRef = await addDoc(chatRef, {
          chatName: null,
          chatImage: null,
          isGroup: false,
          users: [userDocRef, recipientDocRef],
          createdAt: serverTimestamp(),
          lastMessage: {
            text: "Hi!",
            sender: userDocRef,
            createdAt: serverTimestamp(),
          },
        });
        // now save this new chats per both the users
        let perUserChats = {
          chatRef: newChatRef,
          unReadCount: 0,
        };
        await Promise.all([
          firestoreSetOperation(
            `${firebaseCollections.USERS}/${userDetails?.uid}/${firebaseCollections.CHATS}/${newChatRef?.id}`,
            perUserChats,
            []
          ),
          firestoreSetOperation(
            `${firebaseCollections.USERS}/${pingUserSelected?.uid}/${firebaseCollections.CHATS}/${newChatRef?.id}`,
            { ...perUserChats, unReadCount: 1 },
            []
          ),
        ]);
        if (pingUserSelected) {
          handleClick(pingUserSelected);
        }
      }
    } catch (error) {}
  };

  const extractRecipientFromChatUsers = (usersArray: userType[]) => {
    return usersArray?.find((el) => el?.uid !== userDetails?.uid);
  };

  /**
   * Return the users which are not yet added to chats
   */
  const usersListMemoized = useMemo(() => {
    return usersList?.filter((user: userType) => {
      return !chatList?.some((chat: GenericObjectInterface) =>
        chat?.users?.find((chatUsers: userType) => chatUsers?.uid === user?.uid)
      );
    });
  }, [usersList, chatList]);

  return (
    <Sidebar className="border-border/40">
      <SidebarHeader className="border-b border-border/40 h-[60px]">
        {listLoading ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-[25px] w-[25px] rounded-full bg-border" />
            <Skeleton className="h-[15px] w-[100px] rounded-full bg-border" />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2">
            <Dialog open={openProfilePicture}>
              <Button
                className="h-8 w-8 rounded-full overflow-hidden p-0"
                onClick={handleProfilePicChange}
              >
                {submittingImage ? (
                  <Spinner />
                ) : (
                  <Avatar className="h-full w-full flex items-center justify-center">
                    <AvatarImage
                      src={imageSrcFinal}
                      className="object-contain h-full w-full"
                    />
                    <AvatarFallback>
                      {userDetails.user_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
              <input
                ref={fileInputRef}
                title="File"
                type="file"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg"
                name="imageUpload"
                id=""
                onChange={handleDrop}
              />
              <ProfilePictureDialogue
                onClose={handleProfilDialogClose}
                imageSrc={imageSrc}
              />
            </Dialog>

            <section className="flex flex-col">
              <span className="text-[16px] font-semibold leading-5">
                {userDetails?.user_name} (You)
              </span>
              <span className="text-[11px] font-medium text-green-500 leading-3.5">
                Online
              </span>
            </section>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="overflow-hidden ">
        <SidebarGroup>
          <CustomSearchInput
            variant="outlined"
            searchedText={searchedText}
            handleSearch={handleSearch}
            dimensions={{ height: 35, width: "98%" }}
            placeholders={["Users", "Groups"]}
          />
        </SidebarGroup>
        {listLoading ? (
          <div className="flex flex-col gap-3 px-2">
            {[1, 2, 3, 4, 5]?.map((el) => (
              <div key={el} className="flex items-center gap-2">
                <Skeleton className="h-[25px] w-[25px] rounded-full bg-border" />
                <Skeleton className="h-[15px] w-[100px] rounded-full bg-border" />
              </div>
            ))}
          </div>
        ) : searchedText === "" ? (
          <>
            <SidebarGroup className="flex flex-col gap-4">
              <SidebarGroupLabel className="flex items-center justify-between gap-2 p-0">
                Chats
                <Image
                  alt="Icon that represents global profiles title"
                  src={"/assets/chats.svg"}
                  width={25}
                  height={25}
                />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {chatList?.length > 0 ? (
                  <SidebarMenu>
                    {chatList.map((chat: GenericObjectInterface) => {
                      const chatRecipient = extractRecipientFromChatUsers(
                        chat?.users
                      );
                      if (chatRecipient) {
                        return (
                          <SidebarMenuItem key={chatRecipient?.uid}>
                            <SidebarMenuButton
                              onClick={() => handleClick(chatRecipient)}
                              asChild
                              className={`h-[45px] p-2 cursor-pointer flex items-center justify-between hover:bg-background active:bg-background ${
                                recipientDetails?.uid === chatRecipient?.uid
                                  ? "bg-background"
                                  : ""
                              }`}
                            >
                              <div>
                                <section className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                                    <AvatarImage
                                      src={chatRecipient?.profilePic}
                                      className="object-cover"
                                    />
                                    <AvatarFallback>
                                      {chatRecipient?.user_name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <section className="flex flex-col">
                                    <span
                                      className={`flex items-center gap-2${
                                        recipientDetails?.uid ===
                                        chatRecipient?.uid
                                          ? "text-secondary-foreground"
                                          : ""
                                      }`}
                                    >
                                      {chatRecipient?.user_name}
                                      {chat?.unReadCount !== 0 && (
                                        <sup className="h-4 w-4 text-[11px] font-medium rounded-full bg-green-600 flex flex-col items-center justify-center">
                                          {chat?.unReadCount}
                                        </sup>
                                      )}
                                    </span>
                                    <span className="text-[12px] font-medium text-slate-400 leading-3.5">
                                      {chat?.lastMessage?.text}
                                    </span>
                                  </section>
                                </section>
                                {chatRecipient?.isOnline && (
                                  <div className="h-[6px] w-[6px] rounded-full bg-green-600">
                                    <div className="h-[6px] w-[6px] rounded-full bg-green-200 animate-ping" />
                                  </div>
                                )}
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      }
                    })}
                  </SidebarMenu>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <LottieAnimationProvider
                      animationFile={chatAnimationEmptySpace}
                      height={100}
                      width={100}
                    />
                    <span className="text-sm text-slate-400 ">
                      No chats yet?
                    </span>
                    <span className="text-[12px] text-slate-400">
                      👉 Ping user
                    </span>
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator className="bg-border/40" />
            <SidebarGroup className="flex flex-col gap-4">
              <SidebarGroupLabel className=" flex items-center justify-between gap-2 p-0">
                Users present globally
                <Image
                  alt="Icon that represents global profiles title"
                  src={"/assets/global2.svg"}
                  width={25}
                  height={25}
                />
              </SidebarGroupLabel>
              <SidebarGroupContent className="">
                <SidebarMenu>
                  <Dialog>
                    {usersListMemoized?.map((user: userType) => (
                      <SidebarMenuItem key={user.uid}>
                        <SidebarMenuButton
                          // onClick={() => handleClick(user)}
                          asChild
                          className={`h-[45px] group/aGroup p-2 cursor-pointer flex items-center justify-between hover:bg-transparent active:bg-transparent`}
                        >
                          <div>
                            <section className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                                <AvatarImage
                                  src={user.profilePic}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {user.user_name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={`${
                                  recipientDetails?.uid === user?.uid
                                    ? "text-secondary-foreground"
                                    : ""
                                }`}
                              >
                                {user.user_name}
                              </span>
                            </section>
                            <DialogTrigger
                              onClick={() => setPingUserSelected(user)}
                              className="opacity-0 group-hover/aGroup:opacity-100 h-[24px] text-sm font-normal bg-primary px-2 rounded-md cursor-pointer"
                            >
                              Ping
                            </DialogTrigger>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Start chatting?</DialogTitle>
                        <DialogDescription>
                          Send Hi! to {pingUserSelected?.user_name}.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div className="flex items-center gap-4">
                          <DialogClose
                            onClick={handleSendMessage}
                            className="py-1 rounded-md px-4 bg-primary text-white cursor-pointer"
                          >
                            Continue
                          </DialogClose>
                          <DialogClose className="py-1 rounded-md px-4 border-primary border text-white cursor-pointer">
                            Cancel
                          </DialogClose>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator className="bg-border/40" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 px-2">
              <SearchCheck size={18} />
              <span className="text-sm italic text-white/60 w-4/5 text-wrap line-clamp-2 ">
                {Object.values(searchResults)?.flat()?.length > 0
                  ? `Search results for “${searchedText}”!`
                  : `No matching results found for “${searchedText}”!`}
              </span>
            </div>
            {searchResults &&
              Object.values(searchResults)?.flat()?.length > 0 &&
              Object.keys(searchResults)?.map((resultType) => {
                return (
                  <SidebarGroup>
                    <SidebarGroupLabel className="capitalize ">
                      {resultType}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {searchResults[resultType as keyof typeof searchResults]
                          ?.length > 0 ? (
                          searchResults[
                            resultType as keyof typeof searchResults
                          ].map((user: userType) => (
                            <SidebarMenuItem key={user.user_name}>
                              <SidebarMenuButton
                                onClick={() => handleClick(user)}
                                asChild
                                className={`cursor-pointer hover:bg-background active:bg-background ${
                                  recipientDetails?.uid === user?.uid
                                    ? "bg-background"
                                    : ""
                                }`}
                              >
                                <div>
                                  <Avatar className="h-6 w-6 rounded-full bg-primary overflow-hidden flex items-center justify-center">
                                    <AvatarImage
                                      src={user.profilePic}
                                      className="object-cover"
                                    />
                                    <AvatarFallback>
                                      {user.user_name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span
                                    className={`${
                                      recipientDetails?.uid === user?.uid
                                        ? "text-secondary-foreground"
                                        : ""
                                    }`}
                                  >
                                    {user.user_name}
                                  </span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))
                        ) : (
                          <span className="text-sm italic text-white/60 capitalize px-2">
                            {resultType} not found!
                          </span>
                        )}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                );
              })}
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-2 h-[50px]">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="">
            <User />
          </Button>
          <Button variant="ghost" size="icon" className="">
            <Settings />
          </Button>
          <Button variant="ghost" size="icon" className="">
            <HelpCircle />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
