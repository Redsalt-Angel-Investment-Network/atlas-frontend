"use client";

import { useRouter } from "next/navigation";
import { loginApi } from "@/app/(auth)/index";
import { toast } from "sonner";
import LoginForm from "./components/LoginForm";
import { LoginFormValues } from "./schema";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (values: LoginFormValues) => {
    try {

      const data = await loginApi({
        email: values.email,
        password: values.password,
      });

      if (!data) {
        return;
      }

      toast.success("Login successful.");

      router.push("/dashboard");
    } catch (error) {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-slate-100
      px-6
    "
    >
      <LoginForm onSubmit={handleLogin} />
    </main>
  );
}