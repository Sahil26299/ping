import {
  Settings,
  HelpCircle,
  LogOut,
  User,
  SearchCheck,
  UserRoundCog,
  Headset,
  Eye,
  EyeOff,
  Loader2,
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
  createUserChats,
  emptySessionStorage,
  GenericObjectInterface,
  inputChangeEventType,
  keys,
  logoutUser,
  postChatMessages,
  setSessionStorageItem,
  updateUserProfile,
  userType,
} from "@/src/utilities";
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
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import LottieAnimationProvider from "../lottieAnimProvider/LottieAnimationProvider";
import chatAnimationEmptySpace from "@/public/lottieFiles/chatAnimationEmptySpace.json";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// ===== Sub Components =====

function UserSettingsDropdown({
  onProfileOpen,
  onLogoutOpen,
}: {
  onProfileOpen: () => void;
  onLogoutOpen: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"icon"}
          variant={"ghost"}
          className="ring-0 bg-none hover:bg-none border-none outline-none h-8 w-8 flex items-center gap-2 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <UserRoundCog size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <User size={18} />
            My Account
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup className="ml-2">
          <DropdownMenuItem onSelect={onProfileOpen}>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2">
          <Headset size={18} /> Developer Support
        </DropdownMenuLabel>
        <DropdownMenuGroup className="ml-2">
          <DropdownMenuItem>
            <Link
              href="mailto:sahillokhande94@gmail.com"
              target="_blank"
              className="w-full h-full"
            >
              Email
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="https://github.com/Sahil26299"
              target="_blank"
              className="w-full h-full"
            >
              GitHub
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="https://www.linkedin.com/in/sahillokhande26"
              target="_blank"
              className="w-full h-full"
            >
              Linkedin
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="https://my-portfolio-next-mauve.vercel.app/"
              target="_blank"
              className="w-full h-full"
            >
              Portfolio
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onLogoutOpen}>
          <div className="flex items-center gap-2">
            <LogOut size={18} /> Log out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EditProfileDialog({
  isOpen,
  onOpenChange,
  userDetails,
  imageSrcFinal,
  submittingImage,
  showPassword,
  updatedPassword,
  updateProfileError,
  onPasswordToggle,
  onPasswordChange,
  onProfilePicChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userDetails: userType | GenericObjectInterface;
  imageSrcFinal: string;
  submittingImage: boolean;
  showPassword: boolean;
  updatedPassword: any;
  updateProfileError: string;
  onPasswordToggle: () => void;
  onPasswordChange: (field: string, value: string) => void;
  onProfilePicChange: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-w-2/5">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          {submittingImage ? (
            <Spinner />
          ) : (
            <Avatar className="flex items-center justify-center bg-primary rounded-full h-20 w-20 select-none">
              <AvatarImage
                src={imageSrcFinal}
                className="object-contain h-full w-full rounded-full"
              />
              <AvatarFallback className="text-xl font-bold">
                {userDetails.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <Button
            className=" text-sm"
            variant={"ghost"}
            onClick={onProfilePicChange}
          >
            Change photo
          </Button>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              disabled
              defaultValue={userDetails?.username}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              disabled
              defaultValue={userDetails?.email}
              className="col-span-3"
            />
          </div>
          <Separator className="my-4" />
          <h4 className="text-base md:text-lg font-semibold flex items-center gap-2">
            Change Password{" "}
            <Button
              size={"icon-sm"}
              variant={"ghost"}
              className="bg-none"
              onClick={onPasswordToggle}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </Button>
          </h4>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="old-password" className="text-right">
              Old Password
            </Label>
            <Input
              id="old-password"
              type={showPassword ? "text" : "password"}
              onChange={(ev) =>
                onPasswordChange("oldPassword", ev.target.value)
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New Password
            </Label>
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              onChange={(ev) =>
                onPasswordChange("newPassword", ev.target.value)
              }
              className="col-span-3"
            />
          </div>
        </div>
        {updateProfileError && (
          <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30">
            {updateProfileError}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            // onClick={handleChangePassword}
            disabled={updatedPassword.submittingDetails}
          >
            {updatedPassword.submittingDetails ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LogoutConfirmDialog({
  isOpen,
  onOpenChange,
  onLogout,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onLogout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PingUserDialog({
  selectedUser,
  onSend,
}: {
  selectedUser: userType | null;
  onSend: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Start chatting?</DialogTitle>
        <DialogDescription>
          Send Hi! to {selectedUser?.username}.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex items-center gap-4">
          <DialogClose
            onClick={onSend}
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
  );
}

function UserAvatar({
  user,
  size = "h-8 w-8",
}: {
  user: userType | GenericObjectInterface;
  size?: string;
}) {
  return (
    <Avatar
      className={`${size} rounded-full bg-primary overflow-hidden flex items-center justify-center`}
    >
      <AvatarImage src={user.profilePicture} className="object-cover" />
      <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

function ChatListItem({
  chat,
  chatRecipient,
  recipientDetails,
  onSelectUser,
}: {
  chat: GenericObjectInterface;
  chatRecipient: userType;
  recipientDetails: userType | GenericObjectInterface;
  onSelectUser: (user: userType, chatId: string) => void;
}) {
  console.log(chat, "chat");

  return (
    <SidebarMenuItem key={chatRecipient?.uid}>
      <SidebarMenuButton
        onClick={() => onSelectUser(chatRecipient, chat?.chatRef)}
        asChild
        className={`h-[45px] p-2 cursor-pointer flex items-center justify-between hover:bg-background active:bg-background ${
          recipientDetails?.uid === chatRecipient?.uid ? "bg-background" : ""
        }`}
      >
        <div>
          <section className="flex items-center gap-2">
            <UserAvatar user={chatRecipient} />
            <section className="flex flex-col">
              <span
                className={`flex items-center gap-2${
                  recipientDetails?.uid === chatRecipient?.uid
                    ? "text-secondary-foreground"
                    : ""
                }`}
              >
                {chatRecipient?.username}
                {chat?.unReadCount !== 0 && (
                  <sup className="h-4 w-4 text-background text-[10px] ml-1 font-medium rounded-full bg-green-600 flex flex-col items-center justify-center">
                    {chat?.unReadCount}
                  </sup>
                )}
              </span>
              <div
                dangerouslySetInnerHTML={{
                  __html: chat?.lastMessage?.text || "Started a chat",
                }}
                className="text-[12px] font-medium text-slate-400 leading-3.5 line-clamp-1"
              ></div>
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

function GlobalUserItem({
  user,
  recipientDetails,
  onPingClick,
}: {
  user: userType;
  recipientDetails: userType | GenericObjectInterface;
  onPingClick: () => void;
}) {
  return (
    <SidebarMenuItem key={user.uid}>
      <SidebarMenuButton
        asChild
        className={`h-[45px] group/aGroup p-2 cursor-pointer flex items-center justify-between hover:bg-transparent active:bg-transparent`}
      >
        <div>
          <section className="flex items-center gap-2">
            <UserAvatar user={user} />
            <span
              className={`${
                recipientDetails?.uid === user?.uid
                  ? "text-secondary-foreground"
                  : ""
              }`}
            >
              {user.username}
            </span>
          </section>
          <DialogTrigger
            onClick={onPingClick}
            className="opacity-0 group-hover/aGroup:opacity-100 h-[24px] text-sm font-normal bg-primary px-2 rounded-md cursor-pointer"
          >
            Ping
          </DialogTrigger>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ===== Main Component =====

export function AppSidebar({
  recipientDetails,
  usersList,
  userDetails,
  listLoading,
  chatList,
  handleSelectUser
}: {
  recipientDetails: userType | GenericObjectInterface;
  userDetails: userType | GenericObjectInterface;
  usersList: userType[];
  listLoading: boolean;
  chatList: GenericObjectInterface[];
  handleSelectUser: (selectedUser: userType, chatId: string) => void;
}) {
  const router = useRouter();
  const [searchedText, setSearchedText] = useState("");
  const [openProfilePicture, setOpenProfilePicture] = useState(false);
  const [imageSrc, setimageSrc] = useState("");
  const [imageSrcFinal, setImageSrcFinal] = useState("");
  const [submittingImage, setSubmittingImage] = useState(false);
  const [pingUserSelected, setPingUserSelected] = useState<userType | null>(
    null
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState<any>({
    oldPassword: "",
    newPassword: "",
    submittingDetails: false,
  });
  const [updateProfileError, setUpdateProfileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageSrcFinal(userDetails?.profilePicture || "");
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
          el?.username?.toLowerCase()?.includes(searchedText.toLowerCase())
        ),
      };
    }

    return result;
  }, [searchedText, usersList]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
    } finally {
      emptySessionStorage();
      router.push("/login");
    }
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
      await updateUserProfile({ profilePicture: croppedImage });
      toast("Profile pic updated!");
    } catch (error) {
      console.log(error, "error");
      toast.error("Failed to update profile pic");
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
      if (!pingUserSelected) return;

      const res: GenericObjectInterface = await createUserChats({
        recipientId: pingUserSelected.uid,
      });
      const chatId = res?.data?.chat._id;

      await postChatMessages({
        chatId,
        content: "Hi!",
        type: "text",
      });

      handleSelectUser(pingUserSelected, chatId);
      toast.success("Sent Hi!");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const extractRecipientFromChatUsers = (usersArray: userType[]) => {
    return usersArray?.find((el) => el?.uid !== userDetails?.uid);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setUpdateProfileError("");
    setUpdatedPassword({ ...updatedPassword, [field]: value });
  };

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
                      {userDetails.username?.charAt(0).toUpperCase()}
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
                {userDetails?.username} (You)
              </span>
              <span className="text-[11px] font-medium text-green-500 leading-3.5">
                Online
              </span>
            </section>
            <div className="flex flex-grow" />
            <UserSettingsDropdown
              onProfileOpen={() => setIsProfileOpen(true)}
              onLogoutOpen={() => setIsLogoutOpen(true)}
            />
          </div>
        )}

        <EditProfileDialog
          isOpen={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          userDetails={userDetails}
          imageSrcFinal={imageSrcFinal}
          submittingImage={submittingImage}
          showPassword={showPassword}
          updatedPassword={updatedPassword}
          updateProfileError={updateProfileError}
          onPasswordToggle={() => setShowPassword(!showPassword)}
          onPasswordChange={handlePasswordChange}
          onProfilePicChange={handleProfilePicChange}
        />

        <LogoutConfirmDialog
          isOpen={isLogoutOpen}
          onOpenChange={setIsLogoutOpen}
          onLogout={handleLogout}
        />
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
                          <ChatListItem
                            key={chatRecipient.uid}
                            chat={chat}
                            chatRecipient={chatRecipient}
                            recipientDetails={recipientDetails}
                            onSelectUser={handleSelectUser}
                          />
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
                    {searchResults?.users?.map((user: userType) => (
                      <GlobalUserItem
                        key={user.uid}
                        user={user}
                        recipientDetails={recipientDetails}
                        onPingClick={() => setPingUserSelected(user)}
                      />
                    ))}
                    <PingUserDialog
                      selectedUser={pingUserSelected}
                      onSend={handleSendMessage}
                    />
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
                {searchResults?.users?.length > 0
                  ? `Search results for "${searchedText}"!`
                  : `No matching results found for "${searchedText}"!`}
              </span>
            </div>
            {searchResults?.users?.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="capitalize ">
                  Users
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {searchResults.users.map((user: userType) => (
                      <SidebarMenuItem
                        key={`${user.username}_${user?.isOnline}`}
                      >
                        <SidebarMenuButton
                          // onClick={() => handleSelectUser(user)}
                          asChild
                          className={`cursor-pointer hover:bg-background active:bg-background ${
                            recipientDetails?.uid === user?.uid
                              ? "bg-background"
                              : ""
                          }`}
                        >
                          <div>
                            <UserAvatar user={user} size="h-6 w-6" />
                            <span
                              className={`${
                                recipientDetails?.uid === user?.uid
                                  ? "text-secondary-foreground"
                                  : ""
                              }`}
                            >
                              {user.username}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
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
