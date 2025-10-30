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
  GenericObjectInterface,
  inputChangeEventType,
  keys,
  setSessionStorageItem,
  userType,
} from "@/src/utilities";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import ProfilePictureDialogue from "../profilePicDialogBox/ProfilePictureDialogue";
import { Dialog } from "@/components/ui/dialog";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function AppSidebar({
  recipientDetails,
  usersList,
  userDetails,
}: {
  recipientDetails: userType | GenericObjectInterface;
  userDetails: userType | GenericObjectInterface;
  usersList: GenericObjectInterface;
}) {
  const router = useRouter();
  const [searchedText, setSearchedText] = useState("");
  const [openProfilePicture, setOpenProfilePicture] = useState(false);
  const [imageSrc, setimageSrc] = useState("");
  const [imageSrcFinal, setImageSrcFinal] = useState("");
  const [submittingImage, setSubmittingImage] = useState(false);
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
        // groups: groups.filter((el) =>
        //   el?.name?.toLowerCase()?.includes(searchedText)
        // ),
      };
    }

    return result;
  }, [searchedText]);

  const handleClick = (user: userType) => {
    setSessionStorageItem(keys.RECIPIENT_SELECTED, user);
  };

  const handleLogout = async () => {
    try {
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
      const userDocRef = doc(db, firebaseCollections.USERS, userDetails?.uid);
      await updateDoc(userDocRef, {
        profilePic: croppedImage,
      });
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

  return (
    <Sidebar className="border-border/40">
      <SidebarHeader className="border-b border-border/40 h-[60px]">
        <div className="flex items-center gap-2 p-2">
          <Dialog open={openProfilePicture}>
            <Button
              className="h-8 w-8 rounded-full bg-primary overflow-hidden p-0"
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
          <span className="text-[16px] font-semibold">
            {userDetails?.user_name} (You)
          </span>
        </div>
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
        {searchedText === "" ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className=" flex items-center gap-2">
                <Heart size={16} />
                Friends
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {usersList.map((user: userType) => (
                    <SidebarMenuItem key={user.uid}>
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
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator className="bg-border/40" />
            <SidebarGroup>
              <SidebarGroupLabel>Groups</SidebarGroupLabel>
              <SidebarGroupContent>
                <span className="text-foreground/40 text-sm italic flex items-center gap-2">
                  {" "}
                  <Users size={18} /> Coming soon...
                </span>
              </SidebarGroupContent>
              {/* <SidebarGroupContent>
                <SidebarMenu>
                  {groups.map((group: userType) => (
                    <SidebarMenuItem key={group.name}>
                      <SidebarMenuButton
                        onClick={() => handleClick(group)}
                        asChild
                        className={`hover:bg-background active:bg-background ${
                          recipientDetails?.id === group?.id
                            ? "bg-background"
                            : ""
                        }`}
                      >
                        <a href={group.url}>
                          <Avatar className="h-6 w-6 rounded-full overflow-hidden">
                            <AvatarImage
                              src={group.icon}
                              className="object-cover"
                            />
                            <AvatarFallback>G1</AvatarFallback>
                          </Avatar>
                          <span
                            className={`${
                              recipientDetails?.id === group?.id
                                ? "text-secondary-foreground"
                                : ""
                            }`}
                          >
                            {group.name}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent> */}
            </SidebarGroup>
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
