"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { GenericObjectInterface, userType } from "@/src/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      size={"icon"}
      variant="secondary"
      className="shadow"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

interface NavbarProps {
  variant?: "dashboard" | "landing";
  recipientDetails?: userType | GenericObjectInterface;
}

export default function Navbar({
  variant = "dashboard",
  recipientDetails,
}: NavbarProps) {
  
  // Landing page variant
  if (variant === "landing") {
    return (
      <NavigationMenu className="primary-background w-full max-w-full justify-between h-[60px] px-4 shadow dark:border-b dark:border-border/40 sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">Ping</span>
        </div>

        <NavigationMenuList className="gap-3">
          <NavigationMenuItem>
            <NavigationMenuLink
              href={"/login"}
              className="rounded border border-border/40 hover:bg-border/10 active:bg-border/10 text-foreground h-[40px] px-4 flex items-center hover:text-primary transition-colors font-semibold text-sm"
            >
              Log In
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={"/signup"}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-[40px] px-4 flex items-center rounded overflow-hidden font-semibold text-sm"
            >
              Sign Up
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  // Dashboard variant (default)
  return (
    <NavigationMenu
      viewport={false}
      className="primary-background w-full max-w-full justify-between h-[60px] px-4 shadow dark:border-b dark:border-border/40 sticky top-0 z-10"
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <SidebarTrigger />
        </NavigationMenuItem>
      </NavigationMenuList>
      {(recipientDetails && recipientDetails?.username && (
        <div className="flex gap-2 relative">
          <Avatar className="h-8 w-8 rounded-full bg-primary overflow-hidden flex items-center justify-center">
            <AvatarImage
              src={recipientDetails.profilePicture}
              className="object-cover"
            />
            <AvatarFallback>
              {recipientDetails.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <section className="flex flex-col">
            <span className="text-[16px] font-semibold leading-5">
              {recipientDetails?.username}
            </span>
            {recipientDetails?.isOnline ? (
              <span className="text-[11px] font-medium text-green-500 leading-3.5 absolute -bottom-[2px]">
                Online
              </span>
            ) : (
              <span className="text-[11px] w-[160px] text-slate-400 leading-3.5 absolute -bottom-[2px] line-clamp-1">
                {recipientDetails?.lastActive ? `Last seen ${dayjs(recipientDetails?.lastActive).fromNow()}` : "Offline"}
              </span>
            )}
          </section>
        </div>
      )) ||
        ""}
      <ThemeToggleButton />
    </NavigationMenu>
  );
}
