import React from "react";
import { AuthForm } from "../shared/AuthForm";
import { firebaseAuthService, getFormConfig } from "@/src/utilities";
import { UserCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

function LoginScreen() {
  const formConfig = getFormConfig("login");
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    // Simulate API call
    try {
      const userCredentials: UserCredential = (await firebaseAuthService(
        "login",
        values
      )) as UserCredential;
      const { user } = userCredentials;
      if (user.emailVerified) {
        // if emeil is verified via verification link sent while signing up
        toast.success("User logged in successfully!", {
          action: {
            label: "Continue",
            onClick: () => router.push("/dashboard"),
          },
          onAutoClose: () => {
            router.push("/dashboard");
          },
        });
      } else {
        // if not verified then show an error and ask user to resend verification link.
        toast.success("Email verification is pending!", {
          description:
            "Please verify your email using the verification link sent via email during signing up.",
          action: {
            label: "Resent Link",
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
      <Toaster position="top-center" />
    </>
  );
}

export default LoginScreen;
