"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/firebase";
import { AppSidebar } from "@/src/components/appSideBar/AppSideBar";
import ChatSection from "@/src/components/chatSection/ChatSection";
import Navbar from "@/src/components/navbar/Navbar";
import {
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  userType,
} from "@/src/utilities";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function page() {
  const router = useRouter();
  const [recipientDetails, setRecipientDetails] = useState<
    userType | GenericObjectInterface
  >({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) console.log("Logged in:", user);
      else router.replace("/login")
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleSessionChange = () => {
      const recipientValue = getSessionStorageItem(keys.RECIPIENT_SELECTED);
      if (recipientValue) {
        setRecipientDetails(recipientValue);
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
      <AppSidebar recipientDetails={recipientDetails} />
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
