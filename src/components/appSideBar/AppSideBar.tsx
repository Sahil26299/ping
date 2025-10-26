import { Settings, HelpCircle, LogOut, User, SearchCheck } from "lucide-react";
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
import { useMemo, useState } from "react";
import { GenericObjectInterface, keys, setSessionStorageItem, userType } from "@/src/utilities";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const users = [
  {
    id: 1,
    name: "User 1",
    url: "#",
    icon: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    name: "User 2",
    url: "#",
    icon: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    name: "User 3",
    url: "#",
    icon: "https://github.com/shadcn.png",
  },
];
const groups = [
  {
    id: 4,
    name: "Group 1",
    url: "#",
    icon: "https://github.com/shadcn.png",
  },
  {
    id: 5,
    name: "Group 2",
    url: "#",
    icon: "https://github.com/shadcn.png",
  },
];

export function AppSidebar({
  recipientDetails,
}: {
  recipientDetails: userType | GenericObjectInterface;
}) {
  const router = useRouter();
  const [searchedText, setSearchedText] = useState("");

  const handleSearch = (value: string) => {
    setSearchedText(value);
  };

  const searchResults = useMemo(() => {
    let result = {
      users,
      groups,
    };
    if (searchedText !== "") {
      result = {
        users: users.filter((el) =>
          el?.name?.toLowerCase()?.includes(searchedText)
        ),
        groups: groups.filter((el) =>
          el?.name?.toLowerCase()?.includes(searchedText)
        ),
      };
    }

    return result;
  }, [searchedText]);

  const handleClick = (user: userType) => {
    setSessionStorageItem(keys.RECIPIENT_SELECTED, user);
  };

  const handleLogout = async() => {
    try {
      await signOut(auth);
    } catch (error) {
      
    }
  }

  return (
    <Sidebar className="border-border/40">
      <SidebarHeader className="border-b border-border/40 h-[60px]">
        <div className="flex items-center gap-2 p-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">P</span>
          </div>
          <span className="text-lg font-semibold">Ping</span>
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
              <SidebarGroupLabel>Users</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {users.map((user: userType) => (
                    <SidebarMenuItem key={user.name}>
                      <SidebarMenuButton
                        onClick={() => handleClick(user)}
                        asChild
                        className={`hover:bg-background active:bg-background ${recipientDetails?.id === user?.id ? "bg-background" : ""}`}
                      >
                        <a href={user.url}>
                          <Avatar className="h-6 w-6 rounded-full overflow-hidden">
                            <AvatarImage
                              src={user.icon}
                              className="object-cover"
                            />
                            <AvatarFallback>G1</AvatarFallback>
                          </Avatar>
                          <span className={`${recipientDetails?.id === user?.id ? "text-secondary-foreground" : ""}`} >{user.name}</span>
                        </a>
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
                <SidebarMenu>
                  {groups.map((group: userType) => (
                    <SidebarMenuItem key={group.name}>
                      <SidebarMenuButton
                        onClick={() => handleClick(group)}
                        asChild
                        className={`hover:bg-background active:bg-background ${recipientDetails?.id === group?.id ? "bg-background" : ""}`}
                      >
                        <a href={group.url}>
                          <Avatar className="h-6 w-6 rounded-full overflow-hidden">
                            <AvatarImage
                              src={group.icon}
                              className="object-cover"
                            />
                            <AvatarFallback>G1</AvatarFallback>
                          </Avatar>
                          <span className={`${recipientDetails?.id === group?.id ? "text-secondary-foreground" : ""}`}>{group.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
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
                            <SidebarMenuItem key={user.name}>
                              <SidebarMenuButton
                                onClick={() => handleClick(user)}
                                asChild
                                className={`hover:bg-background active:bg-background ${recipientDetails?.id === user?.id ? "bg-background" : ""}`}
                              >
                                <a href={user.url}>
                                  <Avatar className="h-6 w-6 rounded-full overflow-hidden">
                                    <AvatarImage
                                      src={user.icon}
                                      className="object-cover"
                                    />
                                    <AvatarFallback>G1</AvatarFallback>
                                  </Avatar>
                                  <span className={`${recipientDetails?.id === user?.id ? "text-secondary-foreground" : ""}`} >{user.name}</span>
                                </a>
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
