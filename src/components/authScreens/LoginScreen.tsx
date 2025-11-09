import React, { useEffect } from "react";
import { AuthForm } from "../shared/AuthForm";
import {
  firebaseAuthService,
  firebaseCollections,
  firestoreUpdateOperation,
  getFormConfig,
} from "@/src/utilities";
import { onAuthStateChanged, UserCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LoginScreen() {
  const formConfig = getFormConfig("login");
  const router = useRouter();

  /**
   * onAuthStateChanged is a firebase auth listener which gets triggered automatically when the login status of user changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // redirect to dashboard
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (values: Record<string, string>) => {
    // Simulate API call
    console.log(values,'values while login');
    try {
      
      const userCredentials: UserCredential = (await firebaseAuthService(
        "login",
        values
      )) as UserCredential;
      const { user } = userCredentials;
      console.log(user, "user");

      if (user.emailVerified) {
        // if emeil is verified via verification link sent while signing up
        toast.success("User logged in successfully!");

        // switch the online status of user to true
        await firestoreUpdateOperation(
          firebaseCollections.USERS,
          { isOnline: true },
          [user?.uid]
        );

        // redirect to dashboard
        router.push("/dashboard");
      } else {
        // if not verified then show an error and ask user to resend verification link.
        toast.success("Email verification is pending!", {
          description:
            "Please verify your email using the verification link sent via email during signing up.",
          action: {
            label: "Resend Link ?",
            onClick: async () => {
              try {
                await firebaseAuthService("sendVerificationLink", { user });
                toast.success(
                  "Verification link has been sent to your registered email address"
                );
              } catch (error) {}
            },
          },
        });
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(
        "Not able to login! Please re-check the credentials and try again."
      );
    }
    console.log("Login attempt:", values);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Google login logic would go here
  };

  const handleNavigateToSignup = () => {
    console.log("Navigate to signup");
    // Navigation logic would go here
  };

  return (
    <>
      <AuthForm
        formConfig={formConfig}
        onSubmit={handleSubmit}
        onSocialLogin={handleGoogleLogin}
        onFooterAction={handleNavigateToSignup}
      />
    </>
  );
}

export default LoginScreen;
