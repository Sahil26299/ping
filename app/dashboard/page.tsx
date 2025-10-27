"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth, db } from "@/lib/firebase";
import { AppSidebar } from "@/src/components/appSideBar/AppSideBar";
import ChatSection from "@/src/components/chatSection/ChatSection";
import Navbar from "@/src/components/navbar/Navbar";
import {
  firebaseCollections,
  GenericObjectInterface,
  getSessionStorageItem,
  keys,
  setSessionStorageItem,
  userType,
} from "@/src/utilities";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function page() {
  const router = useRouter();
  const [recipientDetails, setRecipientDetails] = useState<
    userType | GenericObjectInterface
  >({});
  const [userDetails, setUserDetails] = useState<
    userType | GenericObjectInterface
  >({});
  const [usersList, setUsersList] = useState<GenericObjectInterface>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetUsers = async (currentUserDetails: GenericObjectInterface) => {
    console.log("trying");

    try {
      // create a collection reference
      const usersRef = collection(db, firebaseCollections.USERS);
      // create a user query to get docs
      const usersQuery = query(usersRef);
      // pass query instance in getDocs to fetch snapshot of users collection.
      //
      const usersSnapsShot = await getDocs(usersQuery);
      let usersArray: GenericObjectInterface = [];
      usersSnapsShot?.forEach((doc) => {
        usersArray.push(doc.data());
      });
      console.log(usersArray,'usersArray');

      // set recipients list (filter out current user)
      setUsersList(usersArray?.filter((el:GenericObjectInterface)=>el?.uid !== currentUserDetails?.uid));

      // set current user details
      const currentUser = usersArray?.find(
        (el: GenericObjectInterface) => el?.uid === currentUserDetails?.uid
      );
      const dummyUserDetails:userType = {
        created_at: currentUser?.created_at,
        email: currentUser?.email,
        uid: currentUser?.uid,
        profilePic: currentUser?.profilePic,
        user_name: currentUser?.user_name,
        apiKey: currentUserDetails?.apiKey,
      }
      // current user details in state variable
      setUserDetails(dummyUserDetails);
      // current user details in session storage
      setSessionStorageItem(keys.USER_DETAILS, dummyUserDetails)
    } catch (error) {
      console.log(error, "[]");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        handleGetUsers(user);
      } else {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleSessionChange = () => {
      const recipientValue = getSessionStorageItem(keys.RECIPIENT_SELECTED);
      const userValue = getSessionStorageItem(keys.USER_DETAILS);
      if (recipientValue) {
        setRecipientDetails(recipientValue);
      }
      if (userValue) {
        setUserDetails(userValue);
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
      <AppSidebar
        userDetails={userDetails}
        recipientDetails={recipientDetails}
        usersList={usersList}
      />
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
