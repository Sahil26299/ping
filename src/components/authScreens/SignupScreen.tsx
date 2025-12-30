import React from "react";
import { AuthForm } from "../shared/AuthForm";
import { getFormConfig, registerUser } from "@/src/utilities";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SignupScreen() {
  const formConfig = getFormConfig("signup");
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    console.log(values,'values');
    
    try {
      const response = await registerUser(values);

      if (response.status === 201) {
        toast.success("User registered successfully!", {
          description: "Please login with your credentials.",
          action: {
            label: "Login",
            onClick: () => router.push("/login"),
          },
          onAutoClose: () => {
            router.push("/login");
          },
        });
        router.push("/login"); // Immediate redirect or wait?
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked - Not implemented yet");
  };

  const handleNavigateToLogin = () => {
    router.push("/login");
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
