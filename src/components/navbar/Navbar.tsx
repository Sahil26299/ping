"use client";
import * as React from "react";
import { Download, Moon, Sun } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import {
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  userType,
} from "@/src/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

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
      <NavigationMenu
        className="primary-background w-full max-w-full justify-between h-[60px] px-4 shadow dark:border-b dark:border-border/40 sticky top-0 z-10"
      >
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
      {(recipientDetails && recipientDetails?.name && (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 rounded-full overflow-hidden">
            <AvatarImage
              src={recipientDetails?.icon}
              className="object-cover"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span className="font-medium">{recipientDetails?.name}</span>
        </div>
      )) ||
        ""}
      <ThemeToggleButton />
    </NavigationMenu>
  );
}
