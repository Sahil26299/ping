import React from "react";
import { AuthForm } from "../shared/AuthForm";
import {
  firebaseAuthService,
  firebaseCollections,
  firestoreSetOperation,
  getFormConfig,
} from "@/src/utilities";
import { UserCredential } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SignupScreen() {
  const formConfig = getFormConfig("signup");
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential: UserCredential = (await firebaseAuthService(
        "signup",
        values
      )) as UserCredential;
      const user = userCredential.user;
      console.log("Signup attempt:", user);

      // 2️⃣ Send verification link
      await firebaseAuthService("sendVerificationLink", { user });

      // 4️⃣ Update Firebase user profile (optional)
      await firebaseAuthService("updateProfile", {
        user,
        username: values?.username,
      });

      // 3️⃣ Store extra user info in Firestore
      firestoreSetOperation(
        firebaseCollections.USERS,
        {
          uid: user.uid,
          user_name: values?.username,
          profilePic: "",
          email: values?.email,
          created_at: serverTimestamp(),
        },
        [user.uid]
      );

      toast.success("User registered successfully!", {
        description:
          "Verification link has been sent to your registered email address",
        action: {
          label: "Okay",
          onClick: () => router.push("/login"),
        },
        onAutoClose: () => {
          router.push("/login");
        },
      });
    } catch (error) {}
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");

    // Google signup logic would go here
  };

  const handleNavigateToLogin = () => {
    console.log("Navigate to login");
    // Navigation logic would go here
  };

  return (
    <>
      <AuthForm
        formConfig={formConfig}
        onSubmit={handleSubmit}
        onSocialLogin={handleGoogleSignup}
        onFooterAction={handleNavigateToLogin}
      />
    </>
  );
}

export default SignupScreen;
