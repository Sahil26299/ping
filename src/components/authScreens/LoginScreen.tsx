import React, { useEffect } from "react";
import { AuthForm } from "../shared/AuthForm";
import { fetchUserProfile, getFormConfig, loginUser } from "@/src/utilities";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LoginScreen() {
  const formConfig = getFormConfig("login");
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const response = await fetchUserProfile();
    if (response.status === 200) {
      router.push("/dashboard");
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const response = await loginUser(values);

      if (response.status === 200) {
        toast.success("User logged in successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error ||
          "Not able to login! Please re-check the credentials and try again."
      );
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked - Not implemented yet");
  };

  const handleNavigateToSignup = () => {
    router.push("/signup");
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
